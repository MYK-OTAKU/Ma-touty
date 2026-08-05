import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin — Site Anniversaire",
  robots: "noindex, nofollow",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Note: html/body are provided by the root layout — we only wrap with admin styles
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white font-sans overflow-y-auto select-text z-50">
      {children}
    </div>
  );
}
