import { Roboto } from "next/font/google";

import type { Metadata } from "next";
import type { Viewport } from "next/dist/lib/metadata/types/extra-types";


import "./globals.css";
import "@/styles/mapbox.css";

const roboto = Roboto({
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-mui",
});

export const metadata: Metadata = {
  title: "Treeline NYC",
  description: "Discover the trees of New York City",
};

export const viewport: Viewport = {
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} font-mui relative`}>{children}</body>
    </html>
  );
}
