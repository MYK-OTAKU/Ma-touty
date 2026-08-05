"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase, type Page, type Media } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Type, Keyboard, Camera, Video, LayoutTemplate } from "lucide-react";
import MediaUploader from "@/components/admin/MediaUploader";
import Link from "next/link";
import { use } from "react";

const templates = [
  { id: "text-only",   emoji: "📝", label: "Texte seul",       desc: "Effet de frappe plein écran" },
  { id: "text-photo",  emoji: "🖼️", label: "Texte + Photo",    desc: "Polaroïd + texte" },
  { id: "full-photo",  emoji: "🌅", label: "Photo plein écran", desc: "Image avec texte en overlay" },
  { id: "thank-you",   emoji: "💕", label: "Remerciements",    desc: "Design spécial mercis" },
];

interface PageEditorProps {
  params: Promise<{ id: string }>;
}

export default function PageEditor({ params }: PageEditorProps) {
  const { id } = use(params);
  const router = useRouter();
  const [page, setPage] = useState<Partial<Page>>({
    title: "", subtitle: "", body: "", polaroid_caption: "",
    template: "text-only", typing_effect: true,
  });
  const [photos, setPhotos] = useState<Media[]>([]);
  const [videos, setVideos] = useState<Media[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchPage = useCallback(async () => {
    const [{ data: pageData }, { data: mediaData }] = await Promise.all([
      supabase.from("pages").select("*").eq("id", id).single(),
      supabase.from("media").select("*").eq("page_id", id).order("display_order"),
    ]);
    if (pageData) setPage(pageData);
    if (mediaData) {
      setPhotos(mediaData.filter((m: Media) => m.type === "photo"));
      setVideos(mediaData.filter((m: Media) => m.type === "video"));
    }
    setLoading(false);
  }, [id]);

  useEffect(() => { fetchPage(); }, [fetchPage]);

  const handleSave = async () => {
    setSaving(true);
    await supabase.from("pages").update({
      title: page.title, subtitle: page.subtitle, body: page.body,
      polaroid_caption: page.polaroid_caption, template: page.template,
      typing_effect: page.typing_effect, updated_at: new Date().toISOString(),
    }).eq("id", id);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const needsMedia = page.template === "text-photo" || page.template === "full-photo";

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-white/40 text-sm">Chargement...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/5 px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="p-2 rounded-xl hover:bg-white/10 transition-colors text-white/60 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <p className="font-semibold text-sm text-white">{page.title || "Sans titre"}</p>
            <p className="text-white/40 text-xs">Éditeur de page</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-sm font-semibold rounded-xl hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
        >
          {saved ? <><Check className="w-4 h-4" /> Sauvegardé</> : saving ? "Sauvegarde..." : "Sauvegarder"}
        </button>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-5">

        {/* ── 1. TEMPLATE PICKER ── */}
        <section className="bg-white/5 border border-white/8 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <LayoutTemplate className="w-4 h-4 text-pink-400" />
            <h2 className="text-sm font-semibold text-white/80">Design de la page</h2>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {templates.map((t) => (
              <button
                key={t.id}
                onClick={() => setPage((p) => ({ ...p, template: t.id as Page["template"] }))}
                className={`text-left p-4 rounded-xl border transition-all cursor-pointer ${
                  page.template === t.id
                    ? "bg-pink-500/15 border-pink-500/50 text-white"
                    : "bg-white/3 border-white/8 text-white/50 hover:border-white/20 hover:text-white"
                }`}
              >
                <div className="text-2xl mb-1.5">{t.emoji}</div>
                <div className="text-xs font-semibold">{t.label}</div>
                <div className="text-xs opacity-60 mt-0.5">{t.desc}</div>
              </button>
            ))}
          </div>
        </section>

        {/* ── 2. TEXTE ── */}
        <section className="bg-white/5 border border-white/8 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Type className="w-4 h-4 text-pink-400" />
            <h2 className="text-sm font-semibold text-white/80">Contenu Textuel</h2>
          </div>

          <div>
            <label className="block text-xs text-white/40 mb-1.5">Titre principal</label>
            <input
              type="text"
              value={page.title ?? ""}
              onChange={(e) => setPage((p) => ({ ...p, title: e.target.value }))}
              placeholder="Ex : Joyeux Anniversaire ❤️"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-pink-500/60 transition-all text-sm"
            />
          </div>

          {page.template !== "text-only" && (
            <div>
              <label className="block text-xs text-white/40 mb-1.5">Sous-titre (optionnel)</label>
              <input
                type="text"
                value={page.subtitle ?? ""}
                onChange={(e) => setPage((p) => ({ ...p, subtitle: e.target.value }))}
                placeholder="Ex : à L'Amour de Ma Vie 🥳"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-pink-500/60 transition-all text-sm"
              />
            </div>
          )}

          <div>
            <label className="block text-xs text-white/40 mb-1.5">Corps du message</label>
            <textarea
              value={page.body ?? ""}
              onChange={(e) => setPage((p) => ({ ...p, body: e.target.value }))}
              placeholder="Écrivez votre message ici..."
              rows={5}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/20 resize-y focus:outline-none focus:border-pink-500/60 transition-all text-sm leading-relaxed"
            />
          </div>

          {needsMedia && (
            <div>
              <label className="block text-xs text-white/40 mb-1.5">Légende du polaroïd</label>
              <input
                type="text"
                value={page.polaroid_caption ?? ""}
                onChange={(e) => setPage((p) => ({ ...p, polaroid_caption: e.target.value }))}
                placeholder="Ex : Toi & Moi ✨"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-pink-500/60 transition-all text-sm"
              />
            </div>
          )}

          {/* Typing effect toggle */}
          <button
            onClick={() => setPage((p) => ({ ...p, typing_effect: !p.typing_effect }))}
            className={`flex items-center gap-3 w-full p-3.5 rounded-xl border transition-all cursor-pointer ${
              page.typing_effect
                ? "bg-pink-500/10 border-pink-500/30 text-pink-300"
                : "bg-white/3 border-white/10 text-white/40"
            }`}
          >
            <Keyboard className="w-4 h-4 shrink-0" />
            <div className="text-left flex-1">
              <div className="text-sm font-medium">Effet de frappe activé</div>
              <div className="text-xs opacity-60">Le texte apparaît lettre par lettre</div>
            </div>
            <div className={`w-9 h-5 rounded-full transition-colors shrink-0 ${page.typing_effect ? "bg-pink-500" : "bg-white/20"}`}>
              <div
                className="w-3.5 h-3.5 rounded-full bg-white mt-[3px] transition-all"
                style={{ marginLeft: page.typing_effect ? "18px" : "3px" }}
              />
            </div>
          </button>
        </section>

        {/* ── 3. PHOTOS ── (only for templates that use them) */}
        {needsMedia && (
          <section className="bg-white/5 border border-white/8 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <Camera className="w-4 h-4 text-pink-400" />
              <h2 className="text-sm font-semibold text-white/80">Photos</h2>
              <span className="ml-auto text-xs text-white/30 bg-white/5 px-2 py-0.5 rounded-full">
                {photos.length} photo{photos.length !== 1 ? "s" : ""}
              </span>
            </div>
            <p className="text-xs text-white/40">
              La première photo uploadée sera utilisée comme image principale dans le cadre polaroïd.
            </p>
            <MediaUploader
              pageId={id}
              mediaType="photo"
              existingMedia={photos}
              onUploadComplete={fetchPage}
            />
          </section>
        )}

        {/* ── 4. VIDÉOS ── (only for templates that use them) */}
        {needsMedia && (
          <section className="bg-white/5 border border-white/8 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <Video className="w-4 h-4 text-pink-400" />
              <h2 className="text-sm font-semibold text-white/80">Vidéos</h2>
              <span className="ml-auto text-xs text-white/30 bg-white/5 px-2 py-0.5 rounded-full">
                {videos.length} vidéo{videos.length !== 1 ? "s" : ""}
              </span>
            </div>
            <p className="text-xs text-white/40">
              Optionnel — ajoutez une vidéo à afficher sur cette page.
            </p>
            <MediaUploader
              pageId={id}
              mediaType="video"
              existingMedia={videos}
              onUploadComplete={fetchPage}
            />
          </section>
        )}

        {/* Bottom save button for convenience */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold hover:opacity-90 active:scale-98 transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
        >
          {saved ? <><Check className="w-4 h-4" /> Sauvegardé avec succès !</> : saving ? "Sauvegarde en cours..." : "Sauvegarder la page"}
        </button>

      </main>
    </div>
  );
}
