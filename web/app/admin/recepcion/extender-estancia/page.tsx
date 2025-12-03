'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ReservationSearch } from '@/components/reception/reservation-search'
import { ExtendStayCard } from '@/components/reception/extend-stay-card'
import { PageHeader } from '@/components/reception/page-header'
import { HowItWorks } from '@/components/reception/how-it-works'
import { ReservationWithDetails } from '@/lib/queries/reception'
import { CalendarPlus } from 'lucide-react'
import { toast } from 'sonner'

export default function ExtenderEstanciaPage() {
  const router = useRouter()
  const [selectedReservation, setSelectedReservation] = useState<ReservationWithDetails | null>(null)
  const [loading, setLoading] = useState(false)

  const handleReservationSelect = (reservation: ReservationWithDetails) => {
    // Validar que la reserva esté checked-in
    if (!reservation.reservation.checked_in_at) {
      toast.error(
        'Esta reserva aún no ha sido checkeada. Por favor, primero realice el check-in antes de extender la estancia.'
      )
      return
    }

    // Validar que no haya sido ya checkeada out
    if (reservation.reservation.checked_out_at) {
      toast.error('No se puede extender una estancia que ya fue checkeada out.')
      return
    }

    setSelectedReservation(reservation)
  }

  const handleExtendSuccess = () => {
    toast.success('Estancia extendida exitosamente')
    setSelectedReservation(null)
    router.refresh()
  }

  const howItWorksSteps = [
    'Busca el huésped actual usando el código de reserva, DNI o nombre.',
    'Selecciona la reserva del huésped cuya estancia deseas extender.',
    'Selecciona la nueva fecha de check-out (debe ser posterior a la fecha actual).',
    'El sistema calculará automáticamente el precio adicional y el nuevo total.',
    'Revisa los detalles y confirma la extensión de estancia.',
  ]

  return (
    <div className="space-y-4 sm:space-y-6">
      <PageHeader
        title="Extender Estancia"
        description="Permite extender la estadía de huéspedes que ya hicieron check-in"
        icon={CalendarPlus}
      />

      {!selectedReservation ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Búsqueda de reserva */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl">Buscar Huésped Actual</CardTitle>
              <CardDescription className="text-xs sm:text-sm mt-1">
                Busca por código de reserva, DNI o nombre para encontrar el huésped cuya estancia deseas extender
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <ReservationSearch
                onReservationSelect={handleReservationSelect}
                placeholder="Busca huéspedes actuales para extender su estancia..."
              />
            </CardContent>
          </Card>

          {/* Información de ayuda */}
          <HowItWorks steps={howItWorksSteps} />
        </div>
      ) : (
        <ExtendStayCard reservation={selectedReservation} onSuccess={handleExtendSuccess} />
      )}
    </div>
  )
}

