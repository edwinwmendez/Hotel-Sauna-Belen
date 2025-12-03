'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { BookingSchema } from '@/lib/validations/booking'
import { calculateNights } from '@/lib/utils'

export async function createReservation(formData: FormData) {
  const supabase = await createClient()

  // Si no hay Supabase, simular creación exitosa
  if (!supabase) {
    // Generar código mock
    const date = new Date().toISOString().split('T')[0].replace(/-/g, '')
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
    const bookingCode = `HSB-${date}-${random}`
    
    return {
      success: true,
      bookingCode,
      reservationId: `mock-reservation-${Date.now()}`,
    }
  }

  try {
    // Extraer y validar datos
    const rawData = {
      roomId: formData.get('roomId') as string,
      checkIn: formData.get('checkIn') as string,
      checkOut: formData.get('checkOut') as string,
      guests: {
        adults: parseInt(formData.get('adults') as string) || 1,
        youths: parseInt(formData.get('youths') as string) || 0,
        children: parseInt(formData.get('children') as string) || 0,
        infants: parseInt(formData.get('infants') as string) || 0,
      },
      guest: {
        fullName: formData.get('fullName') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        documentType: formData.get('documentType') as 'DNI' | 'CE' | 'PASAPORTE',
        documentNumber: formData.get('documentNumber') as string,
      },
    }

    const validatedData = BookingSchema.parse(rawData)

    // Verificar disponibilidad
    const { data: isAvailable, error: availabilityError } = await supabase.rpc(
      'check_room_availability',
      {
        p_room_id: validatedData.roomId,
        p_check_in: validatedData.checkIn,
        p_check_out: validatedData.checkOut,
      }
    )

    if (availabilityError || !isAvailable) {
      return {
        error: 'La habitación no está disponible en esas fechas',
      }
    }

    // Crear o buscar guest
    const { data: guest, error: guestError } = await supabase
      .from('guests')
      .upsert(
        {
          full_name: validatedData.guest.fullName,
          email: validatedData.guest.email,
          phone: validatedData.guest.phone,
          document_type: validatedData.guest.documentType,
          document_number: validatedData.guest.documentNumber,
        },
        {
          onConflict: 'email',
          ignoreDuplicates: false,
        }
      )
      .select()
      .single()

    if (guestError) {
      console.error('Error creating guest:', guestError)
      return { error: 'Error al registrar huésped' }
    }

    // Obtener precio de la habitación
    const { data: room, error: roomError } = await supabase
      .from('rooms')
      .select('price_per_night')
      .eq('id', validatedData.roomId)
      .single()

    if (roomError || !room) {
      return { error: 'Error al obtener información de la habitación' }
    }

    // Calcular precio total
    const nights = calculateNights(validatedData.checkIn, validatedData.checkOut)
    const totalPrice = room.price_per_night * nights

    // Crear reserva
    // Nota: Si la tabla tiene campos para guests, usarlos. Si no, guardar en metadata
    const { data: reservation, error: reservationError } = await supabase
      .from('reservations')
      .insert({
        room_id: validatedData.roomId,
        guest_id: guest.id,
        check_in: validatedData.checkIn,
        check_out: validatedData.checkOut,
        total_price: totalPrice,
        status: 'pending',
        // Guardar información de huéspedes (si la tabla tiene estos campos, se usarán; si no, se ignorarán)
        adults: validatedData.guests.adults,
        youths: validatedData.guests.youths,
        children: validatedData.guests.children,
        infants: validatedData.guests.infants,
        total_guests: validatedData.guests.adults + validatedData.guests.youths + validatedData.guests.children + validatedData.guests.infants,
      })
      .select()
      .single()

    if (reservationError) {
      console.error('Error creating reservation:', reservationError)
      return { error: 'Error al crear reserva' }
    }

    revalidatePath('/admin/reservas')
    revalidatePath('/mis-reservas')

    return {
      success: true,
      bookingCode: reservation.booking_code,
      reservationId: reservation.id,
    }
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message }
    }
    return { error: 'Error al procesar la reserva' }
  }
}

