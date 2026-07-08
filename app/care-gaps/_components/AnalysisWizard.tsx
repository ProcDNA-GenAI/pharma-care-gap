'use client'

import { useState, useRef, type DragEvent, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import {
  UploadCloud,
  FileText,
  Link2,
  Plus,
  X,
  Stethoscope,
  FileSpreadsheet,
  BookOpen,
  LayoutGrid,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { ProcessingLoader } from './CareGapUploadClient'
import { ConfigurationCard } from './ConfigurationCard'
import { ProgressHeader } from './ProgressHeader'
import { SectionModal } from './SectionModal'
import { GenerateButton } from './GenerateButton'

const TARGET_ID = 'ibd-biologic-initiation'
const CLINICAL_EXTS = ['.pdf', '.docx', '.doc', '.ppt', '.pptx', '.txt']

interface FormData {
  marketDefinition: string
  clinicalFile: File | null
  careGapDescription: string
  referenceLinks: string[]
  outputGranularity: string
}

type SetFn = <K extends keyof FormData>(key: K, value: FormData[K]) => void

const INITIAL: FormData = {
  marketDefinition: '',
  clinicalFile: null,
  careGapDescription: '',
  referenceLinks: [],
  outputGranularity: '',
}

type SectionId = 'clinical' | 'market' | 'output' | 'evidence'

interface SectionDef {
  id: SectionId
  icon: LucideIcon
  title: string
  description: string
  required: boolean
  isComplete: (fd: FormData) => boolean
}

const SECTIONS: SectionDef[] = [
  {
    id: 'clinical',
    icon: Stethoscope,
    title: 'Clinical Context',
    description: 'Define disease area, objective and patient population',
    required: true,
    isComplete: (fd) => !!fd.clinicalFile || !!fd.careGapDescription.trim(),
  },
  {
    id: 'market',
    icon: FileSpreadsheet,
    title: 'Market Definitions',
    description: 'Define ICD/NDC codes and market field definitions',
    required: true,
    isComplete: (fd) => !!fd.marketDefinition.trim(),
  },
  {
    id: 'output',
    icon: LayoutGrid,
    title: 'Output Granularity',
    description: 'Choose how results should be grouped and segmented',
    required: true,
    isComplete: (fd) => !!fd.outputGranularity.trim(),
  },
]

const EVIDENCE_SECTION: SectionDef = {
  id: 'evidence',
  icon: BookOpen,
  title: 'Evidence Sources',
  description: 'Attach one or more guideline reference links',
  required: false,
  isComplete: () => false,
}

const EVIDENCE_LINK_SUGGESTIONS = [
  {
    label: 'Govani et al. (PMID: 26521118)',
    url: 'https://pubmed.ncbi.nlm.nih.gov/26521118/',
  },
  {
    label: 'Zhdanova et al.',
    url: 'https://www.jmcp.org/',
  },
  {
    label: 'AGA / CMS MIPS Quality ID #271',
    url: 'https://mdinteractive.com/mips_quality_measure/2025-mips-quality-measure-271',
  },
  {
    label: 'DICE Study Methodology',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11084465/',
  },
  {
    label: 'Damasceno et al.',
    url: 'https://pubmed.ncbi.nlm.nih.gov/41825519/',
  },
] as const

const TEXTAREA_CLS =
  'w-full rounded-xl border border-gray-200 bg-gray-50 p-3.5 text-sm text-gray-900 ' +
  'placeholder:text-gray-400 focus:border-[#004FBA] focus:bg-white focus:outline-none ' +
  'focus:ring-2 focus:ring-[#004FBA]/15 resize-none'

function FileDropZone({
  inputId,
  file,
  onFile,
  onClear,
  acceptedExts,
  ariaLabel,
}: {
  inputId: string
  file: File | null
  onFile: (f: File) => void
  onClear: () => void
  acceptedExts: string[]
  ariaLabel: string
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
            {(file.size / 1024).toFixed(0)} KB - {file.name.split('.').pop()?.toUpperCase()}
          </p>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="shrink-0 rounded text-xs font-medium text-[#004FBA] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004FBA]"
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
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click()
      }}
      onDragOver={(e) => {
        e.preventDefault()
        setDragging(true)
      }}
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
      <div
        className={cn(
          'mb-3 flex h-12 w-12 items-center justify-center rounded-full border-2 transition-colors',
          dragging ? 'border-[#004FBA]/30 bg-[#004FBA]/10' : 'border-gray-200 bg-white',
        )}
      >
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
            className="rounded-full border border-gray-200 bg-white px-2 py-0.5 text-[10px] font-semibold tracking-wide text-gray-500"
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
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) pick(f)
        }}
      />
    </div>
  )
}

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
          'Enter ICD codes, NDC codes, diagnosis criteria, drug classes, or any market definition...\n\n' +
          'e.g.\n- K50.x, K51.x - Crohn\'s disease / Ulcerative colitis\n- Prednisone NDC list\n- Biologics: adalimumab, vedolizumab, ustekinumab'
        }
        className={TEXTAREA_CLS}
      />
    </div>
  )
}

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
          placeholder="Describe the clinical problem, patient population, and the gap in care you want to address..."
          className={TEXTAREA_CLS}
        />
      </div>
    </div>
  )
}

function StepEvidence({
  fd, customLinks, urlErrors, onToggleLink, onUpdateCustomLink, onAddCustomLink, onRemoveCustomLink, onGenerate,
}: {
  fd: FormData
  customLinks: string[]
  urlErrors: string[]
  onToggleLink: (url: string) => void
  onUpdateCustomLink: (index: number, value: string) => void
  onAddCustomLink: () => void
  onRemoveCustomLink: (index: number) => void
  onGenerate: () => void
}) {
  return (
    <div className="space-y-5">
      <div>
        <label className="mb-1.5 block text-xs font-medium text-gray-600">
          Suggested Evidence Sources <span className="font-normal text-gray-400">(selected by default)</span>
        </label>

        <div className="space-y-3">
          {EVIDENCE_LINK_SUGGESTIONS.map((item) => {
            const checked = fd.referenceLinks.includes(item.url)

            return (
              <label
                key={item.url}
                className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 transition-colors hover:border-[#004FBA]/30 hover:bg-[#004FBA]/[0.02]"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggleLink(item.url)}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-[#004FBA] focus:ring-[#004FBA]"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                  <p className="mt-0.5 break-all text-xs text-gray-400">{item.url}</p>
                </div>
              </label>
            )
          })}
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-gray-600">
          Reference Links <span className="font-normal text-gray-400">(optional)</span>
        </label>

        <div className="space-y-2">
          {customLinks.map((link, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="relative flex-1">
                <Link2
                  className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                  aria-hidden="true"
                />
                <input
                  type="url"
                  value={link}
                  onChange={(e) => onUpdateCustomLink(index, e.target.value)}
                  placeholder="https://guidelines.org/..."
                  className={cn(
                    'h-11 w-full rounded-xl border bg-gray-50 pl-10 pr-4 text-sm text-gray-900',
                    'placeholder:text-gray-400 transition focus:bg-white focus:outline-none focus:ring-2',
                    urlErrors[index]
                      ? 'border-red-300 focus:border-red-400 focus:ring-red-400/20'
                      : 'border-gray-200 focus:border-[#004FBA] focus:ring-[#004FBA]/15',
                  )}
                />
              </div>
              {customLinks.length > 1 && (
                <button
                  type="button"
                  onClick={() => onRemoveCustomLink(index)}
                  aria-label="Remove link"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004FBA]"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              )}
            </div>
          ))}
        </div>

        {urlErrors.some(Boolean) && (
          <p className="mt-1.5 text-xs text-red-500">Please enter valid URLs (e.g. https://...)</p>
        )}

        <button
          type="button"
          onClick={onAddCustomLink}
          className="mt-3 inline-flex items-center gap-1.5 rounded text-xs font-semibold text-[#004FBA] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004FBA]"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          Add another link
        </button>
      </div>

      <GenerateButton
        label="Generate Recommended Metrics & Business Rules for Care Gap Quantification"
        sticky={false}
        onClick={onGenerate}
        disabled={false}
      />
    </div>
  )
}

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
          'Describe how you want results grouped...\n\n' +
          'e.g.\n- HCP-level (by NPI)\n- Account-level\n- Territory / geography\n- Payer\n- Age band\n- Custom segmentation'
        }
        className={TEXTAREA_CLS}
      />
    </div>
  )
}

export function AnalysisWizard() {
  const router = useRouter()
  const [fd, setFd] = useState<FormData>(INITIAL)
  const [customLinks, setCustomLinks] = useState<string[]>([''])
  const [urlErrors, setUrlErrors] = useState<string[]>([''])
  const [generating, setGenerating] = useState(false)
  const [activeSection, setActiveSection] = useState<SectionId | null>(null)

  function set<K extends keyof FormData>(key: K, value: FormData[K]) {
    setFd((prev) => ({ ...prev, [key]: value }))
  }

  function toggleEvidenceLink(url: string) {
    setFd((prev) => {
      const exists = prev.referenceLinks.includes(url)
      return {
        ...prev,
        referenceLinks: exists
          ? prev.referenceLinks.filter((link) => link !== url)
          : [...prev.referenceLinks, url],
      }
    })
  }

  function validateLink(index: number, val: string) {
    setUrlErrors((prev) => {
      const next = [...prev]
      if (!val.trim()) {
        next[index] = ''
        return next
      }
      try {
        new URL(val.trim())
        next[index] = ''
      } catch {
        next[index] = 'Please enter a valid URL (e.g. https://...)'
      }
      return next
    })
  }

  function updateCustomLink(index: number, value: string) {
    setCustomLinks((prev) => {
      const next = [...prev]
      next[index] = value
      return next
    })
    validateLink(index, value)
  }

  function addCustomLink() {
    setCustomLinks((prev) => [...prev, ''])
    setUrlErrors((prev) => [...prev, ''])
  }

  function removeCustomLink(index: number) {
    setCustomLinks((prev) => prev.filter((_, i) => i !== index))
    setUrlErrors((prev) => prev.filter((_, i) => i !== index))
  }

  const completion = SECTIONS.map((section) => section.isComplete(fd))
  const completedCount = completion.filter(Boolean).length
  const isGenerateDisabled = completion.some((done) => !done)

  function handleOpenEvidenceSources() {
    setFd((prev) => (
      prev.referenceLinks.length > 0
        ? prev
        : { ...prev, referenceLinks: EVIDENCE_LINK_SUGGESTIONS.map((item) => item.url) }
    ))
    setActiveSection('evidence')
  }

  async function handleGenerateMetricsAndRules() {
    setGenerating(true)
    await new Promise((r) => setTimeout(r, 9600))
    router.push(`/care-gaps/${TARGET_ID}`)
  }

  if (generating) {
    return <ProcessingLoader />
  }

  const activeDef = activeSection === 'evidence'
    ? EVIDENCE_SECTION
    : SECTIONS.find((s) => s.id === activeSection) ?? null

  function renderSectionContent(id: SectionId): ReactNode {
    switch (id) {
      case 'clinical':
        return <StepClinical fd={fd} set={set} />
      case 'market':
        return <StepMarket fd={fd} set={set} />
      case 'output':
        return <StepOutput fd={fd} set={set} />
      case 'evidence':
        return (
          <StepEvidence
            fd={fd}
            customLinks={customLinks}
            urlErrors={urlErrors}
            onToggleLink={toggleEvidenceLink}
            onUpdateCustomLink={updateCustomLink}
            onAddCustomLink={addCustomLink}
            onRemoveCustomLink={removeCustomLink}
            onGenerate={handleGenerateMetricsAndRules}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="w-full max-w-3xl">
      <div className="mb-7 text-center">
        <h1 className="text-xl font-bold text-gray-900">Care Gap Context and Input</h1>
        <p className="mt-1 text-sm text-gray-400">Configure each section, then generate recommended evidence sources</p>
      </div>

      <ProgressHeader completed={completedCount} total={SECTIONS.length} />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {SECTIONS.map((section, i) => (
          <ConfigurationCard
            key={section.id}
            icon={section.icon}
            title={section.title}
            description={section.description}
            completed={completion[i]}
            required={section.required}
            onClick={() => setActiveSection(section.id)}
          />
        ))}
      </div>

      <div className="mt-7">
        <GenerateButton disabled={isGenerateDisabled} onClick={handleOpenEvidenceSources} />
      </div>

      {activeDef && (
        <SectionModal
          open
          icon={activeDef.icon}
          title={activeDef.title}
          subtitle={activeDef.description}
          onClose={() => setActiveSection(null)}
          onSave={() => setActiveSection(null)}
          showSave={activeDef.id !== 'evidence'}
          widthClassName={activeDef.id === 'evidence' ? 'max-w-2xl' : 'max-w-lg'}
        >
          {renderSectionContent(activeDef.id)}
        </SectionModal>
      )}
    </div>
  )
}
