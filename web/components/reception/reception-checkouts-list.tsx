'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ReservationWithDetails } from '@/lib/queries/reception'
import { LogOut, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

interface ReceptionCheckOutsListProps {
  checkOuts: ReservationWithDetails[]
}

export default function ReceptionCheckOutsList({ checkOuts }: ReceptionCheckOutsListProps) {
  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg sm:text-xl">Check-outs Programados para Hoy</CardTitle>
            <CardDescription className="text-xs sm:text-sm mt-1">
              Reservas que deben hacer check-out hoy ({checkOuts.length})
            </CardDescription>
          </div>
          <Link href="/admin/recepcion/check-outs/list">
            <Button variant="outline" size="sm" className="text-xs sm:text-sm">
              Ver todos
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0">
        {checkOuts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <LogOut className="h-12 w-12 mx-auto mb-3 text-gray-400" />
            <p className="text-sm">No hay check-outs programados para hoy</p>
          </div>
        ) : (
          <div className="space-y-3">
            {checkOuts.slice(0, 5).map((item) => (
              <div
                key={item.reservation.id}
                className="flex items-center justify-between p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors border border-orange-200"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <LogOut className="h-4 w-4 text-orange-600 flex-shrink-0" />
                    <p className="font-medium text-sm sm:text-base text-navy truncate">
                      {item.guest.full_name}
                    </p>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-600">
                    <span className="font-medium">{item.room.name}</span>
                    <span>•</span>
                    <span className="font-mono">Código: {item.reservation.booking_code}</span>
                    {item.reservation.checked_in_at && (
                      <>
                        <span>•</span>
                        <span>
                          Check-in: {formatDate(item.reservation.checked_in_at)}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Link href={`/admin/recepcion/check-out?code=${item.reservation.booking_code}`}>
                    <Button size="sm" variant="default" className="text-xs sm:text-sm bg-orange-600 hover:bg-orange-700">
                      Hacer Check-out
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
            {checkOuts.length > 5 && (
              <div className="text-center pt-2">
                <Link href="/admin/recepcion/check-outs/list">
                  <Button variant="link" size="sm" className="text-xs sm:text-sm">
                    Ver {checkOuts.length - 5} más
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

