import { PageTransition } from "@/components/PageTransition";
import { Toaster } from "@/components/ui/sonner";

import Sidebar from "@/components/Sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cash Control APP",
  description:
    "A unified platform for streamlined cash and customer management with insightful analytics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative min-h-screen h-full`}
      >
        <ThemeProvider>
          <SidebarProvider className="bg-gradient-to-br from-background/80 via-background/50 to-background/80 backdrop-blur-3xl">
            <Sidebar variant="floating" className="text-[#f1f5f9]" />
            <SidebarInset className="flex flex-col min-h-screen overflow-hidden text-foreground">
              <Toaster richColors position="top-right" closeButton expand />
              <SidebarTrigger />
              <PageTransition>
                <div className="p-6 text-foreground  h-full">{children}</div>
              </PageTransition>
            </SidebarInset>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
