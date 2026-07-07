'use client'

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000'

const VALUE_PROPS = [
  'Auto-apply to 100+ matched jobs every day',
  'AI tailors your resume for every application',
  'Track every application in one dashboard',
]

const STATS = [
  { value: '50K+', label: 'Active users' },
  { value: '2M+', label: 'Applications sent' },
  { value: '3×', label: 'More interviews' },
]

function LoginPageInner() {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const authError = searchParams.get('error')

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace('/dashboard')
    }
  }, [isAuthenticated, loading, router])

  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/auth/google`
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-6 h-6 border-2 border-blue-accent border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">
      {/* ── Left panel — navy ─────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 bg-navy flex-col justify-between px-12 py-10">
        {/* Logo */}
        <Link href="/" className="group cursor-pointer">
          <span className="text-xl font-bold text-white">
            Job
            <span className="text-blue-300 group-hover:text-blue-200 transition-colors duration-150">
              Blitz
            </span>
          </span>
        </Link>

        {/* Middle */}
        <div>
          <p className="text-xs font-semibold text-blue-300 uppercase tracking-widest mb-4">
            Why job seekers choose us
          </p>
          <h2 className="text-3xl font-extrabold text-white mb-8 leading-snug">
            Land your dream job
            <br />
            <span className="text-blue-300">10× faster with AI</span>
          </h2>

          <ul className="space-y-4 mb-10">
            {VALUE_PROPS.map((prop) => (
              <li key={prop} className="flex items-start gap-3 group cursor-default">
                <CheckCircleIcon className="w-5 h-5 text-blue-300 flex-shrink-0 mt-0.5 transition-transform duration-150 group-hover:scale-110" />
                <span className="text-blue-100 text-sm group-hover:text-white transition-colors duration-150">
                  {prop}
                </span>
              </li>
            ))}
          </ul>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="bg-white/10 hover:bg-white/15 rounded-xl p-4 text-center transition-all duration-200 cursor-default hover:-translate-y-0.5"
              >
                <p className="text-2xl font-extrabold text-white">{s.value}</p>
                <p className="text-xs text-blue-200 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <blockquote className="border-l-2 border-blue-400 pl-5">
          <p className="text-blue-100 text-sm italic leading-relaxed">
            &ldquo;I went from zero callbacks to 8 interviews in two weeks.
            JobBlitz completely changed my job search.&rdquo;
          </p>
          <footer className="mt-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-400/30 text-white text-xs font-bold flex items-center justify-center">
              PS
            </div>
            <div>
              <p className="text-white text-xs font-semibold">Priya S.</p>
              <p className="text-blue-300 text-xs">Software Engineer · Joined Stripe</p>
            </div>
          </footer>
        </blockquote>
      </div>

      {/* ── Right panel — white ────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 sm:px-12 lg:px-16 py-10 bg-white">

        {/* Mobile logo */}
        <div className="lg:hidden mb-10">
          <Link href="/" className="group cursor-pointer">
            <span className="text-2xl font-bold">
              <span className="text-navy group-hover:text-slate-700 transition-colors duration-150">Job</span>
              <span className="text-blue-accent group-hover:text-blue-500 transition-colors duration-150">Blitz</span>
            </span>
          </Link>
        </div>

        {/* Centered form */}
        <div className="w-full max-w-sm">
          {/* Heading */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-extrabold text-navy mb-2">
              Welcome to JobBlitz
            </h1>
            <p className="text-slate-600 text-base">
              Sign in to start automating your job search — it&apos;s free.
            </p>
          </div>

          {/* Auth error */}
          {authError && (
            <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <ExclamationTriangleIcon className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-700 leading-relaxed">{authError}</p>
            </div>
          )}

          {/* Google button */}
          <button
            onClick={handleGoogleLogin}
            className="group w-full flex items-center justify-center gap-3 border border-slate-200 hover:border-blue-accent/40 hover:bg-blue-50/50 active:scale-[0.98] rounded-xl py-4 px-5 text-sm font-semibold text-slate-700 hover:text-slate-900 transition-all duration-150 shadow-sm hover:shadow-md cursor-pointer select-none"
          >
            <span className="transition-transform duration-150 group-hover:scale-110">
              <GoogleIcon />
            </span>
            Continue with Google
          </button>

          {/* Terms */}
          <p className="text-sm text-slate-500 text-center leading-relaxed mt-5">
            By continuing, you agree to our{' '}
            <Link
              href="/terms"
              className="text-blue-accent font-medium hover:text-blue-500 hover:underline transition-colors duration-150 cursor-pointer"
            >
              Terms of Service
            </Link>
            {' '}and{' '}
            <Link
              href="/privacy"
              className="text-blue-accent font-medium hover:text-blue-500 hover:underline transition-colors duration-150 cursor-pointer"
            >
              Privacy Policy
            </Link>
            .
          </p>

          {/* Back nudge */}
          <div className="mt-8 text-center">
            <Link
              href="/"
              className="text-sm text-slate-500 hover:text-navy font-medium transition-colors duration-150 cursor-pointer"
            >
              ← Back to homepage
            </Link>
          </div>
        </div>

        {/* Mobile stats */}
        <div className="lg:hidden mt-14 grid grid-cols-3 gap-3 w-full max-w-sm">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="bg-section-alt rounded-xl p-3 text-center hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200 cursor-default"
            >
              <p className="text-lg font-extrabold text-navy">{s.value}</p>
              <p className="text-xs text-slate-600 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginPageInner />
    </Suspense>
  )
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  )
}
