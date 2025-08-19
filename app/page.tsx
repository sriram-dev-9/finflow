"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { AuthHandler } from "@/components/auth-handler"
import HeroSection from "@/components/ui/hero";
import Link from "next/link";

export default function Home() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Check if we have auth parameters
    const code = searchParams.get('code')
    const accessToken = searchParams.get('access_token')
    
    if (code || accessToken) {
      // Let AuthHandler deal with this
      return
    }

    // Check if user is already authenticated
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.push('/dashboard')
      }
    }

    checkAuth()
  }, [router, searchParams])

  // If we have auth parameters, show auth handler
  if (searchParams.get('code') || searchParams.get('access_token')) {
    return <AuthHandler />
  }

  return (
    <div className="min-h-screen">
      <HeroSection />
      <div className="flex justify-center py-8 bg-slate-100 dark:bg-slate-800">
        <Link 
          href="/dashboard"
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105"
        >
          View Dashboard
        </Link>
      </div>
    </div>
  );
}
