'use client'

import { Button } from '@/components/ui/button'
import { ReservationWithDetails } from '@/lib/queries/reception'
import { Clock, LogIn } from 'lucide-react'
import Link from 'next/link'

interface CheckInsFullListProps {
  checkIns: ReservationWithDetails[]
}

export default function CheckInsFullList({ checkIns }: CheckInsFullListProps) {
  if (checkIns.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <Clock className="h-16 w-16 mx-auto mb-4 text-gray-400" />
        <p className="text-base font-medium">No hay check-ins programados para hoy</p>
        <p className="text-sm text-gray-400 mt-2">Todas las reservas programadas para hoy ya fueron procesadas</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {checkIns.map((item) => (
        <div
          key={item.reservation.id}
          className="flex items-center justify-between p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200"
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-blue-600 flex-shrink-0" />
              <p className="font-semibold text-base text-navy">
                {item.guest.full_name}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 ml-7">
              <div>
                <span className="font-medium">Habitación:</span> {item.room.name}
              </div>
              <div>
                <span className="font-medium">Código:</span>{' '}
                <span className="font-mono">{item.reservation.booking_code}</span>
              </div>
              <div>
                <span className="font-medium">Check-in:</span>{' '}
                {new Date(item.reservation.check_in).toLocaleDateString('es-PE', {
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
            <Link href={`/admin/recepcion/check-in?code=${item.reservation.booking_code}`}>
              <Button size="sm">
                <LogIn className="h-4 w-4 mr-2" />
                Hacer Check-in
              </Button>
            </Link>
            <Link href={`/admin/reservas/${item.reservation.id}`}>
              <Button variant="ghost" size="sm">
                Ver Detalles
              </Button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}

