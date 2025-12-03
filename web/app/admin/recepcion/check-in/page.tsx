'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ReservationSearch } from '@/components/reception/reservation-search'
import { ReservationDetailCard } from '@/components/reception/reservation-detail-card'
import { PageHeader } from '@/components/reception/page-header'
import { HowItWorks } from '@/components/reception/how-it-works'
import { performCheckIn } from '@/lib/actions/reception'
import { ReservationWithDetails } from '@/lib/queries/reception'
import { Card, CardContent } from '@/components/ui/card'
import { LogIn, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function CheckInPage() {
  const router = useRouter()
  const [selectedReservation, setSelectedReservation] = useState<ReservationWithDetails | null>(null)
  const [loading, setLoading] = useState(false)
  const [checkingIn, setCheckingIn] = useState(false)

  const handleReservationSelect = (reservation: ReservationWithDetails) => {
    setSelectedReservation(reservation)
  }

  const handleCheckIn = async () => {
    if (!selectedReservation) return

    setCheckingIn(true)

    try {
      const result = await performCheckIn(selectedReservation.reservation.id)

      if (!result.success) {
        toast.error(result.error || 'Error al realizar el check-in')
        return
      }

      toast.success('Check-in realizado exitosamente')
      
      // Redirigir después de un breve delay para que el usuario vea el mensaje
      setTimeout(() => {
        router.push('/admin/recepcion')
      }, 1500)
    } catch (error) {
      console.error('Error en check-in:', error)
      toast.error('Error inesperado al realizar el check-in')
    } finally {
      setCheckingIn(false)
    }
  }

  const canPerformCheckIn = () => {
    if (!selectedReservation) return false
    
    const { reservation } = selectedReservation
    
    // No se puede hacer check-in si ya está checkeada
    if (reservation.checked_in_at) return false
    
    // Solo se puede hacer check-in de reservas confirmadas o pendientes
    if (!['confirmed', 'pending'].includes(reservation.status)) return false
    
    return true
  }

  const howItWorksSteps = [
    'Busca la reserva usando el código de reserva, DNI del cliente o nombre.',
    'Selecciona la reserva de los resultados mostrados.',
    'Revisa los detalles de la reserva y haz clic en "Realizar Check-in".',
    'El sistema registrará la fecha y hora del check-in automáticamente.',
  ]

  return (
    <div className="space-y-4 sm:space-y-6">
      <PageHeader
        title="Check-in de Reservas"
        description="Busca una reserva y realiza el check-in del huésped"
        icon={LogIn}
      />

      {/* Búsqueda de reserva */}
      <ReservationSearch
        onReservationSelect={handleReservationSelect}
        searchType="code"
        onlyActive={false}
      />

      {/* Detalle de reserva seleccionada */}
      {selectedReservation && (
        <div className="space-y-4">
          <ReservationDetailCard
            reservation={selectedReservation}
            onAction={handleCheckIn}
            actionLabel={
              checkingIn ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Realizando Check-in...
                </>
              ) : (
                'Realizar Check-in'
              )
            }
            actionVariant="default"
            showFullDetails={true}
            disabled={!canPerformCheckIn() || checkingIn}
          />

          {/* Mensajes informativos */}
          {!canPerformCheckIn() && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <p className="text-sm sm:text-base font-medium text-yellow-900">
                      No se puede realizar el check-in
                    </p>
                    <p className="text-xs sm:text-sm text-yellow-700 mt-1">
                      {selectedReservation.reservation.checked_in_at
                        ? 'Esta reserva ya tiene un check-in registrado.'
                        : selectedReservation.reservation.status === 'cancelled'
                          ? 'Esta reserva está cancelada.'
                          : selectedReservation.reservation.status === 'completed'
                            ? 'Esta reserva ya fue completada.'
                            : 'Esta reserva no está en un estado válido para check-in.'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Información de ayuda */}
      {!selectedReservation && <HowItWorks steps={howItWorksSteps} />}
    </div>
  )
}

