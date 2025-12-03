'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ReservationWithDetails } from '@/lib/queries/reception'
import { Clock, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

interface ReceptionCheckInsListProps {
  checkIns: ReservationWithDetails[]
}

export default function ReceptionCheckInsList({ checkIns }: ReceptionCheckInsListProps) {
  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg sm:text-xl">Check-ins Programados para Hoy</CardTitle>
            <CardDescription className="text-xs sm:text-sm mt-1">
              Reservas que deben hacer check-in hoy ({checkIns.length})
            </CardDescription>
          </div>
          <Link href="/admin/recepcion/check-ins/list">
            <Button variant="outline" size="sm" className="text-xs sm:text-sm">
              Ver todos
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0">
        {checkIns.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Clock className="h-12 w-12 mx-auto mb-3 text-gray-400" />
            <p className="text-sm">No hay check-ins programados para hoy</p>
          </div>
        ) : (
          <div className="space-y-3">
            {checkIns.slice(0, 5).map((item) => (
              <div
                key={item.reservation.id}
                className="flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-600 flex-shrink-0" />
                    <p className="font-medium text-sm sm:text-base text-navy truncate">
                      {item.guest.full_name}
                    </p>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-600">
                    <span className="font-medium">{item.room.name}</span>
                    <span>•</span>
                    <span className="font-mono">Código: {item.reservation.booking_code}</span>
                    <span>•</span>
                    <span>
                      {item.reservation.adults} {item.reservation.adults === 1 ? 'adulto' : 'adultos'}
                      {item.reservation.children > 0 && `, ${item.reservation.children} ${item.reservation.children === 1 ? 'niño' : 'niños'}`}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Link href={`/admin/recepcion/check-in?code=${item.reservation.booking_code}`}>
                    <Button size="sm" className="text-xs sm:text-sm">
                      Hacer Check-in
                    </Button>
                  </Link>
                  <Link href={`/admin/reservas/${item.reservation.id}`}>
                    <Button variant="ghost" size="sm">
                      Ver
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
            {checkIns.length > 5 && (
              <div className="text-center pt-2">
                <Link href="/admin/recepcion/check-ins/list">
                  <Button variant="link" size="sm" className="text-xs sm:text-sm">
                    Ver {checkIns.length - 5} más
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

