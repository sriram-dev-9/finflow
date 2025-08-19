"use client"

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export function AuthHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleAuth = async () => {
      // Check for auth code in URL
      const code = searchParams.get('code')
      const accessToken = searchParams.get('access_token')
      const refreshToken = searchParams.get('refresh_token')
      const error = searchParams.get('error')

      if (error) {
        console.error('Auth error:', error)
        router.replace('/')
        return
      }

      // Handle access_token flow (implicit flow)
      if (accessToken && refreshToken) {
        try {
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          })
          
          if (error) {
            console.error('Session set error:', error)
            router.replace('/')
            return
          }

          if (data.session) {
            // Clear URL parameters and redirect to dashboard
            router.replace('/dashboard')
            return
          }
        } catch (error) {
          console.error('Access token handler error:', error)
          router.replace('/')
          return
        }
      }

      // Handle code flow (PKCE flow)
      if (code) {
        try {
          // Exchange code for session
          const { data, error } = await supabase.auth.exchangeCodeForSession(code)
          
          if (error) {
            console.error('Code exchange error:', error)
            router.replace('/')
            return
          }

          if (data.session) {
            // Clear URL parameters and redirect to dashboard
            router.replace('/dashboard')
            return
          }
        } catch (error) {
          console.error('Code handler error:', error)
          router.replace('/')
          return
        }
      }

      // If no auth parameters, check for existing session
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        // User is already authenticated
        router.replace('/dashboard')
      } else {
        // No session found, redirect to home
        router.replace('/')
      }
    }

    handleAuth()
  }, [router, searchParams])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Completing authentication...</p>
      </div>
    </div>
  )
}
