'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { format, addDays } from 'date-fns'
import { Calendar, Users, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { calculateNights } from '@/lib/utils'

export function BookingWidget() {
  const router = useRouter()
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState('1')
  const [error, setError] = useState('')

  const today = format(new Date(), 'yyyy-MM-dd')
  const minCheckOut = checkIn ? format(addDays(new Date(checkIn), 1), 'yyyy-MM-dd') : today

  const handleCheckInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setCheckIn(value)
    if (value && checkOut && value >= checkOut) {
      setCheckOut('')
      setError('')
    } else {
      setError('')
    }
  }

  const handleCheckOutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setCheckOut(value)
    if (checkIn && value <= checkIn) {
      setError('La fecha de salida debe ser posterior a la fecha de llegada')
    } else {
      setError('')
    }
  }

  const handleSearch = () => {
    if (!checkIn || !checkOut) {
      setError('Por favor, selecciona ambas fechas')
      return
    }

    if (checkOut <= checkIn) {
      setError('La fecha de salida debe ser posterior a la fecha de llegada')
      return
    }

    const checkInDate = new Date(checkIn)
    if (checkInDate < new Date(today)) {
      setError('No puedes seleccionar fechas pasadas')
      return
    }

    // Redirigir a la página de reserva con los parámetros
    const params = new URLSearchParams({
      checkIn,
      checkOut,
      guests,
    })
    router.push(`/reservar?${params.toString()}`)
  }

  const nights = checkIn && checkOut ? calculateNights(checkIn, checkOut) : 0

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 w-full max-w-5xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Check-in */}
        <div className="space-y-2">
          <label htmlFor="hero-checkIn" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gold" />
            Check-in
          </label>
          <Input
            id="hero-checkIn"
            type="date"
            value={checkIn}
            onChange={handleCheckInChange}
            min={today}
            className="h-12 text-base"
            required
          />
          <p className="text-xs text-gray-500">Desde 14:00</p>
        </div>

        {/* Check-out */}
        <div className="space-y-2">
          <label htmlFor="hero-checkOut" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gold" />
            Check-out
          </label>
          <Input
            id="hero-checkOut"
            type="date"
            value={checkOut}
            onChange={handleCheckOutChange}
            min={minCheckOut}
            disabled={!checkIn}
            className="h-12 text-base"
            required
          />
          <p className="text-xs text-gray-500">Hasta 12:00</p>
        </div>

        {/* Huéspedes */}
        <div className="space-y-2">
          <label htmlFor="hero-guests" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Users className="h-4 w-4 text-gold" />
            Huéspedes
          </label>
          <Input
            id="hero-guests"
            type="number"
            min="1"
            max="6"
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            className="h-12 text-base"
            required
          />
          <p className="text-xs text-gray-500">Máx. 6 personas</p>
        </div>

        {/* Botón de búsqueda */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 opacity-0 pointer-events-none">
            Buscar
          </label>
          <Button
            onClick={handleSearch}
            disabled={!checkIn || !checkOut || !!error}
            size="lg"
            variant="gold"
            className="h-12 w-full text-base sm:text-lg font-semibold"
          >
            <Search className="h-5 w-5 mr-2" />
            Buscar
          </Button>
        </div>
      </div>

      {nights > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-center text-gray-600">
            <span className="font-semibold text-navy">{nights}</span> {nights === 1 ? 'noche' : 'noches'} seleccionada{nights > 1 ? 's' : ''}
          </p>
        </div>
      )}

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}
    </div>
  )
}

