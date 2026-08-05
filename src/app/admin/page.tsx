"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase, type Page, type Media } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut, Plus, Settings, Music, Layers, ChevronRight,
  Trash2, GripVertical, Check, Heart
} from "lucide-react";
import MediaUploader from "@/components/admin/MediaUploader";
import Link from "next/link";

const templateLabels: Record<string, string> = {
  "text-only": "📝 Texte seul",
  "text-photo": "🖼️ Texte + Photo",
  "full-photo": "🌅 Photo plein écran",
  "thank-you": "💕 Remerciements",
};

export default function AdminDashboard() {
  const router = useRouter();
  const [pages, setPages] = useState<Page[]>([]);
  const [globalMedia, setGlobalMedia] = useState<Media[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<"pages" | "settings" | "music">("pages");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const fetchData = useCallback(async () => {
    const [{ data: pagesData }, { data: mediaData }, { data: settingsData }] = await Promise.all([
      supabase.from("pages").select("*").order("position"),
      supabase.from("media").select("*").eq("is_global", true),
      supabase.from("settings").select("key, value"),
    ]);
    if (pagesData) setPages(pagesData);
    if (mediaData) setGlobalMedia(mediaData);
    if (settingsData) {
      const map: Record<string, string> = {};
      settingsData.forEach((s) => { map[s.key] = s.value ?? ""; });
      setSettings(map);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  const handleDeletePage = async (id: string) => {
    if (!confirm("Supprimer cette page ?")) return;
    await supabase.from("pages").delete().eq("id", id);
    fetchData();
  };

  const handleAddPage = async () => {
    const newPosition = pages.length + 1;
    const { data } = await supabase.from("pages").insert({
      position: newPosition,
      template: "text-only",
      title: "Nouvelle page",
      body: "",
      typing_effect: true,
    }).select().single();
    if (data) {
      router.push(`/admin/pages/${data.id}`);
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    const updates = Object.entries(settings).map(([key, value]) =>
      supabase.from("settings").upsert({ key, value, updated_at: new Date().toISOString() })
    );
    await Promise.all(updates);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tabs = [
    { id: "pages", label: "Pages", icon: <Layers className="w-4 h-4" /> },
    { id: "settings", label: "Réglages", icon: <Settings className="w-4 h-4" /> },
    { id: "music", label: "Musique", icon: <Music className="w-4 h-4" /> },
  ] as const;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/5 px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-pink-500/10 border border-pink-500/20">
            <Heart className="w-5 h-5 text-pink-400" />
          </div>
          <div>
            <h1 className="font-bold text-white text-sm">Interface Admin</h1>
            <p className="text-white/40 text-xs">Site Anniversaire</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/"
            target="_blank"
            className="text-xs text-white/50 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
          >
            Voir le site →
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs text-red-400/80 hover:text-red-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-500/10 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Déconnexion
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-1 bg-white/5 rounded-xl p-1 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "bg-white/10 text-white shadow-sm"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* === PAGES TAB === */}
          {activeTab === "pages" && (
            <motion.div key="pages" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-white/80">Pages du Storybook ({pages.length})</h2>
                <button
                  onClick={handleAddPage}
                  className="flex items-center gap-2 px-4 py-2 bg-pink-500 hover:bg-pink-600 rounded-xl text-sm font-medium transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Ajouter une page
                </button>
              </div>

              <div className="space-y-2">
                {pages.length === 0 && (
                  <div className="text-center py-12 text-white/30">
                    <Layers className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm">Aucune page — cliquez sur "Ajouter" pour commencer</p>
                  </div>
                )}
                {pages.map((page, idx) => (
                  <div
                    key={page.id}
                    className="group flex items-center gap-3 bg-white/5 border border-white/8 rounded-xl p-4 hover:bg-white/8 transition-colors"
                  >
                    <GripVertical className="w-4 h-4 text-white/20 shrink-0" />
                    <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-bold shrink-0">
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-white truncate">{page.title || "Sans titre"}</p>
                      <p className="text-xs text-white/40">{templateLabels[page.template]}</p>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link
                        href={`/admin/pages/${page.id}`}
                        className="flex items-center gap-1 px-3 py-1.5 bg-white/10 hover:bg-white/15 rounded-lg text-xs font-medium transition-colors"
                      >
                        Modifier <ChevronRight className="w-3 h-3" />
                      </Link>
                      <button
                        onClick={() => handleDeletePage(page.id)}
                        className="p-1.5 text-red-400/60 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* === SETTINGS TAB === */}
          {activeTab === "settings" && (
            <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
              <h2 className="font-semibold text-white/80 mb-4">Paramètres Globaux</h2>

              {[
                { key: "birthday_name", label: "Prénom de l'anniversaire", placeholder: "N'Deye Fatou Diop" },
                { key: "birthday_age", label: "Âge fêté", placeholder: "21" },
                { key: "secret_code", label: "Code Secret (4 chiffres)", placeholder: "0608" },
                { key: "final_message", label: "Message final (carte de vœux)", placeholder: "Je t'aime de tout mon cœur. ❤️" },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-white/60 mb-2">{label}</label>
                  {key === "final_message" ? (
                    <textarea
                      value={settings[key] ?? ""}
                      onChange={(e) => setSettings((prev) => ({ ...prev, [key]: e.target.value }))}
                      placeholder={placeholder}
                      rows={3}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/25 resize-none focus:outline-none focus:border-pink-500/50 transition-all text-sm"
                    />
                  ) : (
                    <input
                      type="text"
                      value={settings[key] ?? ""}
                      onChange={(e) => setSettings((prev) => ({ ...prev, [key]: e.target.value }))}
                      placeholder={placeholder}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/25 focus:outline-none focus:border-pink-500/50 transition-all text-sm"
                    />
                  )}
                </div>
              ))}

              <button
                onClick={handleSaveSettings}
                disabled={saving}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {saved ? <><Check className="w-4 h-4" /> Sauvegardé !</> : saving ? "Sauvegarde..." : "Sauvegarder les réglages"}
              </button>
            </motion.div>
          )}

          {/* === MUSIC TAB === */}
          {activeTab === "music" && (
            <motion.div key="music" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <h2 className="font-semibold text-white/80 mb-4">Musique de Fond</h2>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <p className="text-sm text-white/50 mb-4">
                  Uploadez un fichier MP3 qui jouera en boucle lorsqu'elle accède au site après avoir entré le code secret.
                </p>
                <MediaUploader
                  mediaType="audio"
                  isGlobal={true}
                  existingMedia={globalMedia.filter((m) => m.type === "audio")}
                  onUploadComplete={fetchData}
                  label="Fichier audio (MP3 recommandé)"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
