'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ReservationSearch } from '@/components/reception/reservation-search'
import { CheckoutDetailCard } from '@/components/reception/checkout-detail-card'
import { PageHeader } from '@/components/reception/page-header'
import { HowItWorks } from '@/components/reception/how-it-works'
import { performCheckOut } from '@/lib/actions/reception'
import { ReservationWithDetails } from '@/lib/queries/reception'
import { toast } from 'sonner'
import { LogOut } from 'lucide-react'

export default function CheckoutPage() {
  const router = useRouter()
  const [reservation, setReservation] = useState<ReservationWithDetails | null>(null)
  const [checkingOut, setCheckingOut] = useState(false)

  const handleReservationSelect = (selectedReservation: ReservationWithDetails) => {
    // Validar que la reserva esté checked-in
    if (!selectedReservation.reservation.checked_in_at) {
      toast.error('Esta reserva aún no ha sido checkeada. Por favor, primero realice el check-in.')
      return
    }

    // Validar que no haya sido ya checkeada out
    if (selectedReservation.reservation.checked_out_at) {
      toast.error('Esta reserva ya fue checkeada out anteriormente.')
      return
    }

    setReservation(selectedReservation)
  }

  const handleCheckout = async (additionalCharges: number, notes?: string) => {
    if (!reservation) return

    setCheckingOut(true)

    try {
      const result = await performCheckOut(reservation.reservation.id, additionalCharges, notes)

      if (result.error || !result.success) {
        toast.error(result.error || 'Error al realizar el check-out')
        return
      }

      toast.success(`Check-out realizado exitosamente. Total: S/ ${result.total?.toFixed(2) || '0.00'}`)
      
      // Redirigir al dashboard de recepción después de un breve delay
      setTimeout(() => {
        router.push('/admin/recepcion')
      }, 2000)
    } catch (error) {
      console.error('Error realizando check-out:', error)
      toast.error('Error al procesar el check-out')
    } finally {
      setCheckingOut(false)
    }
  }

  const howItWorksSteps = [
    'Busca el huésped usando el código de reserva, DNI del cliente o nombre.',
    'Selecciona la reserva de los resultados mostrados.',
    'Revisa los detalles y agrega servicios adicionales si es necesario.',
    'Revisa el total final y haz clic en "Realizar Check-out".',
    'El sistema registrará la fecha y hora del check-out automáticamente y liberará la habitación.',
  ]

  return (
    <div className="space-y-4 sm:space-y-6">
      <PageHeader
        title="Check-out"
        description="Registrar la salida de huéspedes y calcular el total final"
        icon={LogOut}
      />

      {/* Búsqueda de reserva */}
      {!reservation && (
        <>
          <ReservationSearch
            onReservationSelect={handleReservationSelect}
            searchType="code"
            onlyActive={true}
            placeholder="Busca huéspedes actuales para check-out..."
          />

          {/* Información de ayuda */}
          <HowItWorks steps={howItWorksSteps} />
        </>
      )}

      {/* Detalle de reserva y formulario de check-out */}
      {reservation && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => {
                setReservation(null)
              }}
            >
              Buscar otra reserva
            </Button>
          </div>

          <CheckoutDetailCard
            reservation={reservation}
            onCheckout={handleCheckout}
            disabled={checkingOut}
          />
        </div>
      )}
    </div>
  )
}

