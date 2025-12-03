'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Users, Bed, TrendingUp } from 'lucide-react'

interface ReceptionStatsCardsProps {
  stats: {
    checkInsToday: number
    checkOutsToday: number
    activeReservations: number
    totalRooms: number
    occupancyRate: number
  }
}

export default function ReceptionStatsCards({ stats }: ReceptionStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 p-4 sm:p-6">
          <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">
            Check-ins Hoy
          </CardTitle>
          <Calendar className="h-4 w-4 text-gold" />
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="text-2xl sm:text-3xl font-bold text-navy">{stats.checkInsToday}</div>
          <p className="text-xs text-gray-500 mt-1">Reservas que llegan hoy</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 p-4 sm:p-6">
          <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">
            Check-outs Hoy
          </CardTitle>
          <Users className="h-4 w-4 text-gold" />
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="text-2xl sm:text-3xl font-bold text-navy">{stats.checkOutsToday}</div>
          <p className="text-xs text-gray-500 mt-1">Reservas que salen hoy</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 p-4 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">
              Huéspedes Actuales
            </CardTitle>
            <Bed className="h-4 w-4 text-gold" />
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="text-2xl sm:text-3xl font-bold text-navy">
            {stats.activeReservations}
          </div>
          <p className="text-xs text-gray-500 mt-1">Clientes hospedados ahora</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 p-4 sm:p-6">
          <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">
            Ocupación
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-gold" />
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="text-2xl sm:text-3xl font-bold text-navy">
            {stats.occupancyRate}%
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {stats.activeReservations} de {stats.totalRooms} habitaciones
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

