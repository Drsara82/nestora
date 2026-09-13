import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nestora — Riyadh homes, thoughtfully found",
  description: "Explore villas, apartments and townhouses across Riyadh with refined search, comparison and saved-property tools.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
