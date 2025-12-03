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
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl p-3 sm:p-4 md:p-6 lg:p-8 w-full max-w-5xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
        {/* Check-in */}
        <div className="space-y-1 sm:space-y-2">
          <label htmlFor="hero-checkIn" className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center gap-1 sm:gap-2">
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-gold flex-shrink-0" />
            <span className="hidden sm:inline">Check-in</span>
            <span className="sm:hidden">Llegada</span>
          </label>
          <Input
            id="hero-checkIn"
            type="date"
            value={checkIn}
            onChange={handleCheckInChange}
            min={today}
            className="h-10 sm:h-12 text-sm sm:text-base"
            required
          />
          <p className="text-[10px] sm:text-xs text-gray-500 hidden sm:block">Desde 14:00</p>
        </div>

        {/* Check-out */}
        <div className="space-y-1 sm:space-y-2">
          <label htmlFor="hero-checkOut" className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center gap-1 sm:gap-2">
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-gold flex-shrink-0" />
            <span className="hidden sm:inline">Check-out</span>
            <span className="sm:hidden">Salida</span>
          </label>
          <Input
            id="hero-checkOut"
            type="date"
            value={checkOut}
            onChange={handleCheckOutChange}
            min={minCheckOut}
            disabled={!checkIn}
            className="h-10 sm:h-12 text-sm sm:text-base"
            required
          />
          <p className="text-[10px] sm:text-xs text-gray-500 hidden sm:block">Hasta 12:00</p>
        </div>

        {/* Huéspedes */}
        <div className="space-y-1 sm:space-y-2">
          <label htmlFor="hero-guests" className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center gap-1 sm:gap-2">
            <Users className="h-3 w-3 sm:h-4 sm:w-4 text-gold flex-shrink-0" />
            <span className="hidden sm:inline">Huéspedes</span>
            <span className="sm:hidden">Personas</span>
          </label>
          <Input
            id="hero-guests"
            type="number"
            min="1"
            max="6"
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            className="h-10 sm:h-12 text-sm sm:text-base"
            required
          />
          <p className="text-[10px] sm:text-xs text-gray-500 hidden sm:block">Máx. 6 personas</p>
        </div>

        {/* Botón de búsqueda */}
        <div className="space-y-1 sm:space-y-2 col-span-2 md:col-span-1">
          <label className="text-xs sm:text-sm font-semibold text-gray-700 opacity-0 pointer-events-none hidden sm:block">
            Buscar
          </label>
          <Button
            onClick={handleSearch}
            disabled={!checkIn || !checkOut || !!error}
            size="lg"
            variant="gold"
            className="h-10 sm:h-12 w-full text-sm sm:text-base md:text-lg font-semibold"
          >
            <Search className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
            Buscar
          </Button>
        </div>
      </div>

      {nights > 0 && (
        <div className="mt-2 sm:mt-4 pt-2 sm:pt-4 border-t border-gray-200">
          <p className="text-xs sm:text-sm text-center text-gray-600">
            <span className="font-semibold text-navy">{nights}</span> {nights === 1 ? 'noche' : 'noches'} seleccionada{nights > 1 ? 's' : ''}
          </p>
        </div>
      )}

      {error && (
        <div className="mt-2 sm:mt-4 bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-xs sm:text-sm">
          {error}
        </div>
      )}
    </div>
  )
}

