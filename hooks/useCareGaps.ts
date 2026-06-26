'use client'

import { useState, useEffect, useMemo } from 'react'
import type { CareGap, TherapyArea, CareGapStatus } from '@/lib/types'
import { getCareGaps } from '@/lib/api'

interface UseCareGapsReturn {
  careGaps: CareGap[]
  filteredCareGaps: CareGap[]
  isLoading: boolean
  error: string | null
  searchQuery: string
  setSearchQuery: (q: string) => void
  selectedTherapyArea: TherapyArea | 'All'
  setSelectedTherapyArea: (area: TherapyArea | 'All') => void
  selectedStatus: CareGapStatus | 'All'
  setSelectedStatus: (status: CareGapStatus | 'All') => void
  therapyAreas: Array<TherapyArea | 'All'>
  statuses: Array<CareGapStatus | 'All'>
}

export function useCareGaps(): UseCareGapsReturn {
  const [careGaps, setCareGaps] = useState<CareGap[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTherapyArea, setSelectedTherapyArea] = useState<TherapyArea | 'All'>('All')
  const [selectedStatus, setSelectedStatus] = useState<CareGapStatus | 'All'>('All')

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    setError(null)

    getCareGaps().then((result) => {
      if (cancelled) return
      if (result.success) {
        setCareGaps(result.data)
      } else {
        setError(result.error.message)
      }
      setIsLoading(false)
    })

    return () => { cancelled = true }
  }, [])

  const therapyAreas = useMemo<Array<TherapyArea | 'All'>>(() => {
    const unique = Array.from(new Set(careGaps.map((g) => g.therapyArea)))
    return ['All', ...unique]
  }, [careGaps])

  const statuses = useMemo<Array<CareGapStatus | 'All'>>(() => {
    const unique = Array.from(new Set(careGaps.map((g) => g.status)))
    return ['All', ...unique]
  }, [careGaps])

  const filteredCareGaps = useMemo(() => {
    return careGaps.filter((gap) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        gap.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        gap.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        gap.therapyArea.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesArea =
        selectedTherapyArea === 'All' || gap.therapyArea === selectedTherapyArea

      const matchesStatus =
        selectedStatus === 'All' || gap.status === selectedStatus

      return matchesSearch && matchesArea && matchesStatus
    })
  }, [careGaps, searchQuery, selectedTherapyArea, selectedStatus])

  return {
    careGaps,
    filteredCareGaps,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    selectedTherapyArea,
    setSelectedTherapyArea,
    selectedStatus,
    setSelectedStatus,
    therapyAreas,
    statuses,
  }
}
