import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AuthProvider } from '@/context/AuthContext'
import QueryProvider from '@/providers/QueryProvider'
import './globals.css'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
})

export const metadata: Metadata = {
  title: 'JobsFoundry — Apply to 100+ Jobs Daily, Automatically',
  description:
    'JobsFoundry automates your job applications across 500,000+ company career pages. Set your preferences once and let AI land you more interviews.',
  keywords: ['job search', 'auto apply', 'job automation', 'AI job search', 'job applications'],
  icons: {
    icon: [
      { url: '/logo.png', sizes: '512x512', type: 'image/png' },
      { url: '/logo.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    shortcut: '/logo.png',
  },
  openGraph: {
    title: 'JobsFoundry — Apply to 100+ Jobs Daily, Automatically',
    description: 'Automate your job search with AI. Get 3x more interviews.',
    type: 'website',
    images: [{ url: '/logo.png', width: 512, height: 512 }],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body className="min-h-screen flex flex-col antialiased">
        <QueryProvider>
        <AuthProvider>
          {children}
          <ToastContainer
            position="top-right"
            autoClose={4000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
