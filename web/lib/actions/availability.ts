'use server'

import { getAvailableRooms } from '@/lib/queries/rooms'

export async function checkAvailability(checkIn: string, checkOut: string) {
  try {
    const rooms = await getAvailableRooms(checkIn, checkOut)
    return { success: true, rooms }
  } catch (error) {
    console.error('Error checking availability:', error)
    return { success: false, rooms: [], error: 'Error al verificar disponibilidad' }
  }
}

