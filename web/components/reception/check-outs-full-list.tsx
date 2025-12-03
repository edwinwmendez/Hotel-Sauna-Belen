'use client'

import { Button } from '@/components/ui/button'
import { ReservationWithDetails } from '@/lib/queries/reception'
import { LogOut } from 'lucide-react'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

interface CheckOutsFullListProps {
  checkOuts: ReservationWithDetails[]
}

export default function CheckOutsFullList({ checkOuts }: CheckOutsFullListProps) {
  if (checkOuts.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <LogOut className="h-16 w-16 mx-auto mb-4 text-gray-400" />
        <p className="text-base font-medium">No hay check-outs programados para hoy</p>
        <p className="text-sm text-gray-400 mt-2">No hay reservas que deban hacer check-out hoy</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {checkOuts.map((item) => (
        <div
          key={item.reservation.id}
          className="flex items-center justify-between p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors border border-orange-200"
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <LogOut className="h-5 w-5 text-orange-600 flex-shrink-0" />
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
                <span className="font-medium">Check-out:</span>{' '}
                {new Date(item.reservation.check_out).toLocaleDateString('es-PE', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </div>
              {item.reservation.checked_in_at && (
                <div>
                  <span className="font-medium">Check-in:</span>{' '}
                  {formatDate(item.reservation.checked_in_at)}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <Link href={`/admin/recepcion/check-out?code=${item.reservation.booking_code}`}>
              <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                <LogOut className="h-4 w-4 mr-2" />
                Hacer Check-out
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

