'use client'

import Link from 'next/link'
import Logo from '@/components/Logo'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import {
  HomeIcon,
  BriefcaseIcon,
  UsersIcon,
  ArrowLeftStartOnRectangleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { clsx } from 'clsx'

const NAV = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon },
  { label: 'Jobs', href: '/admin/jobs', icon: BriefcaseIcon },
  { label: 'Users', href: '/admin/users', icon: UsersIcon },
]

interface AdminSidebarProps {
  open: boolean
  onClose: () => void
}

export default function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.replace('/login')
  }

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={clsx(
          'flex flex-col w-60 bg-navy shrink-0 z-50',
          // Desktop: static in flow
          'md:static md:translate-x-0 md:min-h-screen',
          // Mobile: fixed overlay with slide animation
          'fixed inset-y-0 left-0 transition-transform duration-300 ease-in-out',
          open ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        )}
      >
        {/* Logo + mobile close button */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
          <Logo height={52} className="brightness-0 invert" />
          <button
            onClick={onClose}
            className="md:hidden text-white/60 hover:text-white cursor-pointer"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV.map(({ label, href, icon: Icon }) => {
            const active = pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                  active
                    ? 'bg-blue-accent text-navy'
                    : 'text-white/60 hover:bg-white/10 hover:text-white',
                )}
              >
                <Icon className="w-4.5 h-4.5 shrink-0" />
                {label}
              </Link>
            )
          })}
        </nav>

        {/* User + logout */}
        <div className="px-4 py-4 border-t border-white/10">
          {user && (
            <div className="flex items-center gap-3 mb-3 px-1">
              {user.avatar ? (
                <img src={user.avatar} alt="" referrerPolicy="no-referrer" className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-accent/40" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-blue-accent/20 border border-blue-accent/30 flex items-center justify-center text-xs font-bold text-blue-accent">
                  {(user.firstName?.[0] ?? user.email[0]).toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-white/40 truncate">{user.email}</p>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-150 cursor-pointer"
          >
            <ArrowLeftStartOnRectangleIcon className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </aside>
    </>
  )
}
