'use client';

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadata is not used in client components, so it's commented out or moved if needed for SEO
// export const metadata: Metadata = {
//   title: "FinFlow - AI-Powered Personal Finance Management",
//   description: "Manage your money with AI-powered financial insights. Track expenses, manage investments, and achieve your financial goals with FinFlow.",
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <main className="flex-1 p-4">
                {session ? (
                  <>{children}</>
                ) : (
                  <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
                    <p className="mb-4 text-lg">Please log in to access FinFlow.</p>
                    <button
                      onClick={handleGoogleLogin}
                      className="px-6 py-3 bg-blue-600 text-white rounded-md text-lg hover:bg-blue-700 transition-colors"
                    >
                      Login with Google
                    </button>
                  </div>
                )}
              </main>
            <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
