import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono" });

export const metadata: Metadata = {
  title: "CyberSentinel — OSINT & Threat Intelligence Dashboard",
  description: "Investigate IPs, domains, file hashes, CVEs, and email headers with real threat intelligence data.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans antialiased text-text-primary bg-bg-primary`}>
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1 md:ml-64 flex flex-col pb-16 md:pb-0">
             <TopBar />
             <main className="flex-1">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
