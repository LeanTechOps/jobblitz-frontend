import Link from 'next/link'

const FOOTER_LINKS = {
  Product: [
    { label: 'Features', href: '/#features' },
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'Pricing', href: '/pricing' },
  ],
  Company: [
    { label: 'About', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Careers', href: '/careers' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block mb-4 group cursor-pointer">
              <span className="text-xl font-bold">
                <span className="text-white group-hover:text-slate-200 transition-colors duration-150">Job</span>
                <span className="text-blue-300 group-hover:text-blue-200 transition-colors duration-150">Blitz</span>
              </span>
            </Link>
            <p className="text-slate-300 text-sm leading-relaxed max-w-xs">
              Automate your job applications with AI. Land more interviews, faster.
            </p>
          </div>

          {/* Link groups */}
          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <div key={group}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
                {group}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group relative text-sm text-slate-300 hover:text-white transition-colors duration-150 cursor-pointer inline-block"
                    >
                      {link.label}
                      <span className="absolute inset-x-0 -bottom-0.5 h-px bg-blue-300 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} JobBlitz. All rights reserved.
          </p>
          <p className="text-sm text-slate-500">
            Built to help you land your dream job faster.
          </p>
        </div>
      </div>
    </footer>
  )
}
