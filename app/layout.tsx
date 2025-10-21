// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { Luckiest_Guy } from "next/font/google";

const comic = Luckiest_Guy({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Meanwhile Map",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={comic.className}>{children}</body>
    </html>
  );
}
