'use client'

import { useState } from 'react'
import { format, addDays } from 'date-fns'
import { Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { calculateNights } from '@/lib/utils'

interface StepDatesProps {
  checkIn: string | null
  checkOut: string | null
  onDatesChange: (checkIn: string, checkOut: string) => void
  onNext: () => void
}

export function StepDates({ checkIn, checkOut, onDatesChange, onNext }: StepDatesProps) {
  const [localCheckIn, setLocalCheckIn] = useState(checkIn || '')
  const [localCheckOut, setLocalCheckOut] = useState(checkOut || '')
  const [error, setError] = useState('')

  const today = format(new Date(), 'yyyy-MM-dd')
  const minCheckOut = localCheckIn ? format(addDays(new Date(localCheckIn), 1), 'yyyy-MM-dd') : today

  const handleCheckInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setLocalCheckIn(value)
    
    if (value && localCheckOut && value >= localCheckOut) {
      setLocalCheckOut('')
      setError('')
    } else {
      setError('')
    }
  }

  const handleCheckOutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setLocalCheckOut(value)
    
    if (localCheckIn && value <= localCheckIn) {
      setError('La fecha de salida debe ser posterior a la fecha de llegada')
    } else {
      setError('')
    }
  }

  const handleContinue = () => {
    if (!localCheckIn || !localCheckOut) {
      setError('Por favor, selecciona ambas fechas')
      return
    }

    if (localCheckOut <= localCheckIn) {
      setError('La fecha de salida debe ser posterior a la fecha de llegada')
      return
    }

    const checkInDate = new Date(localCheckIn)
    
    if (checkInDate < new Date(today)) {
      setError('No puedes seleccionar fechas pasadas')
      return
    }

    onDatesChange(localCheckIn, localCheckOut)
    onNext()
  }

  const nights = localCheckIn && localCheckOut ? calculateNights(localCheckIn, localCheckOut) : 0

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-navy mb-2">¿Cuándo nos visitas?</h2>
        <p className="text-sm sm:text-base text-gray-600">Selecciona tus fechas de llegada y salida</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div className="space-y-2">
          <label htmlFor="checkIn" className="text-sm font-medium text-gray-700">
            Check-in (llegada) *
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              id="checkIn"
              type="date"
              value={localCheckIn}
              onChange={handleCheckInChange}
              min={today}
              className="pl-10"
              required
            />
          </div>
          <p className="text-xs text-gray-500">Hora de check-in: desde las 14:00</p>
        </div>

        <div className="space-y-2">
          <label htmlFor="checkOut" className="text-sm font-medium text-gray-700">
            Check-out (salida) *
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              id="checkOut"
              type="date"
              value={localCheckOut}
              onChange={handleCheckOutChange}
              min={minCheckOut}
              disabled={!localCheckIn}
              className="pl-10"
              required
            />
          </div>
          <p className="text-xs text-gray-500">Hora de check-out: hasta las 12:00</p>
        </div>
      </div>

      {nights > 0 && (
        <div className="bg-cream p-3 sm:p-4 rounded-lg">
          <p className="text-base sm:text-lg font-semibold text-navy">
            {nights} {nights === 1 ? 'noche' : 'noches'} seleccionada{nights > 1 ? 's' : ''}
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm sm:text-base">
          {error}
        </div>
      )}

      <div className="flex justify-end">
        <Button onClick={handleContinue} disabled={!localCheckIn || !localCheckOut || !!error} className="w-full sm:w-auto">
          Continuar →
        </Button>
      </div>
    </div>
  )
}

