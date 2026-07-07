'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { label: 'Features', href: '/#features' },
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'Pricing', href: '/pricing' },
]

export default function Navbar() {
  const { isAuthenticated, user, logout, loading } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed top-0 inset-x-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm'
          : 'bg-white/80 backdrop-blur-sm'
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-1.5 flex-shrink-0 group cursor-pointer"
        >
          <span className="text-xl font-bold tracking-tight">
            <span className="text-navy group-hover:text-slate-700 transition-colors duration-150">Job</span>
            <span className="text-blue-accent group-hover:text-blue-500 transition-colors duration-150">Blitz</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative text-sm font-medium text-slate-600 hover:text-navy transition-colors duration-150 group cursor-pointer py-1"
            >
              {link.label}
              {/* Animated underline */}
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left rounded-full" />
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          {loading ? null : isAuthenticated ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-slate-600 hover:text-navy transition-colors duration-150 cursor-pointer"
              >
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors duration-150 cursor-pointer active:scale-95"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-slate-600 hover:text-navy transition-colors duration-150 cursor-pointer"
              >
                Log in
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 bg-blue-accent hover:bg-blue-500 active:scale-95 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-150 shadow-sm hover:shadow-md cursor-pointer select-none"
              >
                Get Started Free
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-navy active:scale-95 transition-all duration-150 cursor-pointer"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <XMarkIcon className="w-5 h-5" />
          ) : (
            <Bars3Icon className="w-5 h-5" />
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 py-4 flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-sm font-medium text-slate-700 hover:text-navy hover:bg-slate-50 py-2.5 px-3 rounded-lg transition-all duration-150 cursor-pointer"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2 mt-1">
            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-semibold text-navy py-2.5 px-3 rounded-lg hover:bg-slate-50 transition-all cursor-pointer"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => { logout(); setMobileOpen(false) }}
                  className="text-sm text-slate-500 text-left py-2.5 px-3 rounded-lg hover:bg-slate-50 hover:text-slate-700 transition-all cursor-pointer"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-medium text-slate-700 py-2.5 px-3 rounded-lg hover:bg-slate-50 transition-all cursor-pointer"
                >
                  Log in
                </Link>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="bg-blue-accent hover:bg-blue-500 active:scale-95 text-white text-sm font-semibold px-4 py-2.5 rounded-lg text-center transition-all duration-150 cursor-pointer select-none"
                >
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
