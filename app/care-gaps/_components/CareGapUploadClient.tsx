'use client'

import { useState, useRef, useCallback, useEffect, DragEvent } from 'react'
import { useRouter } from 'next/navigation'
import { UploadCloud, FileText, Link2, X, CheckCircle2, Loader2, ArrowRight, ChevronLeft } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

const PROCESSING_STEPS = [
  { label: 'Parsing clinical document',      duration: 1500 },
  { label: 'Extracting evidence guidelines',  duration: 1500 },
  { label: 'Identifying care gap criteria',   duration: 1500 },
  { label: 'Mapping eligibility rules',       duration: 1500 },
  { label: 'Generating rule logic',           duration: 1500 },
  { label: 'Finalizing rule package',         duration: 1500 },
]

export function ProcessingLoader() {
  const [completedCount, setCompletedCount] = useState(0)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    let stepIndex = 0
    function runNext() {
      if (stepIndex >= PROCESSING_STEPS.length) return
      const delay = PROCESSING_STEPS[stepIndex].duration
      setTimeout(() => {
        setCompletedCount(stepIndex + 1)
        stepIndex++
        setActiveIndex(stepIndex)
        runNext()
      }, delay)
    }
    runNext()
  }, [])

  const pct = Math.round((completedCount / PROCESSING_STEPS.length) * 100)

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white px-8">
      <div className="w-full max-w-2xl">

        {/* Title */}
        <div className="mb-10 text-center">
          <p className="text-2xl font-bold text-gray-900">Generating Business Rules using AI</p>
          <p className="mt-1.5 text-sm text-gray-400">Analyzing your clinical guidelines…</p>
        </div>

        {/* Horizontal stepper */}
        <div className="relative flex items-start justify-between">

          {/* Connector track (behind the circles) */}
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 z-0" style={{ left: '2.5rem', right: '2.5rem' }}>
            {/* Filled portion — green to match checkmarks */}
            <div
              className="h-full transition-all duration-700 ease-out"
              style={{
                width: completedCount === 0 ? '0%' : `${((completedCount - 1) / (PROCESSING_STEPS.length - 1)) * 100}%`,
                background: '#10b981',
              }}
            />
          </div>

          {PROCESSING_STEPS.map((step, i) => {
            const isDone   = i < completedCount
            const isActive = i === activeIndex && !isDone

            return (
              <div key={i} className="relative z-10 flex flex-col items-center gap-2.5" style={{ width: `${100 / PROCESSING_STEPS.length}%` }}>
                {/* Circle */}
                <div className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300',
                  isDone
                    ? 'bg-emerald-500 border-emerald-500'
                    : isActive
                    ? 'bg-white border-[#004FBA]'
                    : 'bg-white border-gray-200',
                )}>
                  {isDone ? (
                    <svg className="w-5 h-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : isActive ? (
                    <div className="w-4 h-4 rounded-full border-2 border-[#004FBA]/30 border-t-[#004FBA] animate-spin" />
                  ) : (
                    <span className="text-xs font-bold text-gray-300">{i + 1}</span>
                  )}
                </div>

                {/* Label */}
                <span className={cn(
                  'text-[11px] font-medium text-center leading-tight px-1 transition-colors duration-300',
                  isDone   ? 'text-gray-700' :
                  isActive ? 'text-[#004FBA] font-semibold' :
                             'text-gray-300',
                )}>
                  {step.label}
                </span>
              </div>
            )
          })}
        </div>

        {/* Progress bar + percentage */}
        <div className="mt-10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400 font-medium">Overall Progress</span>
            <span className="text-xs font-bold text-[#004FBA]">{pct}%</span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${pct}%`,
                background: 'linear-gradient(90deg, #004FBA 0%, #2563eb 100%)',
              }}
            />
          </div>
        </div>

      </div>
    </div>
  )
}

const ACCEPTED_EXTS = ['.txt', '.doc', '.docx', '.pdf', '.ppt', '.pptx']
const ACCEPTED_MIME = [
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/pdf',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
]
const TARGET_ID = 'ibd-biologic-initiation'

const EXT_STYLE: Record<string, string> = {
  pdf:  'text-red-500 bg-red-50 border-red-100',
  doc:  'text-blue-600 bg-blue-50 border-blue-100',
  docx: 'text-blue-600 bg-blue-50 border-blue-100',
  ppt:  'text-orange-500 bg-orange-50 border-orange-100',
  pptx: 'text-orange-500 bg-orange-50 border-orange-100',
  txt:  'text-gray-600 bg-gray-50 border-gray-200',
}

function getExtStyle(name: string) {
  const ext = name.split('.').pop()?.toLowerCase() ?? ''
  return EXT_STYLE[ext] ?? 'text-gray-600 bg-gray-50 border-gray-200'
}

/* ── Step indicator ── */
function StepDots({ step }: { step: 1 | 2 }) {
  return (
    <div className="flex items-center gap-2">
      {[1, 2].map((s) => (
        <div
          key={s}
          className={cn(
            'h-2 rounded-full transition-all duration-300',
            step === s ? 'w-6 bg-[#004FBA]' : step > s ? 'w-2 bg-[#004FBA]/40' : 'w-2 bg-gray-200',
          )}
        />
      ))}
    </div>
  )
}

export function CareGapUploadClient() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [step, setStep] = useState<1 | 2>(1)
  const [dragging, setDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [link, setLink] = useState('')
  const [linkError, setLinkError] = useState('')
  const [processing, setProcessing] = useState(false)
  const [done, setDone] = useState(false)
  const [generating, setGenerating] = useState(false)

  /* ── helpers ── */
  function validateLink(val: string): boolean {
    if (!val.trim()) { setLinkError(''); return true } // optional — empty is fine
    try { new URL(val.trim()); setLinkError(''); return true }
    catch { setLinkError('Please enter a valid URL (e.g. https://…)'); return false }
  }

  function pickFile(f: File) {
    const ext = '.' + (f.name.split('.').pop()?.toLowerCase() ?? '')
    if (!ACCEPTED_EXTS.includes(ext) && !ACCEPTED_MIME.includes(f.type)) return
    setFile(f)
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault(); setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) pickFile(f)
  }

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) pickFile(f)
  }, [])

  function removeFile() {
    setFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function handleAnalyze() {
    if (processing) return
    if (!validateLink(link)) return
    setProcessing(true)
    await new Promise((r) => setTimeout(r, 800))
    setDone(true)
    await new Promise((r) => setTimeout(r, 300))
    setGenerating(true)
    // Total duration of all steps + small buffer before navigating
    const totalDuration = PROCESSING_STEPS.reduce((s, p) => s + p.duration, 0) + 600
    await new Promise((r) => setTimeout(r, totalDuration))
    router.push(`/care-gaps/${TARGET_ID}`)
  }

  /* ── render ── */
  if (generating) {
    return <ProcessingLoader />
  }

  return (
    <div className="w-full max-w-xl">

      {/* Card */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">

        {/* Card header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-8 pt-7 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">New Analysis</span>
            </div>
            <h1 className="text-lg font-bold text-gray-900">
              {step === 1 ? 'Upload Document' : 'Add a Reference Link'}
            </h1>
            <p className="mt-0.5 text-xs text-gray-400">
              {step === 1
                ? 'Step 1 of 2 — Upload your clinical guideline or protocol file'
                : 'Step 2 of 2 — Optionally attach a reference URL'}
            </p>
          </div>
          <StepDots step={step} />
        </div>

        <div className="px-8 py-7 space-y-5">

          {/* ══ STEP 1: File upload ══ */}
          {step === 1 && (
            <>
              {!file ? (
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    'flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-8 py-12 text-center transition-all',
                    dragging
                      ? 'border-[#004FBA] bg-[#004FBA]/5'
                      : 'border-gray-200 bg-gray-50 hover:border-[#004FBA]/40 hover:bg-[#004FBA]/[0.02]',
                  )}
                >
                  <div className={cn(
                    'flex h-14 w-14 items-center justify-center rounded-full border-2 mb-4 transition-colors',
                    dragging ? 'border-[#004FBA]/30 bg-[#004FBA]/10' : 'border-gray-200 bg-white',
                  )}>
                    <UploadCloud className={cn('h-7 w-7 transition-colors', dragging ? 'text-[#004FBA]' : 'text-gray-400')} />
                  </div>
                  <p className="text-sm font-semibold text-gray-700">
                    {dragging ? 'Drop file to upload' : 'Drag & drop your file here'}
                  </p>
                  <p className="mt-1 text-xs text-gray-400">or click to browse</p>

                  {/* Format badges */}
                  <div className="mt-5 flex flex-wrap justify-center gap-1.5">
                    {['PDF', 'DOCX', 'DOC', 'PPT', 'PPTX', 'TXT'].map((ext) => (
                      <span key={ext} className="rounded-full border border-gray-200 bg-white px-2.5 py-0.5 text-[10px] font-semibold text-gray-500 tracking-wide">
                        .{ext}
                      </span>
                    ))}
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={ACCEPTED_EXTS.join(',')}
                    onChange={handleFileChange}
                    className="sr-only"
                  />
                </div>
              ) : (
                /* File chip */
                <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-gray-50 px-5 py-4">
                  <div className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border', getExtStyle(file.name))}>
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-gray-800">{file.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {(file.size / 1024).toFixed(0)} KB · {file.name.split('.').pop()?.toUpperCase()}
                    </p>
                  </div>
                  <button
                    onClick={removeFile}
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors"
                    aria-label="Remove file"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* Next button */}
              <button
                onClick={() => setStep(2)}
                disabled={!file}
                className={cn(
                  'flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition-all',
                  file
                    ? 'hover:opacity-90 hover:scale-[1.005] active:scale-[0.998]'
                    : 'opacity-40 cursor-not-allowed',
                )}
                style={{ backgroundColor: '#004FBA' }}
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </button>
            </>
          )}

          {/* ══ STEP 2: Link + analyze ══ */}
          {step === 2 && (
            <>
              {/* Uploaded file summary */}
              <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                <p className="truncate text-xs text-gray-600">
                  <span className="font-semibold text-gray-800">{file?.name}</span>
                  <span className="text-gray-400"> uploaded</span>
                </p>
                <button
                  onClick={() => { setStep(1); setLink(''); setLinkError('') }}
                  className="ml-auto shrink-0 text-[10px] font-medium text-[#004FBA] hover:underline"
                >
                  Change
                </button>
              </div>

              {/* Link input */}
              <div className="space-y-2">
                <label htmlFor="doc-link" className="block text-xs font-medium text-gray-600">
                  Reference URL <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <div className="relative">
                  <Link2 className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    id="doc-link"
                    type="url"
                    value={link}
                    onChange={(e) => { setLink(e.target.value); validateLink(e.target.value) }}
                    placeholder="https://guidelines.org/ibd-protocol"
                    className={cn(
                      'h-11 w-full rounded-xl border bg-gray-50 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 transition focus:bg-white focus:outline-none focus:ring-2',
                      linkError
                        ? 'border-red-300 focus:border-red-400 focus:ring-red-400/20'
                        : 'border-gray-200 focus:border-[#004FBA] focus:ring-[#004FBA]/15',
                    )}
                  />
                </div>
                {linkError && <p className="text-xs text-red-500">{linkError}</p>}
                <p className="text-xs text-gray-400">Skip this if you don't have a reference link.</p>
              </div>

              {/* Analyze button */}
              <button
                onClick={handleAnalyze}
                disabled={processing || !!linkError}
                className={cn(
                  'flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004FBA] focus-visible:ring-offset-2',
                  !processing && !linkError
                    ? 'hover:opacity-90 hover:scale-[1.005] active:scale-[0.998]'
                    : 'opacity-50 cursor-not-allowed',
                  done ? 'bg-emerald-500' : '',
                )}
                style={done ? undefined : { backgroundColor: '#004FBA' }}
              >
                {processing && !done && <><Loader2 className="h-4 w-4 animate-spin" /> Analyzing…</>}
                {done && <><CheckCircle2 className="h-4 w-4" /> Redirecting…</>}
                {!processing && !done && <>Analyze &amp; Generate Rules <ArrowRight className="h-4 w-4" /></>}
              </button>

              {/* Back */}
              <button
                onClick={() => setStep(1)}
                className="flex w-full items-center justify-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                Back to upload
              </button>
            </>
          )}

        </div>
      </div>

      {/* Footnote */}
      <p className="mt-4 text-center text-xs text-gray-400">
        Supported: PDF · DOCX · DOC · PPT · PPTX · TXT
      </p>
    </div>
  )
}
