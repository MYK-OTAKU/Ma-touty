"use client";

import { useEffect, useState } from "react";
import { supabase, getPublicUrl, type Page, type SettingsMap, type Media } from "@/lib/supabase";

// --- Pages with their media ---
export function usePagesWithMedia() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPages() {
      try {
        const { data: pagesData, error: pagesError } = await supabase
          .from("pages")
          .select("*")
          .order("position", { ascending: true });

        if (pagesError) throw pagesError;

        // Fetch all media
        const { data: mediaData, error: mediaError } = await supabase
          .from("media")
          .select("*")
          .order("display_order", { ascending: true });

        if (mediaError) throw mediaError;

        // Join media to pages
        const pagesWithMedia = (pagesData || []).map((page) => ({
          ...page,
          media: (mediaData || []).filter((m: Media) => m.page_id === page.id),
        }));

        setPages(pagesWithMedia);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur de chargement");
      } finally {
        setLoading(false);
      }
    }

    fetchPages();
  }, []);

  return { pages, loading, error };
}

// --- Settings map ---
export function useSettings() {
  const [settings, setSettings] = useState<SettingsMap>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSettings() {
      const { data } = await supabase.from("settings").select("key, value");
      if (data) {
        const map: SettingsMap = {};
        data.forEach((s) => {
          map[s.key] = s.value ?? "";
        });
        setSettings(map);
      }
      setLoading(false);
    }
    fetchSettings();
  }, []);

  return { settings, loading };
}

// --- Global audio media ---
export function useGlobalAudio() {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAudio() {
      const { data } = await supabase
        .from("media")
        .select("*")
        .eq("is_global", true)
        .eq("type", "audio")
        .single();

      if (data) {
        const url = getPublicUrl(data.bucket_name, data.storage_path);
        setAudioUrl(url);
      }
    }
    fetchAudio();
  }, []);

  return audioUrl;
}

// --- Helper: get first photo URL for a page ---
export function getPagePhotoUrl(page: Page): string | null {
  if (!page.media) return null;
  const photo = page.media.find((m) => m.type === "photo");
  if (!photo) return null;
  return getPublicUrl(photo.bucket_name, photo.storage_path);
}
