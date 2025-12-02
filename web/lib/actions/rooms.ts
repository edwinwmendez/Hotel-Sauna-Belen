'use server'

import { getRoomById } from '@/lib/queries/rooms'

export async function fetchRoomById(roomId: string) {
  try {
    const room = await getRoomById(roomId)
    return { success: true, room }
  } catch (error) {
    console.error('Error fetching room:', error)
    return { success: false, room: null, error: 'Error al cargar la habitación' }
  }
}

