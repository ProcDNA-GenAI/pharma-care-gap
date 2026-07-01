'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export function LoginModal() {
  const [open, setOpen] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [navigating, setNavigating] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const router = useRouter()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const usernameRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      dialogRef.current?.showModal()
      setTimeout(() => usernameRef.current?.focus(), 50)
    } else {
      dialogRef.current?.close()
    }
  }, [open])

  function handleOpen() {
    setUsername('')
    setPassword('')
    setError('')
    setOpen(true)
  }

  function handleClose() {
    setOpen(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!username || !password) {
      setError('Please enter both username and password.')
      return
    }
    setLoading(true)
    await new Promise((r) => setTimeout(r, 600))
    setLoading(false)
    if (username === 'admin' && password === 'admin123') {
      setOpen(false)
      setNavigating(true)
      router.push('/care-gaps')
    } else {
      setError('Invalid username or password.')
    }
  }

  return (
    <>
      {/* Get Started button */}
      <button
        onClick={handleOpen}
        className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-10 text-sm font-semibold text-[#004FBA] shadow-xl transition-all hover:bg-blue-50 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#004FBA]"
      >
        Get Started
        <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Full-screen loader shown while navigating to /care-gaps */}
      {navigating && (
        <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-white">
          <div className="flex flex-col items-center gap-5">
            <Image src="/ProcDNA_Logo.svg" alt="ProcDNA" width={120} height={68} />
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#004FBA]/20 border-t-[#004FBA]" />
            <p className="text-sm font-medium text-gray-500">Loading platform…</p>
          </div>
        </div>
      )}

      {/* Modal backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) handleClose() }}
        >
          <div className="relative w-full max-w-sm mx-4 rounded-2xl bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">

            {/* Modal header band */}
            <div className="bg-[#004FBA] px-8 pt-8 pb-7 text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Image src="/ProcDNA_Logo.svg" alt="ProcDNA" width={90} height={51} className="brightness-0 invert" />
                <div className="h-6 w-px bg-white/20" aria-hidden="true" />
                <Image src="/abbvie_logo.png" alt="AbbVie" width={64} height={41} />
              </div>
              <h2 className="text-lg font-semibold text-white">Welcome back</h2>
              <p className="mt-1 text-xs text-white/60">Sign in to access the platform</p>
            </div>

            {/* Form */}
            <div className="px-8 py-7">
              <form onSubmit={handleSubmit} noValidate className="space-y-4">

                {/* Username */}
                <div>
                  <label htmlFor="login-username" className="block text-xs font-medium text-gray-600 mb-1.5">
                    Username
                  </label>
                  <input
                    ref={usernameRef}
                    id="login-username"
                    type="text"
                    autoComplete="username"
                    value={username}
                    onChange={(e) => { setUsername(e.target.value); setError('') }}
                    placeholder="Enter your username"
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 transition focus:border-[#004FBA] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#004FBA]/20"
                  />
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="login-password" className="block text-xs font-medium text-gray-600 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="login-password"
                      type={showPw ? 'text' : 'password'}
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError('') }}
                      placeholder="Enter your password"
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 pr-10 text-sm text-gray-900 placeholder:text-gray-400 transition focus:border-[#004FBA] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#004FBA]/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      aria-label={showPw ? 'Hide password' : 'Show password'}
                    >
                      {showPw ? (
                        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                          <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.064 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-100 px-3 py-2.5">
                    <svg className="h-4 w-4 shrink-0 text-red-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <p className="text-xs text-red-600">{error}</p>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-1 w-full rounded-lg py-2.5 text-sm font-semibold text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004FBA] focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ backgroundColor: '#004FBA' }}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Signing in…
                    </span>
                  ) : 'Sign In'}
                </button>
              </form>
            </div>

            {/* Close X */}
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full text-white/60 hover:bg-white/15 hover:text-white transition-colors"
              aria-label="Close"
            >
              <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  )
}
