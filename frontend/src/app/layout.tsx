import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "InsightBRD+ | Intelligent BRD Generation",
  description: "Multi-channel requirement extraction and conflict analytics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-background text-foreground antialiased`}>
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 h-screen overflow-y-auto bg-slate-50/50 dark:bg-slate-930/50">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
