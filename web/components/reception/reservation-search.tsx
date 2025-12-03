'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  searchReservationByCode,
  searchReservationsByDocument,
  searchReservationsByName,
} from '@/lib/actions/reception'
import { Loader2, Search, Hash, User, FileText } from 'lucide-react'
import { ReservationWithDetails } from '@/lib/queries/reception'
import { DOCUMENT_TYPES } from '@/lib/constants'

type SearchType = 'code' | 'document' | 'name'

interface ReservationSearchProps {
  onReservationSelect: (reservation: ReservationWithDetails) => void
  searchType?: SearchType
  onlyActive?: boolean
  placeholder?: string
}

export function ReservationSearch({
  onReservationSelect,
  searchType: defaultSearchType = 'code',
  onlyActive = false,
  placeholder,
}: ReservationSearchProps) {
  const [searchType, setSearchType] = useState<SearchType>(defaultSearchType)
  const [loading, setLoading] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [results, setResults] = useState<ReservationWithDetails[]>([])
  const [error, setError] = useState('')
  const [documentType, setDocumentType] = useState<'DNI' | 'CE' | 'PASAPORTE'>('DNI')

  const handleSearch = async () => {
    if (!searchValue.trim()) {
      setError('Por favor, ingresa un valor para buscar')
      return
    }

    setLoading(true)
    setError('')
    setResults([])

    try {
      let searchResult:
        | { reservation: ReservationWithDetails | null; error?: string }
        | { reservations: ReservationWithDetails[]; error?: string }

      if (searchType === 'code') {
        searchResult = await searchReservationByCode(searchValue.trim())
        if (searchResult.reservation) {
          setResults([searchResult.reservation])
        } else {
          setError(searchResult.error || 'Reserva no encontrada')
        }
      } else if (searchType === 'document') {
        searchResult = await searchReservationsByDocument(documentType, searchValue.trim(), onlyActive)
        if (searchResult.reservations && searchResult.reservations.length > 0) {
          setResults(searchResult.reservations)
        } else {
          setError(searchResult.error || 'No se encontraron reservas')
        }
      } else {
        // searchType === 'name'
        searchResult = await searchReservationsByName(searchValue.trim(), onlyActive)
        if (searchResult.reservations && searchResult.reservations.length > 0) {
          setResults(searchResult.reservations)
        } else {
          setError(searchResult.error || 'No se encontraron reservas')
        }
      }
    } catch (err) {
      console.error('Error buscando reservas:', err)
      setError('Error al buscar reservas. Por favor, intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl">Buscar Reserva</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Busca una reserva por código, documento del cliente o nombre
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0 space-y-4">
          {/* Selector de tipo de búsqueda */}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setSearchType('code')
                setSearchValue('')
                setResults([])
                setError('')
              }}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                searchType === 'code'
                  ? 'bg-navy text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Hash className="h-4 w-4" />
              Por Código
            </button>
            <button
              type="button"
              onClick={() => {
                setSearchType('document')
                setSearchValue('')
                setResults([])
                setError('')
              }}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                searchType === 'document'
                  ? 'bg-navy text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FileText className="h-4 w-4" />
              Por DNI
            </button>
            <button
              type="button"
              onClick={() => {
                setSearchType('name')
                setSearchValue('')
                setResults([])
                setError('')
              }}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                searchType === 'name'
                  ? 'bg-navy text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <User className="h-4 w-4" />
              Por Nombre
            </button>
          </div>

          {/* Input de búsqueda */}
          <div className="flex gap-2">
            {searchType === 'document' && (
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value as 'DNI' | 'CE' | 'PASAPORTE')}
                className="flex h-10 w-32 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {DOCUMENT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            )}

            <Input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                placeholder ||
                (searchType === 'code'
                  ? 'HSB-20251215-4521'
                  : searchType === 'document'
                    ? '12345678'
                    : 'Juan Pérez García')
              }
              className="flex-1"
              autoComplete="off"
            />

            <Button type="button" onClick={handleSearch} disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              <span className="hidden sm:inline ml-2">Buscar</span>
            </Button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resultados */}
      {results.length > 0 && (
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">
              Resultados ({results.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="space-y-3">
              {results.map((result) => (
                <div
                  key={result.reservation.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => onReservationSelect(result)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-sm sm:text-base text-navy">
                          {result.reservation.booking_code}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            result.reservation.status === 'confirmed'
                              ? 'bg-green-100 text-green-700'
                              : result.reservation.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-700'
                                : result.reservation.status === 'completed'
                                  ? 'bg-gray-100 text-gray-700'
                                  : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {result.reservation.status}
                        </span>
                      </div>
                      <p className="text-sm sm:text-base font-medium text-gray-900">
                        {result.guest.full_name}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600">
                        {result.room.name}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        Check-in: {new Date(result.reservation.check_in).toLocaleDateString('es-PE')} • Check-out:{' '}
                        {new Date(result.reservation.check_out).toLocaleDateString('es-PE')}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation()
                        onReservationSelect(result)
                      }}
                    >
                      Seleccionar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

