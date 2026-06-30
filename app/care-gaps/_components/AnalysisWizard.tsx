'use client'

import { useState, useRef, DragEvent } from 'react'
import { useRouter } from 'next/navigation'
import { UploadCloud, FileText, ArrowRight, ChevronLeft, Link2 } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { ProcessingLoader } from './CareGapUploadClient'

const TARGET_ID = 'ibd-biologic-initiation'

const STEPS = [
  { title: 'Claims data',        subtitle: 'Step 1 of 5 — Select claims data sources' },
  { title: 'Market definitions', subtitle: 'Step 2 of 5 — Define your target market' },
  { title: 'Clinical context',   subtitle: 'Step 3 of 5 — Upload clinical guidelines and describe the care gap' },
  { title: 'Evidence sources',   subtitle: 'Step 4 of 5 — Select supporting evidence sources' },
  { title: 'Output granularity', subtitle: 'Step 5 of 5 — Define output dimensions' },
]

const EVIDENCE_CHIPS = [
  { id: 'peer-reviewed',        label: 'Peer-reviewed journals' },
  { id: 'clinical-guidelines',  label: 'Clinical guidelines' },
  { id: 'internal-protocols',   label: 'Internal protocols' },
]

const CLAIMS_EXTS   = ['.csv', '.json', '.xlsx', '.pdf', '.docx', '.txt']
const CLINICAL_EXTS = ['.pdf', '.docx', '.doc', '.ppt', '.pptx', '.txt']

// ── Types ─────────────────────────────────────────────────────────────────────

interface FormData {
  claimsMode:         'upload' | 'paste'
  claimsFile:         File | null
  claimsSchema:       string
  marketDefinition:   string
  clinicalFile:       File | null
  careGapDescription: string
  referenceUrl:       string
  evidenceSources:    string[]
  outputGranularity:  string
}

type SetFn = <K extends keyof FormData>(key: K, value: FormData[K]) => void

const INITIAL: FormData = {
  claimsMode:         'upload',
  claimsFile:         null,
  claimsSchema:       '',
  marketDefinition:   '',
  clinicalFile:       null,
  careGapDescription: '',
  referenceUrl:       '',
  evidenceSources:    [],
  outputGranularity:  '',
}

export interface AnalysisWizardProps {
  onSubmit?: (data: FormData) => void
}

// ── Shared styles ─────────────────────────────────────────────────────────────

const TEXTAREA_CLS =
  'w-full rounded-xl border border-gray-200 bg-gray-50 p-3.5 text-sm text-gray-900 ' +
  'placeholder:text-gray-400 focus:border-[#004FBA] focus:bg-white focus:outline-none ' +
  'focus:ring-2 focus:ring-[#004FBA]/15 resize-none'

// ── Progress dots ─────────────────────────────────────────────────────────────

function ProgressDots({ current, total }: { current: number; total: number }) {
  return (
    <div
      className="flex items-center gap-1.5"
      role="progressbar"
      aria-valuenow={current + 1}
      aria-valuemin={1}
      aria-valuemax={total}
      aria-label={`Step ${current + 1} of ${total}`}
    >
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'h-2 rounded-full transition-all duration-300',
            i === current  ? 'w-6 bg-[#004FBA]'
            : i < current  ? 'w-2 bg-[#004FBA]/40'
                           : 'w-2 bg-gray-200',
          )}
        />
      ))}
    </div>
  )
}

// ── File drop zone ────────────────────────────────────────────────────────────

function FileDropZone({
  inputId, file, onFile, onClear, acceptedExts, ariaLabel,
}: {
  inputId:      string
  file:         File | null
  onFile:       (f: File) => void
  onClear:      () => void
  acceptedExts: string[]
  ariaLabel:    string
}) {
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function pick(f: File) {
    const ext = '.' + (f.name.split('.').pop()?.toLowerCase() ?? '')
    if (acceptedExts.includes(ext)) onFile(f)
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) pick(f)
  }

  if (file) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
        <FileText className="h-5 w-5 shrink-0 text-gray-400" aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-gray-800">{file.name}</p>
          <p className="text-xs text-gray-400">
            {(file.size / 1024).toFixed(0)} KB · {file.name.split('.').pop()?.toUpperCase()}
          </p>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="shrink-0 text-xs font-medium text-[#004FBA] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004FBA] rounded"
        >
          Change
        </button>
      </div>
    )
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={ariaLabel}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click() }}
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={cn(
        'flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-8 py-10 text-center transition-all',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004FBA] focus-visible:ring-offset-2',
        dragging
          ? 'border-[#004FBA] bg-[#004FBA]/5'
          : 'border-gray-200 bg-gray-50 hover:border-[#004FBA]/40 hover:bg-[#004FBA]/[0.02]',
      )}
    >
      <div className={cn(
        'flex h-12 w-12 items-center justify-center rounded-full border-2 mb-3 transition-colors',
        dragging ? 'border-[#004FBA]/30 bg-[#004FBA]/10' : 'border-gray-200 bg-white',
      )}>
        <UploadCloud
          className={cn('h-6 w-6 transition-colors', dragging ? 'text-[#004FBA]' : 'text-gray-400')}
          aria-hidden="true"
        />
      </div>
      <p className="text-sm font-semibold text-gray-700">
        {dragging ? 'Drop file here' : 'Drag & drop or click to browse'}
      </p>
      <div className="mt-3 flex flex-wrap justify-center gap-1">
        {acceptedExts.map((ext) => (
          <span
            key={ext}
            className="rounded-full border border-gray-200 bg-white px-2 py-0.5 text-[10px] font-semibold text-gray-500 tracking-wide"
          >
            {ext.replace('.', '').toUpperCase()}
          </span>
        ))}
      </div>
      <input
        id={inputId}
        ref={inputRef}
        type="file"
        accept={acceptedExts.join(',')}
        className="sr-only"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) pick(f) }}
      />
    </div>
  )
}

// ── Step 1 — Claims data ──────────────────────────────────────────────────────

function StepClaims({ fd, set }: { fd: FormData; set: SetFn }) {
  return (
    <div className="space-y-4">
      <div className="flex rounded-lg border border-gray-200 bg-gray-100 p-0.5" role="tablist" aria-label="Input mode">
        {(['upload', 'paste'] as const).map((mode) => (
          <button
            key={mode}
            type="button"
            role="tab"
            id={`tab-${mode}`}
            aria-selected={fd.claimsMode === mode}
            onClick={() => set('claimsMode', mode)}
            className={cn(
              'flex-1 rounded-md py-1.5 text-xs font-medium transition-all',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004FBA]',
              fd.claimsMode === mode
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700',
            )}
          >
            {mode === 'upload' ? 'Upload schema' : 'Paste schema'}
          </button>
        ))}
      </div>

      {fd.claimsMode === 'upload' ? (
        <FileDropZone
          inputId="claims-file"
          file={fd.claimsFile}
          onFile={(f) => set('claimsFile', f)}
          onClear={() => set('claimsFile', null)}
          acceptedExts={CLAIMS_EXTS}
          ariaLabel="Upload claims schema file"
        />
      ) : (
        <div>
          <label htmlFor="claims-schema" className="mb-1.5 block text-xs font-medium text-gray-600">
            Schema definition
          </label>
          <textarea
            id="claims-schema"
            rows={8}
            value={fd.claimsSchema}
            onChange={(e) => set('claimsSchema', e.target.value)}
            placeholder="Paste your schema here — column names, data types, sample values, etc."
            className={TEXTAREA_CLS}
          />
        </div>
      )}
    </div>
  )
}

// ── Step 2 — Market definitions ───────────────────────────────────────────────

function StepMarket({ fd, set }: { fd: FormData; set: SetFn }) {
  return (
    <div>
      <label htmlFor="market-def" className="mb-1.5 block text-xs font-medium text-gray-600">
        Define your market
      </label>
      <textarea
        id="market-def"
        rows={9}
        value={fd.marketDefinition}
        onChange={(e) => set('marketDefinition', e.target.value)}
        placeholder={
          'Enter ICD codes, NDC codes, diagnosis criteria, drug classes, or any market definition…\n\n' +
          'e.g.\n• K50.x, K51.x — Crohn\'s disease / Ulcerative colitis\n• Prednisone NDC list\n• Biologics: adalimumab, vedolizumab, ustekinumab'
        }
        className={TEXTAREA_CLS}
      />
    </div>
  )
}

// ── Step 3 — Clinical context ─────────────────────────────────────────────────

function StepClinical({ fd, set }: { fd: FormData; set: SetFn }) {
  return (
    <div className="space-y-4">
      <div>
        <p id="clinical-file-label" className="mb-1.5 text-xs font-medium text-gray-600">
          Clinical guideline / protocol
        </p>
        <FileDropZone
          inputId="clinical-file"
          file={fd.clinicalFile}
          onFile={(f) => set('clinicalFile', f)}
          onClear={() => set('clinicalFile', null)}
          acceptedExts={CLINICAL_EXTS}
          ariaLabel="Upload clinical guideline or protocol file"
        />
      </div>
      <div>
        <label htmlFor="care-gap-desc" className="mb-1.5 block text-xs font-medium text-gray-600">
          Describe the care gap
        </label>
        <textarea
          id="care-gap-desc"
          rows={4}
          value={fd.careGapDescription}
          onChange={(e) => set('careGapDescription', e.target.value)}
          placeholder="Describe the clinical problem, patient population, and the gap in care you want to address…"
          className={TEXTAREA_CLS}
        />
      </div>
    </div>
  )
}

// ── Step 4 — Evidence sources ─────────────────────────────────────────────────

function StepEvidence({
  fd, set, toggleSource, urlError, validateUrl,
}: {
  fd:           FormData
  set:          SetFn
  toggleSource: (id: string) => void
  urlError:     string
  validateUrl:  (v: string) => boolean
}) {
  return (
    <div className="space-y-5">
      <div>
        <label htmlFor="ref-url" className="mb-1.5 block text-xs font-medium text-gray-600">
          Reference URL <span className="font-normal text-gray-400">(optional)</span>
        </label>
        <div className="relative">
          <Link2
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            aria-hidden="true"
          />
          <input
            id="ref-url"
            type="url"
            value={fd.referenceUrl}
            onChange={(e) => { set('referenceUrl', e.target.value); validateUrl(e.target.value) }}
            placeholder="https://guidelines.org/…"
            className={cn(
              'h-11 w-full rounded-xl border bg-gray-50 pl-10 pr-4 text-sm text-gray-900',
              'placeholder:text-gray-400 transition focus:bg-white focus:outline-none focus:ring-2',
              urlError
                ? 'border-red-300 focus:border-red-400 focus:ring-red-400/20'
                : 'border-gray-200 focus:border-[#004FBA] focus:ring-[#004FBA]/15',
            )}
          />
        </div>
        {urlError && <p className="mt-1 text-xs text-red-500">{urlError}</p>}
      </div>

      <div>
        <p className="mb-2 text-xs font-medium text-gray-600">Evidence sources</p>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Select evidence sources">
          {EVIDENCE_CHIPS.map(({ id, label }) => {
            const selected = fd.evidenceSources.includes(id)
            return (
              <button
                key={id}
                type="button"
                aria-pressed={selected}
                onClick={() => toggleSource(id)}
                className={cn(
                  'rounded-full border px-4 py-1.5 text-xs font-medium transition-all',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004FBA] focus-visible:ring-offset-1',
                  selected
                    ? 'border-[#004FBA] bg-[#EEF3FF] text-[#004FBA]'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50',
                )}
              >
                {label}
              </button>
            )
          })}
        </div>
        <p className="mt-2 text-xs text-gray-400">Select all that apply — you may choose none.</p>
      </div>
    </div>
  )
}

// ── Step 5 — Output granularity ───────────────────────────────────────────────

function StepOutput({ fd, set }: { fd: FormData; set: SetFn }) {
  return (
    <div>
      <label htmlFor="output-granularity" className="mb-1.5 block text-xs font-medium text-gray-600">
        Define output granularity
      </label>
      <textarea
        id="output-granularity"
        rows={9}
        value={fd.outputGranularity}
        onChange={(e) => set('outputGranularity', e.target.value)}
        placeholder={
          'Describe how you want results grouped…\n\n' +
          'e.g.\n• HCP-level (by NPI)\n• Account-level\n• Territory / geography\n• Payer\n• Age band\n• Custom segmentation'
        }
        className={TEXTAREA_CLS}
      />
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export function AnalysisWizard({ onSubmit }: AnalysisWizardProps) {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [fd, setFd] = useState<FormData>(INITIAL)
  const [generating, setGenerating] = useState(false)
  const [urlError, setUrlError] = useState('')

  function set<K extends keyof FormData>(key: K, value: FormData[K]) {
    setFd((prev) => ({ ...prev, [key]: value }))
  }

  function toggleSource(id: string) {
    set(
      'evidenceSources',
      fd.evidenceSources.includes(id)
        ? fd.evidenceSources.filter((s) => s !== id)
        : [...fd.evidenceSources, id],
    )
  }

  function validateUrl(val: string): boolean {
    if (!val.trim()) { setUrlError(''); return true }
    try { new URL(val.trim()); setUrlError(''); return true }
    catch { setUrlError('Please enter a valid URL (e.g. https://…)'); return false }
  }

  const isNextDisabled =
    (step === 0 && (fd.claimsMode === 'upload' ? !fd.claimsFile : !fd.claimsSchema.trim())) ||
    (step === 1 && !fd.marketDefinition.trim()) ||
    (step === 4 && !fd.outputGranularity.trim()) ||
    (step === 3 && !!urlError)

  async function handleNext() {
    if (step < 4) { setStep((s) => s + 1); return }
    onSubmit?.(fd)
    setGenerating(true)
    await new Promise((r) => setTimeout(r, 9600))
    router.push(`/care-gaps/${TARGET_ID}`)
  }

  if (generating) {
    return <ProcessingLoader />
  }

  return (
    <div className="w-full max-w-xl">
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">

        {/* Card header */}
        <div className="flex items-start justify-between border-b border-gray-100 px-8 pt-7 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
              <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                New Analysis
              </span>
            </div>
            <h1 className="text-lg font-bold text-gray-900">{STEPS[step].title}</h1>
            <p className="mt-0.5 text-xs text-gray-400">{STEPS[step].subtitle}</p>
          </div>
          <ProgressDots current={step} total={5} />
        </div>

        {/* Step body */}
        <div className="px-8 py-7">
          {step === 0 && <StepClaims   fd={fd} set={set} />}
          {step === 1 && <StepMarket   fd={fd} set={set} />}
          {step === 2 && <StepClinical fd={fd} set={set} />}
          {step === 3 && (
            <StepEvidence
              fd={fd} set={set}
              toggleSource={toggleSource}
              urlError={urlError}
              validateUrl={validateUrl}
            />
          )}
          {step === 4 && <StepOutput fd={fd} set={set} />}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 border-t border-gray-100 px-8 py-5">
          {step > 0 && (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className={cn(
                'flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004FBA] rounded',
              )}
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              Back
            </button>
          )}
          <button
            type="button"
            onClick={handleNext}
            disabled={isNextDisabled}
            className={cn(
              'flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition-all',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004FBA] focus-visible:ring-offset-2',
              step === 0 ? 'w-full' : 'ml-auto px-6',
              isNextDisabled
                ? 'opacity-40 cursor-not-allowed'
                : 'hover:opacity-90 hover:scale-[1.005] active:scale-[0.998]',
            )}
            style={{ backgroundColor: '#004FBA' }}
          >
            {step === 4 ? (
              <>Analyze &amp; Generate Rules <ArrowRight className="h-4 w-4" aria-hidden="true" /></>
            ) : (
              <>Next <ArrowRight className="h-4 w-4" aria-hidden="true" /></>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
