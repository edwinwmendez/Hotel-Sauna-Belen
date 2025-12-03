'use server'

import { createClient } from '@/lib/supabase/server'
import { Database } from '@/lib/supabase/types'
import { searchGuestByDocument, getGuestWithStats } from '@/lib/queries/guests'

type Guest = Database['public']['Tables']['guests']['Row']

/**
 * Server Action: Busca un cliente por documento
 * Para usar en componentes cliente
 */
export async function searchGuestByDocumentAction(
  documentType: 'DNI' | 'CE' | 'PASAPORTE',
  documentNumber: string
): Promise<{ guest: Guest | null; error?: string }> {
  try {
    const guest = await searchGuestByDocument(documentType, documentNumber)
    return { guest }
  } catch (error) {
    console.error('Error buscando cliente:', error)
    return {
      guest: null,
      error: 'Error al buscar el cliente',
    }
  }
}

/**
 * Server Action: Obtiene estadísticas de un cliente
 * Para usar en componentes cliente
 */
export async function getGuestStatsAction(
  guestId: string
): Promise<{ stats: { stay_count: number; last_stay: string | null } | null; error?: string }> {
  try {
    const stats = await getGuestWithStats(guestId)
    
    if (!stats) {
      return { stats: null }
    }

    return {
      stats: {
        stay_count: stats.stay_count,
        last_stay: stats.last_stay,
      },
    }
  } catch (error) {
    console.error('Error obteniendo estadísticas del cliente:', error)
    return {
      stats: null,
      error: 'Error al obtener estadísticas',
    }
  }
}

