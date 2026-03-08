import type { Metadata } from "next";
import localFont from "next/font/local";
import { AppProviders } from "@/components/providers/AppProviders";
import { MainNav } from "@/components/layout/MainNav";
import "./globals.css";
import "@once-ui-system/core/css/styles.css";
import "@once-ui-system/core/css/tokens.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Local Hero",
  description: "Gamified Web3 community platform for local impact",
  applicationName: "Local Hero",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppProviders>
          <div className="min-h-screen bg-slate-950 text-slate-100">
            <MainNav />
            <main className="mx-auto max-w-6xl px-4 py-6 pb-28 md:pb-8">{children}</main>
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
