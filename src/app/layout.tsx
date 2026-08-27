import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Inter, Oswald } from "next/font/google";
import { appConfig } from "@/config/app-config";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: appConfig.brand.name,
  description: appConfig.brand.tagline,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  // Wiring the accent color from app-config.ts here means changing brand
  // color is a one-line edit in config, not a hunt through components.
  const themeStyle = {
    "--accent": appConfig.brand.accentColor,
  } as CSSProperties;

  return (
    <html
      lang="en"
      className={`${inter.variable} ${oswald.variable}`}
      style={themeStyle}
    >
      <body className="min-h-dvh bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
