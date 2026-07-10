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
} from '@heroicons/react/24/outline'
import { clsx } from 'clsx'

const NAV = [
  { label: 'Dashboard', href: '/manager/dashboard', icon: HomeIcon },
  { label: 'Jobs', href: '/manager/jobs', icon: BriefcaseIcon },
  { label: 'Users', href: '/manager/users', icon: UsersIcon },
]

export default function ManagerSidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.replace('/login')
  }

  return (
    <aside className="flex flex-col w-60 min-h-screen bg-navy shrink-0">
      <div className="px-6 py-5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Logo height={52} className="brightness-0 invert" />
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV.map(({ label, href, icon: Icon }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
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
  )
}
