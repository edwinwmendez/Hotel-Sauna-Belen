'use client'

import { Button } from '@/components/ui/button'
import { ReservationWithDetails } from '@/lib/queries/reception'
import { Bed, LogOut, CalendarPlus, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

interface ActiveGuestsListProps {
  activeGuests: ReservationWithDetails[]
}

export default function ActiveGuestsList({ activeGuests }: ActiveGuestsListProps) {
  if (activeGuests.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <Bed className="h-16 w-16 mx-auto mb-4 text-gray-400" />
        <p className="text-base font-medium">No hay huéspedes actualmente en el hotel</p>
        <p className="text-sm text-gray-400 mt-2">Todas las habitaciones están disponibles</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {activeGuests.map((item) => {
        const checkInDate = item.reservation.checked_in_at
          ? new Date(item.reservation.checked_in_at)
          : null
        const checkOutDate = new Date(item.reservation.check_out)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        
        const isCheckOutToday = checkOutDate.getTime() === today.getTime()
        const daysSinceCheckIn = checkInDate
          ? Math.floor((today.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))
          : null

        return (
          <div
            key={item.reservation.id}
            className={`flex items-center justify-between p-4 rounded-lg transition-colors border ${
              isCheckOutToday
                ? 'bg-yellow-50 hover:bg-yellow-100 border-yellow-200'
                : 'bg-green-50 hover:bg-green-100 border-green-200'
            }`}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className={`h-5 w-5 flex-shrink-0 ${
                  isCheckOutToday ? 'text-yellow-600' : 'text-green-600'
                }`} />
                <p className="font-semibold text-base text-navy">
                  {item.guest.full_name}
                </p>
                {isCheckOutToday && (
                  <span className="px-2 py-1 text-xs font-medium bg-yellow-200 text-yellow-800 rounded">
                    Sale hoy
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 ml-7">
                <div>
                  <span className="font-medium">Habitación:</span>{' '}
                  <span className="font-semibold">{item.room.name}</span>
                </div>
                <div>
                  <span className="font-medium">Código:</span>{' '}
                  <span className="font-mono">{item.reservation.booking_code}</span>
                </div>
                {checkInDate && (
                  <div>
                    <span className="font-medium">Check-in:</span>{' '}
                    {formatDate(item.reservation.checked_in_at!)}
                    {daysSinceCheckIn !== null && daysSinceCheckIn > 0 && (
                      <span className="text-gray-500">
                        {' '}({daysSinceCheckIn} {daysSinceCheckIn === 1 ? 'día' : 'días'})
                      </span>
                    )}
                  </div>
                )}
                <div>
                  <span className="font-medium">Check-out:</span>{' '}
                  {checkOutDate.toLocaleDateString('es-PE', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </div>
                <div>
                  <span className="font-medium">Huéspedes:</span>{' '}
                  {item.reservation.adults} {item.reservation.adults === 1 ? 'adulto' : 'adultos'}
                  {item.reservation.children > 0 && `, ${item.reservation.children} ${item.reservation.children === 1 ? 'niño' : 'niños'}`}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-4">
              {isCheckOutToday && (
                <Link href={`/admin/recepcion/check-out?code=${item.reservation.booking_code}`}>
                  <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                    <LogOut className="h-4 w-4 mr-2" />
                    Check-out
                  </Button>
                </Link>
              )}
              <Link href={`/admin/recepcion/extender-estancia?code=${item.reservation.booking_code}`}>
                <Button variant="outline" size="sm">
                  <CalendarPlus className="h-4 w-4 mr-2" />
                  Extender
                </Button>
              </Link>
              <Link href={`/admin/reservas/${item.reservation.id}`}>
                <Button variant="ghost" size="sm">
                  Ver Detalles
                </Button>
              </Link>
            </div>
          </div>
        )
      })}
    </div>
  )
}

