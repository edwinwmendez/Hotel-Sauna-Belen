'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { GuestSearch } from '@/components/reception/guest-search'
import { RoomSelectorReception } from '@/components/reception/room-selector-reception'
import { createWalkInReservation } from '@/lib/actions/reception'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { GuestsSelector } from '@/components/home/guests-selector'
import { formatCurrency, calculateNights } from '@/lib/utils'
import { format, addDays } from 'date-fns'
import { UserPlus, Calendar, Home, Users, Loader2, CheckCircle } from 'lucide-react'
import { PageHeader } from '@/components/reception/page-header'
import Link from 'next/link'
import { toast } from 'sonner'
import type { Database } from '@/lib/supabase/types'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { BookingSchema, type BookingFormData } from '@/lib/validations/booking'
import { DOCUMENT_TYPES } from '@/lib/constants'
type Guest = Database['public']['Tables']['guests']['Row']
type Room = Database['public']['Tables']['rooms']['Row']

type WalkInStep = 'dates' | 'guest' | 'room' | 'summary'

export default function WalkInPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<WalkInStep>('dates')
  const [loading, setLoading] = useState(false)

  // Estado del flujo
  const [checkIn, setCheckIn] = useState<string>('')
  const [checkOut, setCheckOut] = useState<string>('')
  const [guests, setGuests] = useState({ adults: 1, youths: 0, children: 0, infants: 0 })
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null)
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null)
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [guestFound, setGuestFound] = useState(false)

  // Formulario para cliente nuevo
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<BookingFormData['guest']>({
    resolver: zodResolver(BookingSchema.shape.guest),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      documentType: 'DNI',
      documentNumber: '',
    },
  })

  // Auto-completar formulario si se encuentra cliente
  const handleGuestFound = (guest: Guest) => {
    setSelectedGuest(guest)
    setGuestFound(true)
    setValue('fullName', guest.full_name)
    setValue('email', guest.email)
    setValue('phone', guest.phone)
    setValue('documentType', guest.document_type)
    setValue('documentNumber', guest.document_number)
  }

  // Manejar selección de habitación
  const handleRoomSelect = (room: Room) => {
    setSelectedRoomId(room.id)
    setSelectedRoom(room)
  }

  // Estado local para fechas (para manejar cambios en tiempo real)
  const [localCheckIn, setLocalCheckIn] = useState(checkIn)
  const [localCheckOut, setLocalCheckOut] = useState(checkOut)

  // Sincronizar estados locales con estados principales
  useEffect(() => {
    setLocalCheckIn(checkIn)
    setLocalCheckOut(checkOut)
  }, [checkIn, checkOut])

  const handleCheckInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setLocalCheckIn(value)
    
    // Si cambia check-in y check-out ya no es válido, limpiarlo
    if (value && localCheckOut && value >= localCheckOut) {
      setLocalCheckOut('')
    }
  }

  const handleCheckOutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setLocalCheckOut(value)
  }

  // Paso 1: Fechas y huéspedes
  const handleDatesSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!localCheckIn || !localCheckOut) {
      toast.error('Por favor, selecciona ambas fechas')
      return
    }

    if (localCheckOut <= localCheckIn) {
      toast.error('La fecha de salida debe ser posterior a la fecha de llegada')
      return
    }

    setCheckIn(localCheckIn)
    setCheckOut(localCheckOut)
    setCurrentStep('guest')
  }

  // Paso 2: Cliente
  const handleGuestNext = () => {
    if (guestFound && selectedGuest) {
      setCurrentStep('room')
    } else {
      // Validar formulario de cliente nuevo
      const formData = watch()
      if (!formData.fullName || !formData.email || !formData.phone || !formData.documentNumber) {
        toast.error('Por favor, completa todos los campos del cliente')
        return
      }
      setCurrentStep('room')
    }
  }

  // Paso 3: Habitación
  const handleRoomNext = () => {
    if (!selectedRoomId) {
      toast.error('Por favor, selecciona una habitación')
      return
    }
    setCurrentStep('summary')
  }

  // Paso 4: Confirmación y creación
  const handleCreateReservation = async () => {
    if (!selectedRoomId || !checkIn || !checkOut) {
      toast.error('Faltan datos para crear la reserva')
      return
    }

    setLoading(true)

    try {
      const formData = new FormData()

      // Datos de habitación y fechas
      formData.append('roomId', selectedRoomId)
      formData.append('checkIn', checkIn)
      formData.append('checkOut', checkOut)
      formData.append('adults', guests.adults.toString())
      formData.append('youths', guests.youths.toString())
      formData.append('children', guests.children.toString())
      formData.append('infants', guests.infants.toString())

      // Datos del cliente
      if (guestFound && selectedGuest) {
        formData.append('fullName', selectedGuest.full_name)
        formData.append('email', selectedGuest.email)
        formData.append('phone', selectedGuest.phone)
        formData.append('documentType', selectedGuest.document_type)
        formData.append('documentNumber', selectedGuest.document_number)
      } else {
        const guestData = watch()
        formData.append('fullName', guestData.fullName)
        formData.append('email', guestData.email)
        formData.append('phone', guestData.phone)
        formData.append('documentType', guestData.documentType)
        formData.append('documentNumber', guestData.documentNumber)
      }

      // Auto check-in para walk-in
      formData.append('performCheckIn', 'true')

      const result = await createWalkInReservation(formData)

      if (!result.success) {
        toast.error(result.error || 'Error al crear la reserva walk-in')
        return
      }

      toast.success(`Reserva creada exitosamente. Código: ${result.bookingCode}`)

      // Redirigir después de un breve delay
      setTimeout(() => {
        router.push('/admin/recepcion')
      }, 2000)
    } catch (error) {
      console.error('Error creando reserva walk-in:', error)
      toast.error('Error inesperado al crear la reserva')
    } finally {
      setLoading(false)
    }
  }

  const today = format(new Date(), 'yyyy-MM-dd')
  const nights = localCheckIn && localCheckOut ? calculateNights(localCheckIn, localCheckOut) : (checkIn && checkOut ? calculateNights(checkIn, checkOut) : 0)
  const totalPrice = selectedRoom && nights > 0 ? selectedRoom.price_per_night * nights : 0

  return (
    <div className="space-y-4 sm:space-y-6">
      <PageHeader
        title="Registro Walk-in"
        description="Registra un cliente sin reserva previa y realiza el check-in"
        icon={UserPlus}
      />

      {/* Indicador de pasos */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            {(['dates', 'guest', 'room', 'summary'] as WalkInStep[]).map((step, index) => {
              const stepNames = {
                dates: 'Fechas',
                guest: 'Cliente',
                room: 'Habitación',
                summary: 'Confirmar',
              }
              const stepIcons = {
                dates: Calendar,
                guest: Users,
                room: Home,
                summary: CheckCircle,
              }
              const Icon = stepIcons[step]
              const isActive = currentStep === step
              const isCompleted = ['dates', 'guest', 'room', 'summary'].indexOf(currentStep) > index

              return (
                <div key={step} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                        isActive
                          ? 'bg-navy text-white'
                          : isCompleted
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <span
                      className={`mt-2 text-xs sm:text-sm font-medium ${
                        isActive ? 'text-navy' : 'text-gray-600'
                      }`}
                    >
                      {stepNames[step]}
                    </span>
                  </div>
                  {index < 3 && (
                    <div
                      className={`h-0.5 flex-1 mx-2 ${
                        isCompleted ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Paso 1: Fechas y huéspedes */}
      {currentStep === 'dates' && (
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Fechas y Huéspedes</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Selecciona las fechas de estadía y número de huéspedes
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <form onSubmit={handleDatesSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="checkIn" className="text-sm font-medium text-gray-700">
                    Check-in *
                  </label>
                  <Input
                    id="checkIn"
                    name="checkIn"
                    type="date"
                    min={today}
                    required
                    value={localCheckIn}
                    onChange={handleCheckInChange}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="checkOut" className="text-sm font-medium text-gray-700">
                    Check-out *
                  </label>
                  <Input
                    id="checkOut"
                    name="checkOut"
                    type="date"
                    min={localCheckIn ? format(addDays(new Date(localCheckIn), 1), 'yyyy-MM-dd') : today}
                    disabled={!localCheckIn}
                    required
                    value={localCheckOut}
                    onChange={handleCheckOutChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Huéspedes *</label>
                <GuestsSelector
                  adults={guests.adults}
                  youths={guests.youths}
                  children={guests.children}
                  infants={guests.infants}
                  onChange={setGuests}
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" asChild>
                  <Link href="/admin/recepcion">Cancelar</Link>
                </Button>
                <Button type="submit">Continuar →</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Paso 2: Cliente */}
      {currentStep === 'guest' && (
        <div className="space-y-4">
          <GuestSearch
            onGuestFound={handleGuestFound}
            defaultDocumentType="DNI"
            showHistory={true}
          />

          {!guestFound && (
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">Registrar Cliente Nuevo</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Ingresa los datos del cliente que se hospedará
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <form className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                      Nombre completo *
                    </label>
                    <Input
                      id="fullName"
                      {...register('fullName')}
                      placeholder="Juan Pérez García"
                      className={errors.fullName ? 'border-red-500' : ''}
                    />
                    {errors.fullName && (
                      <p className="text-sm text-red-600">{errors.fullName.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Email *
                      </label>
                      <Input
                        id="email"
                        type="email"
                        {...register('email')}
                        placeholder="tu@email.com"
                        className={errors.email ? 'border-red-500' : ''}
                      />
                      {errors.email && (
                        <p className="text-sm text-red-600">{errors.email.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-medium text-gray-700">
                        Teléfono *
                      </label>
                      <Input
                        id="phone"
                        type="tel"
                        {...register('phone')}
                        placeholder="987654321"
                        className={errors.phone ? 'border-red-500' : ''}
                      />
                      {errors.phone && (
                        <p className="text-sm text-red-600">{errors.phone.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="documentType" className="text-sm font-medium text-gray-700">
                        Tipo de documento
                      </label>
                      <select
                        id="documentType"
                        {...register('documentType')}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        {DOCUMENT_TYPES.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="documentNumber" className="text-sm font-medium text-gray-700">
                        Número de documento *
                      </label>
                      <Input
                        id="documentNumber"
                        {...register('documentNumber')}
                        placeholder="12345678"
                        className={errors.documentNumber ? 'border-red-500' : ''}
                      />
                      {errors.documentNumber && (
                        <p className="text-sm text-red-600">{errors.documentNumber.message}</p>
                      )}
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setCurrentStep('dates')}>
              ← Atrás
            </Button>
            <Button onClick={handleGuestNext}>
              Continuar →
            </Button>
          </div>
        </div>
      )}

      {/* Paso 3: Habitación */}
      {currentStep === 'room' && checkIn && checkOut && (
        <div className="space-y-4">
          <RoomSelectorReception
            checkIn={checkIn}
            checkOut={checkOut}
            guests={guests}
            onRoomSelect={handleRoomSelect}
            selectedRoomId={selectedRoomId}
          />

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setCurrentStep('guest')}>
              ← Atrás
            </Button>
            <Button onClick={handleRoomNext} disabled={!selectedRoomId}>
              Continuar →
            </Button>
          </div>
        </div>
      )}

      {/* Paso 4: Resumen y confirmación */}
      {currentStep === 'summary' && selectedRoom && (
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Resumen de la Reserva</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Revisa los detalles antes de confirmar
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 space-y-6">
            {/* Información del cliente */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Cliente</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <p className="font-medium">{selectedGuest?.full_name || watch('fullName')}</p>
                <p className="text-sm text-gray-600">{selectedGuest?.email || watch('email')}</p>
                <p className="text-sm text-gray-600">{selectedGuest?.phone || watch('phone')}</p>
                <p className="text-sm text-gray-600">
                  {(selectedGuest?.document_type || watch('documentType'))}:{' '}
                  {selectedGuest?.document_number || watch('documentNumber')}
                </p>
              </div>
            </div>

            {/* Información de la reserva */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Reserva</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <p>
                  <strong>Habitación:</strong> {selectedRoom.name}
                </p>
                <p>
                  <strong>Check-in:</strong> {format(new Date(checkIn), 'dd/MM/yyyy')}
                </p>
                <p>
                  <strong>Check-out:</strong> {format(new Date(checkOut), 'dd/MM/yyyy')}
                </p>
                <p>
                  <strong>Noches:</strong> {nights}
                </p>
                <p>
                  <strong>Huéspedes:</strong> {guests.adults} adulto{guests.adults > 1 ? 's' : ''}
                  {guests.youths > 0 && `, ${guests.youths} joven${guests.youths > 1 ? 'es' : ''}`}
                  {guests.children > 0 && `, ${guests.children} niño${guests.children > 1 ? 's' : ''}`}
                  {guests.infants > 0 && `, ${guests.infants} bebé${guests.infants > 1 ? 's' : ''}`}
                </p>
              </div>
            </div>

            {/* Total */}
            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-gray-900">Total a pagar:</span>
                <span className="text-2xl font-bold text-navy">{formatCurrency(totalPrice)}</span>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Nota:</strong> Se realizará el check-in automáticamente al crear la reserva.
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setCurrentStep('room')}>
                ← Atrás
              </Button>
              <Button onClick={handleCreateReservation} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creando reserva...
                  </>
                ) : (
                  'Confirmar y Crear Reserva'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

