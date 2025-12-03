'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { CheckInSchema, CheckOutSchema } from '@/lib/validations/reception'
import { ReservationWithDetails } from '@/lib/queries/reception'
import { Database } from '@/lib/supabase/types'

/**
 * Realiza el check-in de una reserva
 * Marca la habitación como ocupada y registra la fecha/hora de check-in
 */
export async function performCheckIn(
  reservationId: string,
  notes?: string
): Promise<{ success: boolean; error?: string; reservation?: ReservationWithDetails }> {
  const supabase = await createClient()

  if (!supabase) {
    return {
      success: false,
      error: 'Sistema no configurado',
    }
  }

  try {
    // Validar datos
    CheckInSchema.parse({ reservationId, notes })

    // Obtener la reserva actual
    const { data: reservation, error: reservationError } = await supabase
      .from('reservations')
      .select(`
        *,
        guest:guests(*),
        room:rooms(*)
      `)
      .eq('id', reservationId)
      .single()

    if (reservationError || !reservation) {
      return {
        success: false,
        error: 'Reserva no encontrada',
      }
    }

    // Validar que la reserva esté en estado válido para check-in
    if (!['pending', 'confirmed'].includes(reservation.status)) {
      return {
        success: false,
        error: `No se puede hacer check-in de una reserva con estado: ${reservation.status}`,
      }
    }

    // Validar que no haya sido ya checkeada
    if (reservation.checked_in_at) {
      return {
        success: false,
        error: 'Esta reserva ya fue checkeada anteriormente',
      }
    }

    // Verificar que la habitación no esté ocupada por otro huésped actual
    const { data: conflictingReservation } = await supabase
      .from('reservations')
      .select('id')
      .eq('room_id', reservation.room_id)
      .not('checked_in_at', 'is', null)
      .is('checked_out_at', null)
      .neq('id', reservationId)
      .maybeSingle()

    if (conflictingReservation) {
      return {
        success: false,
        error: 'La habitación ya está ocupada por otra reserva',
      }
    }

    const now = new Date().toISOString()

    // Actualizar la reserva con check-in
    const { data: updatedReservation, error: updateError } = await supabase
      .from('reservations')
      .update({
        checked_in_at: now,
        // Opcional: cambiar estado a 'checked-in' si queremos tener ese estado explícito
        // Por ahora mantenemos 'confirmed' y usamos checked_in_at para saber si está en curso
        updated_at: now,
      })
      .eq('id', reservationId)
      .select(`
        *,
        guest:guests(*),
        room:rooms(*)
      `)
      .single()

    if (updateError || !updatedReservation) {
      console.error('Error actualizando reserva para check-in:', updateError)
      return {
        success: false,
        error: 'Error al realizar el check-in',
      }
    }

    // Crear registro en tabla check_ins para auditoría (opcional, si la tabla existe)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      await supabase
        .from('check_ins')
        .insert({
          reservation_id: reservationId,
          checked_in_at: now,
          checked_in_by: user?.id || null,
          notes: notes || null,
        })
        .select()
        .single()
    } catch (checkInTableError) {
      // Si la tabla check_ins no existe o hay error, no es crítico, solo loguear
      console.warn('No se pudo crear registro en check_ins (tabla puede no existir):', checkInTableError)
    }

    revalidatePath('/admin/recepcion')
    revalidatePath('/admin/reservas')
    revalidatePath(`/admin/reservas/${reservationId}`)

    return {
      success: true,
      reservation: {
        reservation: updatedReservation as typeof reservation,
        guest: (updatedReservation as unknown as { guest: typeof reservation.guest }).guest,
        room: (updatedReservation as unknown as { room: typeof reservation.room }).room,
      },
    }
  } catch (error) {
    console.error('Error en performCheckIn:', error)
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'Error al procesar el check-in' }
  }
}

/**
 * Realiza el check-out de una reserva
 * Marca la habitación como disponible y registra la fecha/hora de check-out
 */
export async function performCheckOut(
  reservationId: string,
  additionalCharges: number = 0,
  notes?: string
): Promise<{ success: boolean; error?: string; total?: number }> {
  const supabase = await createClient()

  if (!supabase) {
    return {
      success: false,
      error: 'Sistema no configurado',
    }
  }

  try {
    // Validar datos
    CheckOutSchema.parse({ reservationId, additionalCharges, notes })

    // Obtener la reserva actual
    const { data: reservation, error: reservationError } = await supabase
      .from('reservations')
      .select('*')
      .eq('id', reservationId)
      .single()

    if (reservationError || !reservation) {
      return {
        success: false,
        error: 'Reserva no encontrada',
      }
    }

    // Validar que la reserva esté checked-in
    if (!reservation.checked_in_at) {
      return {
        success: false,
        error: 'Esta reserva aún no ha sido checkeada',
      }
    }

    // Validar que no haya sido ya checkeada out
    if (reservation.checked_out_at) {
      return {
        success: false,
        error: 'Esta reserva ya fue checkeada out anteriormente',
      }
    }

    // Calcular total final
    const totalFinal = Number(reservation.total_price) + Number(additionalCharges)

    const now = new Date().toISOString()

    // Actualizar la reserva con check-out
    const { data: updatedReservation, error: updateError } = await supabase
      .from('reservations')
      .update({
        checked_out_at: now,
        status: 'completed',
        updated_at: now,
      })
      .eq('id', reservationId)
      .select()
      .single()

    if (updateError || !updatedReservation) {
      console.error('Error actualizando reserva para check-out:', updateError)
      return {
        success: false,
        error: 'Error al realizar el check-out',
      }
    }

    // Actualizar registro en tabla check_ins para auditoría (opcional)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      await supabase
        .from('check_ins')
        .update({
          checked_out_at: now,
          checked_out_by: user?.id || null,
          additional_charges: additionalCharges,
          notes: notes || null,
          updated_at: now,
        })
        .eq('reservation_id', reservationId)
        .is('checked_out_at', null) // Solo actualizar si aún no tiene check-out
        .select()
        .single()
    } catch (checkInTableError) {
      // Si la tabla check_ins no existe o hay error, no es crítico
      console.warn('No se pudo actualizar registro en check_ins:', checkInTableError)
    }

    revalidatePath('/admin/recepcion')
    revalidatePath('/admin/reservas')
    revalidatePath(`/admin/reservas/${reservationId}`)

    return {
      success: true,
      total: totalFinal,
    }
  } catch (error) {
    console.error('Error en performCheckOut:', error)
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'Error al procesar el check-out' }
  }
}

/**
 * Busca una reserva por código de reserva
 */
export async function searchReservationByCode(
  bookingCode: string
): Promise<{ reservation: ReservationWithDetails | null; error?: string }> {
  const supabase = await createClient()

  if (!supabase) {
    return {
      reservation: null,
      error: 'Sistema no configurado',
    }
  }

  try {
    const { data, error } = await supabase
      .from('reservations')
      .select(`
        *,
        guest:guests(*),
        room:rooms(*)
      `)
      .eq('booking_code', bookingCode.toUpperCase())
      .maybeSingle()

    if (error) {
      console.error('Error buscando reserva por código:', error)
      return {
        reservation: null,
        error: 'Error al buscar la reserva',
      }
    }

    if (!data) {
      return {
        reservation: null,
        error: 'Reserva no encontrada',
      }
    }

    return {
      reservation: {
        reservation: data as typeof data,
        guest: (data as unknown as { guest: typeof data.guest }).guest,
        room: (data as unknown as { room: typeof data.room }).room,
      },
    }
  } catch (error) {
    console.error('Error en searchReservationByCode:', error)
    return {
      reservation: null,
      error: 'Error al buscar la reserva',
    }
  }
}

/**
 * Busca reservas por documento del cliente
 */
export async function searchReservationsByDocument(
  documentType: 'DNI' | 'CE' | 'PASAPORTE',
  documentNumber: string,
  onlyActive: boolean = false
): Promise<{ reservations: ReservationWithDetails[]; error?: string }> {
  const supabase = await createClient()

  if (!supabase) {
    return {
      reservations: [],
      error: 'Sistema no configurado',
    }
  }

  try {
    // Primero buscar el cliente
    const normalizedDocNumber = documentNumber.trim().toUpperCase()
    
    const { data: guest, error: guestError } = await supabase
      .from('guests')
      .select('id')
      .eq('document_type', documentType)
      .eq('document_number', normalizedDocNumber)
      .maybeSingle()

    if (guestError) {
      console.error('Error buscando cliente:', guestError)
      return {
        reservations: [],
        error: 'Error al buscar el cliente',
      }
    }

    if (!guest) {
      return {
        reservations: [],
        error: 'Cliente no encontrado',
      }
    }

    // Buscar reservas del cliente
    let query = supabase
      .from('reservations')
      .select(`
        *,
        guest:guests(*),
        room:rooms(*)
      `)
      .eq('guest_id', guest.id)
      .order('created_at', { ascending: false })

    // Si solo queremos activas, filtrar
    if (onlyActive) {
      query = query
        .not('checked_in_at', 'is', null)
        .is('checked_out_at', null)
        .not('status', 'in', '("cancelled","no_show")')
    }

    const { data, error } = await query

    if (error) {
      console.error('Error buscando reservas:', error)
      return {
        reservations: [],
        error: 'Error al buscar las reservas',
      }
    }

    if (!data || data.length === 0) {
      return {
        reservations: [],
        error: onlyActive ? 'No hay huéspedes actuales para este cliente' : 'No se encontraron reservas',
      }
    }

    return {
      reservations: data.map((item) => ({
        reservation: item as typeof item,
        guest: (item as unknown as { guest: typeof item.guest }).guest,
        room: (item as unknown as { room: typeof item.room }).room,
      })),
    }
  } catch (error) {
    console.error('Error en searchReservationsByDocument:', error)
    return {
      reservations: [],
      error: 'Error al buscar las reservas',
    }
  }
}

/**
 * Busca reservas por nombre del cliente
 */
export async function searchReservationsByName(
  name: string,
  onlyActive: boolean = false
): Promise<{ reservations: ReservationWithDetails[]; error?: string }> {
  const supabase = await createClient()

  if (!supabase) {
    return {
      reservations: [],
      error: 'Sistema no configurado',
    }
  }

  try {
    // Buscar clientes por nombre (búsqueda parcial, case-insensitive)
    const { data: guests, error: guestsError } = await supabase
      .from('guests')
      .select('id')
      .ilike('full_name', `%${name.trim()}%`)

    if (guestsError) {
      console.error('Error buscando clientes:', guestsError)
      return {
        reservations: [],
        error: 'Error al buscar clientes',
      }
    }

    if (!guests || guests.length === 0) {
      return {
        reservations: [],
        error: 'No se encontraron clientes con ese nombre',
      }
    }

    const guestIds = guests.map((g) => g.id)

    // Buscar reservas de esos clientes
    let query = supabase
      .from('reservations')
      .select(`
        *,
        guest:guests(*),
        room:rooms(*)
      `)
      .in('guest_id', guestIds)
      .order('created_at', { ascending: false })
      .limit(20) // Limitar a 20 resultados para evitar demasiados

    // Si solo queremos activas, filtrar
    if (onlyActive) {
      query = query
        .not('checked_in_at', 'is', null)
        .is('checked_out_at', null)
        .not('status', 'in', '("cancelled","no_show")')
    }

    const { data, error } = await query

    if (error) {
      console.error('Error buscando reservas:', error)
      return {
        reservations: [],
        error: 'Error al buscar las reservas',
      }
    }

    if (!data || data.length === 0) {
      return {
        reservations: [],
        error: onlyActive ? 'No hay huéspedes actuales' : 'No se encontraron reservas',
      }
    }

    return {
      reservations: data.map((item) => ({
        reservation: item as typeof item,
        guest: (item as unknown as { guest: typeof item.guest }).guest,
        room: (item as unknown as { room: typeof item.room }).room,
      })),
    }
  } catch (error) {
    console.error('Error en searchReservationsByName:', error)
    return {
      reservations: [],
      error: 'Error al buscar las reservas',
    }
  }
}

/**
 * Extiende la estancia de un huésped que ya hizo check-in
 * Permite aumentar la fecha de check-out y calcular el precio adicional
 */
export async function extendStay(
  reservationId: string,
  newCheckOut: string,
  notes?: string
): Promise<{ success: boolean; error?: string; additionalPrice?: number; newTotal?: number }> {
  const supabase = await createClient()

  if (!supabase) {
    return {
      success: false,
      error: 'Sistema no configurado',
    }
  }

  try {
    // Validar datos
    const { ExtendStaySchema } = await import('@/lib/validations/reception')
    ExtendStaySchema.parse({ reservationId, newCheckOut, notes })

    // Obtener la reserva actual
    const { data: reservation, error: reservationError } = await supabase
      .from('reservations')
      .select('*, room:rooms(price_per_night)')
      .eq('id', reservationId)
      .single()

    if (reservationError || !reservation) {
      return {
        success: false,
        error: 'Reserva no encontrada',
      }
    }

    // Validar que la reserva esté checked-in
    if (!reservation.checked_in_at) {
      return {
        success: false,
        error: 'Solo se puede extender la estancia de huéspedes que ya hicieron check-in',
      }
    }

    // Validar que no haya sido ya checkeada out
    if (reservation.checked_out_at) {
      return {
        success: false,
        error: 'No se puede extender una estancia que ya fue checkeada out',
      }
    }

    // Validar que la nueva fecha de check-out sea posterior a la actual
    const currentCheckOut = new Date(reservation.check_out)
    const newCheckOutDate = new Date(newCheckOut)

    if (newCheckOutDate <= currentCheckOut) {
      return {
        success: false,
        error: 'La nueva fecha de check-out debe ser posterior a la fecha actual de check-out',
      }
    }

    // Verificar disponibilidad de la habitación para el período extendido
    const { data: isAvailable, error: availabilityError } = await supabase.rpc(
      'check_room_availability',
      {
        p_room_id: reservation.room_id,
        p_check_in: reservation.check_in,
        p_check_out: newCheckOut,
      }
    )

    if (availabilityError || !isAvailable) {
      // Verificar si el conflicto es con la misma reserva (lo cual está bien para extensión)
      const { data: conflictingReservations } = await supabase
        .from('reservations')
        .select('id')
        .eq('room_id', reservation.room_id)
        .lt('check_in', newCheckOut)
        .gt('check_out', reservation.check_in)
        .neq('id', reservationId)
        .in('status', ['confirmed', 'pending', 'checked-in'])

      if (conflictingReservations && conflictingReservations.length > 0) {
        return {
          success: false,
          error: 'La habitación no está disponible para el período extendido. Hay otras reservas en esas fechas.',
        }
      }
    }

    // Calcular precio adicional
    const { calculateNights } = await import('@/lib/utils')
    const currentNights = calculateNights(reservation.check_in, reservation.check_out)
    const newNights = calculateNights(reservation.check_in, newCheckOut)
    const additionalNights = newNights - currentNights

    const room = reservation.room as unknown as { price_per_night: number }
    const additionalPrice = room.price_per_night * additionalNights
    const newTotal = Number(reservation.total_price) + additionalPrice

    // Actualizar la reserva con nueva fecha de check-out y precio
    const now = new Date().toISOString()
    const { data: updatedReservation, error: updateError } = await supabase
      .from('reservations')
      .update({
        check_out: newCheckOut,
        total_price: newTotal,
        updated_at: now,
        notes: notes ? (reservation.notes ? `${reservation.notes}\n\nExtensión: ${notes}` : notes) : reservation.notes,
      })
      .eq('id', reservationId)
      .select()
      .single()

    if (updateError || !updatedReservation) {
      console.error('Error extendiendo estancia:', updateError)
      return {
        success: false,
        error: 'Error al extender la estancia',
      }
    }

    revalidatePath('/admin/recepcion')
    revalidatePath('/admin/reservas')
    revalidatePath(`/admin/reservas/${reservationId}`)

    return {
      success: true,
      additionalPrice,
      newTotal,
    }
  } catch (error) {
    console.error('Error en extendStay:', error)
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'Error al procesar la extensión de estancia' }
  }
}

/**
 * Crea una reserva walk-in (cliente sin reserva previa) y opcionalmente realiza check-in
 */
export async function createWalkInReservation(
  formData: FormData
): Promise<{ success: boolean; bookingCode?: string; reservationId?: string; error?: string }> {
  const supabase = await createClient()

  if (!supabase) {
    return {
      success: false,
      error: 'Sistema no configurado',
    }
  }

  try {
    // Extraer datos del formulario
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
      performCheckIn: formData.get('performCheckIn') === 'true',
    }

    // Validar con BookingSchema
    const { BookingSchema } = await import('@/lib/validations/booking')
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
        success: false,
        error: 'La habitación no está disponible en esas fechas',
      }
    }

    // Buscar o crear guest usando document_number
    const normalizedDocNumber = validatedData.guest.documentNumber.trim().toUpperCase()
    
    const { data: existingGuest } = await supabase
      .from('guests')
      .select('*')
      .eq('document_type', validatedData.guest.documentType)
      .eq('document_number', normalizedDocNumber)
      .maybeSingle()

    let guest
    if (existingGuest) {
      // Actualizar datos del cliente existente
      const { data: updatedGuest, error: updateError } = await supabase
        .from('guests')
        .update({
          full_name: validatedData.guest.fullName,
          email: validatedData.guest.email,
          phone: validatedData.guest.phone,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingGuest.id)
        .select()
        .single()

      if (updateError) {
        console.error('Error actualizando cliente:', updateError)
        return { success: false, error: 'Error al actualizar datos del cliente' }
      }

      guest = updatedGuest
    } else {
      // Crear nuevo cliente
      const { data: newGuest, error: guestError } = await supabase
        .from('guests')
        .insert({
          full_name: validatedData.guest.fullName,
          email: validatedData.guest.email,
          phone: validatedData.guest.phone,
          document_type: validatedData.guest.documentType,
          document_number: normalizedDocNumber,
        })
        .select()
        .single()

      if (guestError) {
        console.error('Error creando cliente:', guestError)
        return { success: false, error: 'Error al registrar cliente' }
      }

      guest = newGuest
    }

    // Obtener precio de la habitación
    const { data: room, error: roomError } = await supabase
      .from('rooms')
      .select('price_per_night')
      .eq('id', validatedData.roomId)
      .single()

    if (roomError || !room) {
      return { success: false, error: 'Error al obtener información de la habitación' }
    }

    // Calcular precio total
    const { calculateNights } = await import('@/lib/utils')
    const nights = calculateNights(validatedData.checkIn, validatedData.checkOut)
    const totalPrice = room.price_per_night * nights

    // Crear reserva con estado 'confirmed' (walk-in siempre confirmado)
    const { data: reservation, error: reservationError } = await supabase
      .from('reservations')
      .insert({
        room_id: validatedData.roomId,
        guest_id: guest.id,
        check_in: validatedData.checkIn,
        check_out: validatedData.checkOut,
        total_price: totalPrice,
        status: 'confirmed',
        adults: validatedData.guests.adults,
        youths: validatedData.guests.youths,
        children: validatedData.guests.children,
        infants: validatedData.guests.infants,
      })
      .select()
      .single()

    if (reservationError) {
      console.error('Error creando reserva walk-in:', reservationError)
      return { success: false, error: 'Error al crear reserva' }
    }

    // Si se solicita, realizar check-in automático
    if (rawData.performCheckIn) {
      const checkInResult = await performCheckIn(reservation.id)
      if (!checkInResult.success) {
        console.warn('Reserva creada pero check-in automático falló:', checkInResult.error)
      }
    }

    revalidatePath('/admin/recepcion')
    revalidatePath('/admin/reservas')

    return {
      success: true,
      bookingCode: reservation.booking_code,
      reservationId: reservation.id,
    }
  } catch (error) {
    console.error('Error en createWalkInReservation:', error)
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'Error al procesar la reserva walk-in' }
  }
}

