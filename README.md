# 🎂 Site d'Anniversaire pour N'Deye Fatou Diop (Version Next.js + Tailwind)

Ce projet est une application web monopage (SPA) construite avec **Next.js 15 (App Router)**, **Tailwind CSS v4** et **Framer Motion**, conçue spécialement pour célébrer les **21 ans de N'Deye Fatou Diop** le **6 août**.

L'application est optimisée mobile-first (largeur des cartes à 100% de l'écran avec marges douces sur mobile, et centrée sur desktop), dispose d'effets d'écriture progressive (typing effect) et d'un gâteau d'anniversaire 3D interactif avec 21 bougies à souffler.

---

## 🚀 Lancement Local

1. Installez les dépendances si ce n'est pas déjà fait :
   ```bash
   npm install
   ```
2. Lancez le serveur de développement local :
   ```bash
   npm run dev
   ```
3. Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur (ou sur votre mobile via le réseau local).

---

## 🎨 Configuration des Fichiers Médias (Photos & Musique)

Pour afficher vos photos et jouer votre musique préférée, déposez simplement vos fichiers dans le dossier `/public/assets/` aux emplacements suivants :
- `/public/assets/images/photo1.jpg` (Affichée sur la diapositive 1)
- `/public/assets/images/photo2.jpg` (Affichée sur la diapositive 3)
- `/public/assets/images/photo3.jpg` (Affichée sur la diapositive 5)
- `/public/assets/audio/music.mp3` (Votre musique de fond)

*Note : Si ces fichiers ne sont pas présents, de superbes placeholders SVG et une musique libre de droits seront utilisés par défaut pour que le site reste parfait et fonctionnel.*

---

## 🔐 Configurer le Code Secret
Le code secret par défaut est **`0608`** (le 6 août).
Pour le personnaliser :
1. Ouvrez le fichier `src/components/LoginScreen.tsx`.
2. Modifiez la constante `SECRET_CODE` à la ligne **18** :
   ```typescript
   const SECRET_CODE = "0608"; // Votre code à 4 chiffres
   ```

---

## ☁️ Guide de Connexion à Supabase (Optionnel)

Si vous souhaitez connecter ce site à **Supabase** pour charger dynamiquement les images et le message depuis une base de données :

1. **Installer le SDK Supabase** :
   ```bash
   npm install @supabase/supabase-js
   ```

2. **Configurer les variables d'environnement** :
   Créez un fichier `.env.local` à la racine :
   ```env
   NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anonyme
   ```

3. **Créer le client Supabase** :
   Créez un fichier `src/lib/supabase.ts` :
   ```typescript
   import { createClient } from '@supabase/supabase-js';
   export const supabase = createClient(
     process.env.NEXT_PUBLIC_SUPABASE_URL!,
     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
   );
   ```

4. **Récupérer les ressources** :
   Dans vos composants (comme `StoryScreen` ou `FinalScreen`), utilisez un hook `useEffect` pour charger les URLs signées de vos images ou votre texte :
   ```typescript
   import { supabase } from "@/lib/supabase";
   // ... dans le composant :
   useEffect(() => {
     async function fetchPhotos() {
       const { data, error } = await supabase.storage.from('photos').list();
       // logique pour lier les URLs des photos à votre state
     }
     fetchPhotos();
   }, []);
   ```
