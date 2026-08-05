import type { Metadata } from "next";
import { Inter, Playfair_Display, Great_Vibes } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
});

const greatVibes = Great_Vibes({
  variable: "--font-romantic",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Joyeux Anniversaire Mon Amour ❤️",
  description: "Une surprise d'anniversaire spéciale pour N'Deye Fatou Diop pour ses 21 ans.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      className={`${inter.variable} ${playfair.variable} ${greatVibes.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-slate-950 text-white font-sans overflow-hidden select-none">
        {children}
      </body>
    </html>
  );
}
