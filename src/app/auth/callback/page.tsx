'use client'

import { useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { useAuth } from '@/context/AuthContext'
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/solid'

const ERROR_MESSAGES: Record<string, string> = {
  google_auth_failed: 'Google authentication failed. Please try again.',
  access_denied: 'Access was denied. Please try again.',
}

const STEPS = [
  'Verifying your Google account…',
  'Setting up your profile…',
  'Loading your dashboard…',
]

function AuthCallbackInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { refetch, setIsAuthenticated } = useAuth()

  const error = searchParams.get('error')
  const handled = useRef(false)

  useEffect(() => {
    if (handled.current) return
    handled.current = true

    // ── Error path ──────────────────────────────────────────────────────────
    if (error) {
      const msg =
        ERROR_MESSAGES[error] ??
        decodeURIComponent(error)
      router.replace(`/login?error=${encodeURIComponent(msg)}`)
      return
    }

    // ── Success path ────────────────────────────────────────────────────────
    const run = async () => {
      try {
        await refetch()
        setIsAuthenticated(true)
        router.replace('/dashboard')
      } catch {
        router.replace(
          `/login?error=${encodeURIComponent('Authentication failed. Please try again.')}`,
        )
      }
    }

    run()
  }, [error, refetch, setIsAuthenticated, router])

  // If there's an error param, show a brief error state while redirecting
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
        <div className="mb-10">
          <span className="text-2xl font-bold">
            <span className="text-navy">Job</span>
            <span className="text-blue-accent">Blitz</span>
          </span>
        </div>
        <div className="w-full max-w-sm bg-white border border-red-100 rounded-2xl shadow-lg p-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <XMarkIcon className="w-6 h-6 text-red-500" />
            </div>
          </div>
          <h2 className="text-base font-bold text-navy mb-2">Authentication failed</h2>
          <p className="text-sm text-slate-400">Redirecting back to login…</p>
        </div>
      </div>
    )
  }

  // Success loading state
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <div className="mb-10">
        <span className="text-2xl font-bold">
          <span className="text-navy">Job</span>
          <span className="text-blue-accent">Blitz</span>
        </span>
      </div>

      <div className="w-full max-w-sm bg-white border border-slate-100 rounded-2xl shadow-lg shadow-slate-100 p-8 text-center">
        <div className="flex items-center justify-center mb-6">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-2 border-blue-muted" />
            <div className="absolute inset-0 rounded-full border-2 border-blue-accent border-t-transparent animate-spin" />
          </div>
        </div>

        <h2 className="text-base font-bold text-navy mb-1">Signing you in…</h2>
        <p className="text-sm text-slate-400 mb-8">This will only take a moment.</p>

        <ul className="space-y-3 text-left">
          {STEPS.map((label, i) => (
            <li key={label} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center bg-slate-100 animate-pulse">
              </div>
              <span className="text-sm text-slate-300">{label}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-8 text-xs text-slate-400">
        Secured with httpOnly JWT · No password needed
      </p>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense>
      <AuthCallbackInner />
    </Suspense>
  )
}
