'use client'

import { useState } from 'react'
import { Users, User, Baby, UserCircle, UserCheck, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface GuestsSelectorProps {
  adults: number
  youths: number
  children: number
  infants: number
  onChange: (guests: { adults: number; youths: number; children: number; infants: number }) => void
  className?: string
}

export function GuestsSelector({
  adults,
  youths,
  children,
  infants,
  onChange,
  className = '',
}: GuestsSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const total = adults + youths + children + infants

  const updateGuests = (type: 'adults' | 'youths' | 'children' | 'infants', delta: number) => {
    const newGuests = { adults, youths, children, infants }
    const current = newGuests[type]
    const newValue = Math.max(0, Math.min(6, current + delta))
    
    // Validar que siempre haya al menos 1 adulto
    if (type === 'adults' && newValue < 1) return
    
    newGuests[type] = newValue
    onChange(newGuests)
  }

  const getDisplayText = () => {
    if (total === 1 && adults === 1) return '1 persona'
    const parts: string[] = []
    if (adults > 0) parts.push(`${adults} adulto${adults > 1 ? 's' : ''}`)
    if (youths > 0) parts.push(`${youths} joven${youths > 1 ? 'es' : ''}`)
    if (children > 0) parts.push(`${children} niño${children > 1 ? 's' : ''}`)
    if (infants > 0) parts.push(`${infants} bebé${infants > 1 ? 's' : ''}`)
    return parts.join(', ') || '1 persona'
  }

  return (
    <div className={`relative ${className}`}>
      <Button
        type="button"
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="h-10 sm:h-12 w-full justify-between text-sm sm:text-base"
      >
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-gold" />
          <span className="text-left">{getDisplayText()}</span>
        </div>
        <span className="text-gray-400">▼</span>
      </Button>

      {isOpen && (
        <>
          {/* Overlay para cerrar */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Panel de selección */}
          <Card className="absolute top-full left-0 right-0 mt-2 z-20 shadow-xl">
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">Huéspedes</h3>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="h-6 w-6"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Adultos */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-navy" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Adultos</p>
                    <p className="text-xs text-gray-500">13+ años</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateGuests('adults', -1)}
                    disabled={adults <= 1}
                  >
                    -
                  </Button>
                  <span className="w-8 text-center font-semibold">{adults}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateGuests('adults', 1)}
                    disabled={adults >= 6 || total >= 6}
                  >
                    +
                  </Button>
                </div>
              </div>

              {/* Jóvenes */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-navy" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Jóvenes</p>
                    <p className="text-xs text-gray-500">8-12 años</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateGuests('youths', -1)}
                    disabled={youths <= 0}
                  >
                    -
                  </Button>
                  <span className="w-8 text-center font-semibold">{youths}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateGuests('youths', 1)}
                    disabled={youths >= 6 || total >= 6}
                  >
                    +
                  </Button>
                </div>
              </div>

              {/* Niños */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserCircle className="h-5 w-5 text-navy" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Niños</p>
                    <p className="text-xs text-gray-500">3-7 años</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateGuests('children', -1)}
                    disabled={children <= 0}
                  >
                    -
                  </Button>
                  <span className="w-8 text-center font-semibold">{children}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateGuests('children', 1)}
                    disabled={children >= 6 || total >= 6}
                  >
                    +
                  </Button>
                </div>
              </div>

              {/* Bebés */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Baby className="h-5 w-5 text-navy" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Bebés</p>
                    <p className="text-xs text-gray-500">0-2 años</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateGuests('infants', -1)}
                    disabled={infants <= 0}
                  >
                    -
                  </Button>
                  <span className="w-8 text-center font-semibold">{infants}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateGuests('infants', 1)}
                    disabled={infants >= 6 || total >= 6}
                  >
                    +
                  </Button>
                </div>
              </div>

              <div className="pt-2 border-t">
                <p className="text-xs text-gray-500 text-center">
                  Total: <span className="font-semibold text-navy">{total}</span> {total === 1 ? 'persona' : 'personas'} (máx. 6)
                </p>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

