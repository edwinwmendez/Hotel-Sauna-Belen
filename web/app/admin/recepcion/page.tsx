import { Suspense } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  LogIn, 
  UserPlus, 
  LogOut, 
  Calendar, 
  Users, 
  Bed, 
  TrendingUp,
  ArrowRight,
  Loader2,
  Clock,
  CheckCircle2
} from 'lucide-react'
import Link from 'next/link'
import { getReceptionStats, getTodayCheckIns, getTodayCheckOuts, getActiveReservations } from '@/lib/queries/reception'
import { formatDate } from '@/lib/utils'
import ReceptionStatsCards from '@/components/reception/reception-stats-cards'
import ReceptionCheckInsList from '@/components/reception/reception-checkins-list'
import ReceptionCheckOutsList from '@/components/reception/reception-checkouts-list'
import ReceptionQuickActions from '@/components/reception/reception-quick-actions'

export default async function RecepcionDashboardPage() {
  // Cargar datos en paralelo
  const [stats, todayCheckIns, todayCheckOuts, activeReservations] = await Promise.all([
    getReceptionStats(),
    getTodayCheckIns(),
    getTodayCheckOuts(),
    getActiveReservations(),
  ])

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-navy mb-2">Recepción</h1>
        <p className="text-sm sm:text-base text-gray-600">Panel de control de recepción del hotel</p>
      </div>

      {/* Stats Cards */}
      <Suspense fallback={
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6 flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-gold" />
              </CardContent>
            </Card>
          ))}
        </div>
      }>
        <ReceptionStatsCards stats={stats} />
      </Suspense>

      {/* Quick Actions */}
      <ReceptionQuickActions />

      {/* Check-ins de Hoy */}
      <Suspense fallback={
        <Card>
          <CardContent className="p-6 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-gold" />
          </CardContent>
        </Card>
      }>
        <ReceptionCheckInsList checkIns={todayCheckIns} />
      </Suspense>

      {/* Check-outs de Hoy */}
      <Suspense fallback={
        <Card>
          <CardContent className="p-6 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-gold" />
          </CardContent>
        </Card>
      }>
        <ReceptionCheckOutsList checkOuts={todayCheckOuts} />
      </Suspense>

      {/* Huéspedes Actuales */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg sm:text-xl">Huéspedes Actuales</CardTitle>
              <CardDescription className="text-xs sm:text-sm mt-1">
                Clientes hospedados actualmente en el hotel ({activeReservations.length})
              </CardDescription>
            </div>
            <Link href="/admin/reservas">
              <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                Ver todas
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          {activeReservations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Bed className="h-12 w-12 mx-auto mb-3 text-gray-400" />
              <p className="text-sm">No hay huéspedes actualmente en el hotel</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeReservations.slice(0, 5).map((item) => (
                <div
                  key={item.reservation.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <p className="font-medium text-sm sm:text-base text-navy truncate">
                        {item.guest.full_name}
                      </p>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-600">
                      <span className="font-medium">{item.room.name}</span>
                      <span>•</span>
                      <span>Código: {item.reservation.booking_code}</span>
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
                  <Link href={`/admin/reservas/${item.reservation.id}`}>
                    <Button variant="ghost" size="sm" className="ml-2">
                      Ver
                    </Button>
                  </Link>
                </div>
              ))}
              {activeReservations.length > 5 && (
                <div className="text-center pt-2">
                  <Link href="/admin/reservas">
                    <Button variant="link" size="sm" className="text-xs sm:text-sm">
                      Ver {activeReservations.length - 5} más
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

