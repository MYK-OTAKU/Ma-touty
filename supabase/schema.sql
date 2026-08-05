-- ============================================================
-- SCHEMA SUPABASE — Site Anniversaire N'Deye Fatou Diop
-- Exécuter ce fichier dans Supabase → SQL Editor
-- ============================================================

-- ---- TABLES ----

-- Pages/Slides du Storybook
create table if not exists public.pages (
  id uuid default gen_random_uuid() primary key,
  position integer not null,
  template text not null default 'text-photo',
  -- Templates disponibles: 'text-only' | 'text-photo' | 'full-photo' | 'thank-you'
  title text,
  subtitle text,
  body text,
  polaroid_caption text,
  typing_effect boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Médias (photos, vidéos, audio)
create table if not exists public.media (
  id uuid default gen_random_uuid() primary key,
  page_id uuid references public.pages(id) on delete cascade,
  type text not null, -- 'photo' | 'video' | 'audio'
  storage_path text not null, -- chemin dans Supabase Storage bucket
  bucket_name text not null default 'photos',
  display_order integer default 0,
  is_global boolean default false, -- true pour musique de fond
  alt_text text,
  created_at timestamptz default now()
);

-- Paramètres globaux du site
create table if not exists public.settings (
  key text primary key,
  value text,
  updated_at timestamptz default now()
);

-- ---- DONNÉES INITIALES ----
insert into public.settings(key, value) values
  ('secret_code', '0608'),
  ('birthday_name', 'N''Deye Fatou Diop'),
  ('birthday_age', '21'),
  ('final_message', 'Je t''aime de tout mon cœur. ❤️'),
  ('music_enabled', 'true'),
  ('music_storage_path', ''),
  ('site_active', 'true')
on conflict (key) do nothing;

-- Pages par défaut (votre message initial)
insert into public.pages (position, template, title, body, polaroid_caption, typing_effect) values
  (1, 'text-photo', '💓 N''Deye Fatou Diop 💓', 'Me croirais tu si je te disais que c''est la 30 ème fois que je réecris ce message , tellement de chose que j''ai envie de dire que Mon stylo n''arrive pas a suivre;', 'Toi & Moi ✨', true),
  (2, 'text-only', 'Un Jour Si Spécial... 🌟', 'En ce jour si spécial je me suis demandé comment puis-je te dire a quel point tu es spéciale à mes yeux
Et a quel ce jour l''est ', null, true),
  (3, 'text-photo', 'Joyeux Anniversaire ❤️', 'À toi qui m''a enseigné ce que signifie Aimer❤️ et être Aimer❤️', 'Mon Amour ❤️', true),
  (4, 'thank-you', 'Plus qu''un Joyeux Anniversaire...', 'J''aimerais te remercier !', null, true),
  (5, 'text-photo', 'Ma Confidente... 💕', 'Te Remercier de faire partie de Ma Vie , d''être ma Confidente, Ma Conseillère, Ma meilleure amie,de Construire cette histoire avec Moi ❤️Notre Histoire ❤️ d''être née tu sais j''ai jamais été autant sincère avec quelqu''un', 'Notre Histoire ❤️', true),
  (6, 'text-only', '21 ans... 🎂', '21 ans Dire que tu as autant grandi😂 je te revois courir dans la cours du sacré cœur,  c''est fou a quel point le temps passe vite et cela me donne encore plus envie de passer le reste de mon temps avec toi', null, true)
on conflict do nothing;

-- ---- RLS (Row Level Security) ----
alter table public.pages enable row level security;
alter table public.media enable row level security;
alter table public.settings enable row level security;

-- Lecture publique (frontend du site)
create policy "Public can read pages" on public.pages
  for select using (true);

create policy "Public can read media" on public.media
  for select using (true);

create policy "Public can read settings" on public.settings
  for select using (true);

-- Écriture uniquement pour les utilisateurs authentifiés (admin)
create policy "Authenticated can manage pages" on public.pages
  for all using (auth.role() = 'authenticated');

create policy "Authenticated can manage media" on public.media
  for all using (auth.role() = 'authenticated');

create policy "Authenticated can manage settings" on public.settings
  for all using (auth.role() = 'authenticated');

-- ---- STORAGE BUCKETS ----
-- À créer manuellement dans Supabase → Storage ou via ces commandes:
insert into storage.buckets (id, name, public)
values ('photos', 'photos', true)
on conflict do nothing;

insert into storage.buckets (id, name, public)
values ('videos', 'videos', true)
on conflict do nothing;

insert into storage.buckets (id, name, public)
values ('audio', 'audio', true)
on conflict do nothing;

-- Politiques Storage : lecture publique
create policy "Public photos access" on storage.objects
  for select using (bucket_id = 'photos');

create policy "Auth upload photos" on storage.objects
  for insert with check (bucket_id = 'photos' and auth.role() = 'authenticated');

create policy "Auth delete photos" on storage.objects
  for delete using (bucket_id = 'photos' and auth.role() = 'authenticated');

create policy "Public videos access" on storage.objects
  for select using (bucket_id = 'videos');

create policy "Auth upload videos" on storage.objects
  for insert with check (bucket_id = 'videos' and auth.role() = 'authenticated');

create policy "Auth delete videos" on storage.objects
  for delete using (bucket_id = 'videos' and auth.role() = 'authenticated');

create policy "Public audio access" on storage.objects
  for select using (bucket_id = 'audio');

create policy "Auth upload audio" on storage.objects
  for insert with check (bucket_id = 'audio' and auth.role() = 'authenticated');

create policy "Auth delete audio" on storage.objects
  for delete using (bucket_id = 'audio' and auth.role() = 'authenticated');
