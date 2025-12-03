'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { ProgressBar } from '@/components/booking/progress-bar'
import { StepDates } from '@/components/booking/step-dates'
import { StepRoom } from '@/components/booking/step-room'
import { StepGuest } from '@/components/booking/step-guest'
import { StepSummary } from '@/components/booking/step-summary'
import { fetchRoomById } from '@/lib/actions/rooms'
import { BookingFormData } from '@/lib/validations/booking'
import { Database } from '@/lib/supabase/types'

type Room = Database['public']['Tables']['rooms']['Row']

const STEPS = ['Fechas', 'Habitación', 'Datos', 'Confirmación']

function ReservarPageContent() {
  const searchParams = useSearchParams()
  
  // Leer parámetros de URL del widget de búsqueda
  const urlCheckIn = searchParams.get('checkIn')
  const urlCheckOut = searchParams.get('checkOut')
  const urlAdults = searchParams.get('adults')
  const urlYouths = searchParams.get('youths')
  const urlChildren = searchParams.get('children')
  const urlInfants = searchParams.get('infants')

  const [currentStep, setCurrentStep] = useState(1)
  const [checkIn, setCheckIn] = useState<string | null>(urlCheckIn)
  const [checkOut, setCheckOut] = useState<string | null>(urlCheckOut)
  const [guests, setGuests] = useState<BookingFormData['guests']>({
    adults: urlAdults ? parseInt(urlAdults) : 1,
    youths: urlYouths ? parseInt(urlYouths) : 0,
    children: urlChildren ? parseInt(urlChildren) : 0,
    infants: urlInfants ? parseInt(urlInfants) : 0,
  })
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null)
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [guestData, setGuestData] = useState<Partial<BookingFormData['guest']> | null>(null)
  const [createAccount, setCreateAccount] = useState(false)

  // Cargar habitación cuando se selecciona
  useEffect(() => {
    if (selectedRoomId && !selectedRoom) {
      fetchRoomById(selectedRoomId).then((result) => {
        if (result.success && result.room) {
          setSelectedRoom(result.room)
        }
      })
    }
  }, [selectedRoomId, selectedRoom])

  const handleDatesChange = (newCheckIn: string, newCheckOut: string) => {
    setCheckIn(newCheckIn)
    setCheckOut(newCheckOut)
  }

  const handleGuestsChange = (newGuests: BookingFormData['guests']) => {
    setGuests(newGuests)
  }

  const handleRoomSelect = (roomId: string) => {
    setSelectedRoomId(roomId)
    // Cargar datos de la habitación
    // Por ahora usamos el room que ya tenemos o necesitamos cargarlo
  }

  const handleGuestDataChange = (data: BookingFormData['guest'], createAcc: boolean) => {
    setGuestData(data)
    setCreateAccount(createAcc)
  }

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Cargar datos completos de la habitación cuando se selecciona
  useEffect(() => {
    if (selectedRoomId && !selectedRoom) {
      // Necesitamos una función para obtener room por ID
      // Por ahora, si tenemos el slug, ya lo tenemos cargado
    }
  }, [selectedRoomId, selectedRoom])

  return (
    <div className="py-6 sm:py-8 md:py-12 bg-gray-50 min-h-screen">
      <div className="container max-w-4xl px-4">
        <ProgressBar currentStep={currentStep} totalSteps={STEPS.length} steps={STEPS} />

        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8">
          {currentStep === 1 && (
            <StepDates
              checkIn={checkIn}
              checkOut={checkOut}
              guests={guests}
              onDatesChange={handleDatesChange}
              onGuestsChange={handleGuestsChange}
              onNext={handleNext}
            />
          )}

          {currentStep === 2 && checkIn && checkOut && (
            <StepRoom
              checkIn={checkIn}
              checkOut={checkOut}
              guests={guests}
              selectedRoomId={selectedRoomId}
              onRoomSelect={handleRoomSelect}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {currentStep === 3 && selectedRoomId && (
            <StepGuest
              guestData={guestData}
              onCreateAccount={createAccount}
              onGuestDataChange={handleGuestDataChange}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {currentStep === 4 && selectedRoom && checkIn && checkOut && guestData && (
            <StepSummary
              room={selectedRoom}
              checkIn={checkIn}
              checkOut={checkOut}
              guests={guests}
              guest={guestData as BookingFormData['guest']}
              onBack={handleBack}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default function ReservarPage() {
  return (
    <Suspense fallback={
      <div className="py-6 sm:py-8 md:py-12 bg-gray-50 min-h-screen">
        <div className="container max-w-4xl px-4">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <p className="text-gray-600">Cargando...</p>
          </div>
        </div>
      </div>
    }>
      <ReservarPageContent />
    </Suspense>
  )
}

