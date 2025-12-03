'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { GuestSearchSchema, type GuestSearchData } from '@/lib/validations/reception'
import { searchGuestByDocumentAction, getGuestStatsAction } from '@/lib/actions/guests'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2, Search, User, Mail, Phone, Calendar, History } from 'lucide-react'
import { DOCUMENT_TYPES } from '@/lib/constants'
import type { Database } from '@/lib/supabase/types'

type Guest = Database['public']['Tables']['guests']['Row']

interface GuestSearchProps {
  onGuestFound: (guest: Guest) => void
  defaultDocumentType?: 'DNI' | 'CE' | 'PASAPORTE'
  showHistory?: boolean
}

export function GuestSearch({
  onGuestFound,
  defaultDocumentType = 'DNI',
  showHistory = true,
}: GuestSearchProps) {
  const [loading, setLoading] = useState(false)
  const [foundGuest, setFoundGuest] = useState<Guest | null>(null)
  const [guestStats, setGuestStats] = useState<{ stay_count: number; last_stay: string | null } | null>(null)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GuestSearchData>({
    resolver: zodResolver(GuestSearchSchema),
    defaultValues: {
      documentType: defaultDocumentType,
      documentNumber: '',
    },
  })

  const onSubmit = async (data: GuestSearchData) => {
    setLoading(true)
    setError('')
    setFoundGuest(null)
    setGuestStats(null)

    try {
      const result = await searchGuestByDocumentAction(data.documentType, data.documentNumber)

      if (result.error || !result.guest) {
        setError(result.error || 'Cliente no encontrado. Por favor, verifica el tipo y número de documento.')
        setLoading(false)
        return
      }

      setFoundGuest(result.guest)

      // Si se debe mostrar historial, obtener estadísticas
      if (showHistory) {
        const statsResult = await getGuestStatsAction(result.guest.id)
        if (statsResult.stats) {
          setGuestStats(statsResult.stats)
        }
      }

      setLoading(false)
    } catch (err) {
      console.error('Error buscando cliente:', err)
      setError('Error al buscar el cliente. Por favor, intenta de nuevo.')
      setLoading(false)
    }
  }

  const handleUseGuest = () => {
    if (foundGuest) {
      onGuestFound(foundGuest)
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl">Buscar Cliente por Documento</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Ingresa el tipo y número de documento para buscar un cliente
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="space-y-2">
                <label htmlFor="documentType" className="text-sm font-medium text-gray-700">
                  Tipo de documento
                </label>
                <select
                  id="documentType"
                  {...register('documentType')}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  {DOCUMENT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2 sm:col-span-2">
                <label htmlFor="documentNumber" className="text-sm font-medium text-gray-700">
                  Número de documento *
                </label>
                <div className="flex gap-2">
                  <Input
                    id="documentNumber"
                    {...register('documentNumber')}
                    placeholder="12345678"
                    className={errors.documentNumber ? 'border-red-500' : ''}
                    autoComplete="off"
                  />
                  <Button type="submit" disabled={loading} className="flex-shrink-0">
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                    <span className="hidden sm:inline ml-2">Buscar</span>
                  </Button>
                </div>
                {errors.documentNumber && (
                  <p className="text-sm text-red-600">{errors.documentNumber.message}</p>
                )}
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {foundGuest && (
        <Card className="border-green-200 bg-green-50/50">
          <CardHeader className="p-4 sm:p-6">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                  <User className="h-5 w-5 text-green-600" />
                  Cliente Encontrado
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm mt-1">
                  Datos del cliente verificados
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs sm:text-sm text-gray-600">Nombre completo</p>
                  <p className="text-sm sm:text-base font-semibold text-gray-900">
                    {foundGuest.full_name}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs sm:text-sm text-gray-600">Email</p>
                  <p className="text-sm sm:text-base font-semibold text-gray-900 break-all">
                    {foundGuest.email}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs sm:text-sm text-gray-600">Teléfono</p>
                  <p className="text-sm sm:text-base font-semibold text-gray-900">
                    {foundGuest.phone}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <History className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs sm:text-sm text-gray-600">Documento</p>
                  <p className="text-sm sm:text-base font-semibold text-gray-900">
                    {foundGuest.document_type}: {foundGuest.document_number}
                  </p>
                </div>
              </div>
            </div>

            {showHistory && guestStats && (
              <div className="pt-3 border-t border-gray-200">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-gold" />
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm text-gray-600">Historial de estancias</p>
                    <p className="text-sm sm:text-base font-semibold text-gray-900">
                      {guestStats.stay_count} {guestStats.stay_count === 1 ? 'visita' : 'visitas'}
                      {guestStats.last_stay && (
                        <span className="text-xs sm:text-sm text-gray-500 block mt-1">
                          Última visita: {new Date(guestStats.last_stay).toLocaleDateString('es-PE', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-4 flex gap-3">
              <Button
                onClick={handleUseGuest}
                className="flex-1 sm:flex-none"
                variant="default"
              >
                Usar este Cliente
              </Button>
              <Button
                onClick={() => {
                  setFoundGuest(null)
                  setGuestStats(null)
                  setError('')
                }}
                variant="outline"
                className="flex-1 sm:flex-none"
              >
                Buscar Otro
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

