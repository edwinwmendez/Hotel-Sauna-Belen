'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ReservationWithDetails } from '@/lib/queries/reception'
import { formatCurrency, formatDate, calculateNights } from '@/lib/utils'
import { extendStay } from '@/lib/actions/reception'
import { Calendar, Clock, DollarSign, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { addDays } from 'date-fns'

interface ExtendStayCardProps {
  reservation: ReservationWithDetails
  onSuccess?: () => void
}

export function ExtendStayCard({ reservation, onSuccess }: ExtendStayCardProps) {
  const { reservation: res, room } = reservation
  const [newCheckOut, setNewCheckOut] = useState('')
  const [notes, setNotes] = useState('')
  const [extending, setExtending] = useState(false)

  // Calcular fechas mínimas y máximas
  const currentCheckOutDate = new Date(res.check_out)
  const minCheckOut = addDays(currentCheckOutDate, 1).toISOString().split('T')[0]
  const today = new Date().toISOString().split('T')[0]

  // Calcular precio adicional cuando cambia la fecha
  const calculateAdditionalPrice = () => {
    if (!newCheckOut || newCheckOut <= res.check_out) return 0

    const additionalNights = calculateNights(res.check_out, newCheckOut)
    const pricePerNight = room.price_per_night
    return additionalNights * pricePerNight
  }

  const additionalPrice = calculateAdditionalPrice()
  const additionalNights = newCheckOut
    ? Math.max(0, calculateNights(res.check_out, newCheckOut))
    : 0
  const newTotal = additionalPrice > 0 ? Number(res.total_price) + additionalPrice : Number(res.total_price)

  const handleExtend = async () => {
    if (!newCheckOut) {
      toast.error('Por favor, selecciona una nueva fecha de check-out')
      return
    }

    if (newCheckOut <= res.check_out) {
      toast.error('La nueva fecha de check-out debe ser posterior a la fecha actual')
      return
    }

    setExtending(true)
    try {
      const result = await extendStay(res.id, newCheckOut, notes || undefined)

      if (result.success) {
        toast.success(
          `Estancia extendida exitosamente. Precio adicional: ${formatCurrency(result.additionalPrice || 0)}`
        )
        setNewCheckOut('')
        setNotes('')
        onSuccess?.()
      } else {
        toast.error(result.error || 'Error al extender la estancia')
      }
    } catch (error) {
      console.error('Error extendiendo estancia:', error)
      toast.error('Error al procesar la extensión')
    } finally {
      setExtending(false)
    }
  }

  return (
    <Card className="border-2 border-blue-200">
      <CardHeader className="p-4 sm:p-6 border-b bg-blue-50">
        <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-600" />
          Extender Estancia
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm mt-1">
          Permite al huésped quedarse más días. Se calculará el precio adicional automáticamente.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 space-y-6">
        {/* Información actual */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <h4 className="font-medium text-sm text-gray-700">Información Actual</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-gray-600">Check-in:</span>
              <span className="ml-2 font-medium">{formatDate(res.check_in)}</span>
            </div>
            <div>
              <span className="text-gray-600">Check-out actual:</span>
              <span className="ml-2 font-medium">{formatDate(res.check_out)}</span>
            </div>
            <div>
              <span className="text-gray-600">Noches actuales:</span>
              <span className="ml-2 font-medium">{res.nights} noche(s)</span>
            </div>
            <div>
              <span className="text-gray-600">Precio actual:</span>
              <span className="ml-2 font-medium">{formatCurrency(Number(res.total_price))}</span>
            </div>
          </div>
        </div>

        {/* Formulario de extensión */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="newCheckOut" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Nueva fecha de check-out *
            </label>
            <Input
              id="newCheckOut"
              type="date"
              value={newCheckOut}
              onChange={(e) => setNewCheckOut(e.target.value)}
              min={minCheckOut}
              className="w-full"
              required
            />
            <p className="text-xs text-gray-500">
              La fecha debe ser posterior a {formatDate(res.check_out)}
            </p>
          </div>

          {/* Cálculo de precio adicional */}
          {newCheckOut && newCheckOut > res.check_out && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
              <h4 className="font-medium text-sm text-green-900 flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Resumen de Extensión
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-green-700">Noches adicionales:</span>
                  <span className="ml-2 font-medium text-green-900">{additionalNights} noche(s)</span>
                </div>
                <div>
                  <span className="text-green-700">Precio por noche:</span>
                  <span className="ml-2 font-medium text-green-900">
                    {formatCurrency(room.price_per_night)}
                  </span>
                </div>
                <div>
                  <span className="text-green-700">Precio adicional:</span>
                  <span className="ml-2 font-semibold text-green-900 text-base">
                    {formatCurrency(additionalPrice)}
                  </span>
                </div>
                <div>
                  <span className="text-green-700">Nuevo total:</span>
                  <span className="ml-2 font-semibold text-green-900 text-base">
                    {formatCurrency(newTotal)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Notas opcionales */}
          <div className="space-y-2">
            <label htmlFor="extendNotes" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Notas (opcional)
            </label>
            <textarea
              id="extendNotes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Agregar notas sobre la extensión de estancia..."
              className="w-full min-h-[80px] px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={500}
            />
            <p className="text-xs text-gray-500">{notes.length}/500 caracteres</p>
          </div>

          {/* Botón de acción */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              onClick={handleExtend}
              disabled={extending || !newCheckOut || newCheckOut <= res.check_out}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {extending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Extendiendo...
                </>
              ) : (
                <>
                  <Calendar className="mr-2 h-4 w-4" />
                  Extender Estancia
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

