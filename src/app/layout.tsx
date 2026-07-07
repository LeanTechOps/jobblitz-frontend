import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AuthProvider } from '@/context/AuthContext'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'JobBlitz — Apply to 100+ Jobs Daily, Automatically',
  description:
    'JobBlitz automates your job applications across 500,000+ company career pages. Set your preferences once and let AI land you more interviews.',
  keywords: ['job search', 'auto apply', 'job automation', 'AI job search', 'job applications'],
  openGraph: {
    title: 'JobBlitz — Apply to 100+ Jobs Daily, Automatically',
    description: 'Automate your job search with AI. Get 3x more interviews.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen flex flex-col antialiased">
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
      </body>
    </html>
  )
}
