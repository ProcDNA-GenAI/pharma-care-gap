import { LoginModal } from '@/components/auth/LoginModal'
import Image from 'next/image'

export default function HomePage() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">

      {/* Background image — full cover */}
      <Image
        src="/background_image.png"
        alt=""
        fill
        priority
        quality={90}
        className="object-cover object-center"
        aria-hidden="true"
      />

      {/* Dark overlay so text stays readable over the image */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[#004FBA]/70" />

      {/* Subtle centre vignette for depth */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at 50% 60%, rgba(0,30,120,0.45) 0%, transparent 70%)' }} />

      {/* Top bar */}
      <header className="relative z-10 flex items-center justify-between px-10 pt-8">
        <Image src="/ProcDNA_Logo.svg" alt="ProcDNA" width={110} height={63} priority className="brightness-0 invert" />
        <span className="hidden sm:block text-xs text-white/40 tracking-widest uppercase font-medium">
          Clinical Intelligence Platform
        </span>
      </header>

      {/* Hero */}
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 text-center">

        {/* Eyebrow */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
          <span className="text-xs font-medium tracking-widest text-white/80 uppercase">
            AI-Powered Clinical Analytics
          </span>
        </div>

        {/* Title */}
        <h1 className="font-display text-5xl font-normal text-white leading-tight sm:text-[3.75rem]">
          Care Gap Rule
          <br />
          <span className="text-white/90">Authoring</span>
        </h1>

        {/* Tagline */}
        <p className="mt-5 max-w-md text-base text-white/60 leading-relaxed">
          Generate evidence-grounded business rules for clinical care gaps — in minutes, not weeks.
        </p>

        {/* Feature pills */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
          {['Evidence-Grounded', 'Live Parameter Editing', 'Impact Analysis', 'Export Ready'].map((f) => (
            <span key={f} className="rounded-full bg-white/8 border border-white/12 px-3 py-1 text-xs text-white/60">
              {f}
            </span>
          ))}
        </div>

        {/* CTA — triggers login modal */}
        <div className="mt-10">
          <LoginModal />
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 flex items-center justify-center pb-7 pt-4">
        <p className="text-xs text-white/30 tracking-wide">Powered by ProcDNA</p>
      </footer>
    </div>
  )
}
