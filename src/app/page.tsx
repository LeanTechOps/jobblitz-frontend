import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/landing/Hero'
import HowItWorks from '@/components/landing/HowItWorks'
import Features from '@/components/landing/Features'
import FeaturesShowcase from '@/components/landing/FeaturesShowcase'
import Stats from '@/components/landing/Stats'
import Testimonials from '@/components/landing/Testimonials'
import SocialProof from '@/components/landing/SocialProof'
import Comparison from '@/components/landing/Comparison'
import FAQ from '@/components/landing/FAQ'
import Link from 'next/link'

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        <Hero />
        <HowItWorks />
        <FeaturesShowcase />
        <Features />
        <Stats />
        <Comparison />
        <Testimonials />
        <SocialProof />
        <FAQ />

        {/* CTA Banner */}
        <section className="relative overflow-hidden bg-navy py-14 sm:py-20">
          {/* Decorative blobs */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-blue-accent/20 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-32 -right-32 w-[400px] h-[400px] rounded-full bg-blue-accent/5 blur-3xl"
          />

          <div className="relative max-w-3xl mx-auto px-4 text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/70 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-6 cursor-default select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-accent animate-pulse" />
              Free forever · No credit card needed
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-5 leading-tight">
              Shape Your Next Career Move
              <br />
              <span className="text-blue-accent">with JobsFoundry</span>
            </h2>
            <p className="text-white/70 mb-10 text-lg max-w-xl mx-auto leading-relaxed">
              Join 50,000+ job seekers who automated their applications with AI.
              Start free — upgrade when you&apos;re ready.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/login?plan=forge"
                className="group inline-flex items-center gap-2 bg-white hover:bg-slate-50 active:scale-[0.98] text-navy font-semibold px-8 py-3.5 rounded-lg transition-all duration-150 text-sm shadow-xl hover:shadow-2xl cursor-pointer select-none"
              >
                Get Started Free
                <span className="transition-transform duration-150 group-hover:translate-x-0.5">→</span>
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 active:scale-[0.98] border border-white/20 hover:border-white/30 text-white font-semibold px-8 py-3.5 rounded-lg transition-all duration-150 text-sm cursor-pointer select-none"
              >
                View Pricing
              </Link>
            </div>

            {/* Social proof line */}
            <p className="text-white/40 text-xs mt-8">
              Trusted by engineers, designers, PMs and analysts at 10,000+ companies
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
