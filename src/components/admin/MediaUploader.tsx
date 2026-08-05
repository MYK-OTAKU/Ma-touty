"use client";

import { useState, useRef } from "react";
import { createServerClient } from "@/lib/supabase";
import { Upload, X, Image, Music, Video } from "lucide-react";
import { supabase, getPublicUrl, type Media } from "@/lib/supabase";

interface MediaUploaderProps {
  pageId?: string | null;
  mediaType: "photo" | "video" | "audio";
  isGlobal?: boolean;
  existingMedia?: Media[];
  onUploadComplete?: () => void;
  label?: string;
}

const bucketMap: Record<string, string> = {
  photo: "photos",
  video: "videos",
  audio: "audio",
};

const acceptMap: Record<string, string> = {
  photo: "image/*",
  video: "video/*",
  audio: "audio/*",
};

const iconMap = {
  photo: <Image className="w-8 h-8 text-white/30" />,
  video: <Video className="w-8 h-8 text-white/30" />,
  audio: <Music className="w-8 h-8 text-white/30" />,
};

export default function MediaUploader({
  pageId,
  mediaType,
  isGlobal = false,
  existingMedia = [],
  onUploadComplete,
  label,
}: MediaUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    if (!file) return;
    setUploading(true);
    setProgress(10);

    const bucket = bucketMap[mediaType];
    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
    const path = pageId ? `${pageId}/${fileName}` : `global/${fileName}`;

    try {
      // Upload to Storage
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(path, file, { upsert: false });

      if (uploadError) throw uploadError;
      setProgress(70);

      // Record in media table
      const { error: insertError } = await supabase.from("media").insert({
        page_id: isGlobal ? null : pageId,
        type: mediaType,
        storage_path: path,
        bucket_name: bucket,
        is_global: isGlobal,
        display_order: existingMedia.length,
      });

      if (insertError) throw insertError;
      setProgress(100);
      onUploadComplete?.();
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Erreur lors du téléchargement");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleDelete = async (media: Media) => {
    if (!confirm("Supprimer ce fichier ?")) return;

    await supabase.storage.from(media.bucket_name).remove([media.storage_path]);
    await supabase.from("media").delete().eq("id", media.id);
    onUploadComplete?.();
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleUpload(file);
  };

  return (
    <div className="space-y-3">
      {label && <p className="text-sm font-medium text-white/70">{label}</p>}

      {/* Upload Zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`relative w-full rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 p-6 flex flex-col items-center justify-center gap-2 ${
          dragOver
            ? "border-pink-500 bg-pink-500/10"
            : "border-white/15 hover:border-white/30 bg-white/3"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptMap[mediaType]}
          onChange={onFileChange}
          className="hidden"
        />

        {uploading ? (
          <div className="w-full">
            <div className="flex justify-between text-xs text-white/60 mb-1">
              <span>Téléchargement...</span>
              <span>{progress}%</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-pink-500 to-rose-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : (
          <>
            {iconMap[mediaType]}
            <p className="text-sm text-white/50">
              Glisser-déposer ou <span className="text-pink-400 underline">cliquer ici</span>
            </p>
          </>
        )}
      </div>

      {/* Existing Media Preview */}
      {existingMedia.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {existingMedia.map((m) => {
            const url = getPublicUrl(m.bucket_name, m.storage_path);
            return (
              <div key={m.id} className="relative group rounded-lg overflow-hidden bg-white/5 border border-white/10">
                {m.type === "photo" && (
                  <img src={url} alt="" className="w-full h-24 object-cover" />
                )}
                {m.type === "video" && (
                  <video src={url} className="w-full h-24 object-cover" />
                )}
                {m.type === "audio" && (
                  <div className="flex items-center gap-2 px-3 py-4">
                    <Music className="w-5 h-5 text-pink-400 shrink-0" />
                    <p className="text-xs text-white/60 truncate">{m.storage_path.split("/").pop()}</p>
                  </div>
                )}
                <button
                  onClick={() => handleDelete(m)}
                  className="absolute top-1 right-1 p-1 rounded-full bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
