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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br`}
      >
        <ThemeProvider>
          <SidebarProvider>
            <Sidebar />
            <SidebarInset className="flex flex-col h-screen overflow-hidden text-foreground">
              <Toaster richColors position="top-right" closeButton />
              <SidebarTrigger />
              <PageTransition>
                <div className="p-6 text-foreground">{children}</div>
              </PageTransition>
            </SidebarInset>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
