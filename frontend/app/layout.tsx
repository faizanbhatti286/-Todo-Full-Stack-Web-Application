import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";
import { ToastProvider } from "@/lib/toast";
import ErrorBoundary from "@/components/ErrorBoundary";
import Navigation from "@/components/Navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Todo App - Task Management",
  description: "A responsive task management application with authentication. Create, organize, and track your tasks with an intuitive interface.",
  keywords: ["todo", "task management", "productivity", "tasks", "todo list"],
  authors: [{ name: "Todo App Team" }],
  creator: "Todo App",
  publisher: "Todo App",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    title: "Todo App - Task Management",
    description: "A responsive task management application with authentication. Create, organize, and track your tasks with an intuitive interface.",
    siteName: "Todo App",
  },
  twitter: {
    card: "summary_large_image",
    title: "Todo App - Task Management",
    description: "A responsive task management application with authentication. Create, organize, and track your tasks with an intuitive interface.",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
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
        <ErrorBoundary>
          <AuthProvider>
            <ToastProvider>
              <Navigation />
              {children}
            </ToastProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
