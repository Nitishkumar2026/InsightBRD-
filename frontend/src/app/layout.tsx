import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "InsightBRD+ | Intelligent BRD Generation",
  description: "Multi-channel requirement extraction and conflict analytics",
};

import ErrorBoundary from "@/components/ErrorBoundary";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.className} bg-background text-foreground antialiased`}>
        <ErrorBoundary>
          <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto bg-secondary/20">
              {children}
            </main>
          </div>
        </ErrorBoundary>
      </body>
    </html>
  );
}
