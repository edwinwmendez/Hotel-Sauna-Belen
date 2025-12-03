'use server'

import { getAvailableRooms } from '@/lib/queries/rooms'

export async function checkAvailability(
  checkIn: string,
  checkOut: string,
  guests?: { adults: number; youths: number; children: number; infants: number }
) {
  try {
    const rooms = await getAvailableRooms(checkIn, checkOut, guests)
    return { success: true, rooms }
  } catch (error) {
    console.error('Error checking availability:', error)
    return { success: false, rooms: [], error: 'Error al verificar disponibilidad' }
  }
}

