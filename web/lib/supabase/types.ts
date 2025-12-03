export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      rooms: {
        Row: {
          id: string
          name: string
          slug: string
          type: 'king' | 'matrimonial' | 'simple'
          description: string | null
          price_per_night: number
          capacity: number
          max_adults: number | null
          max_youths: number | null
          max_children: number | null
          max_infants: number | null
          amenities: Json
          images: string[]
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['rooms']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['rooms']['Insert']>
      }
      guests: {
        Row: {
          id: string
          user_id: string | null
          full_name: string
          email: string
          phone: string
          document_type: 'DNI' | 'CE' | 'PASAPORTE'
          document_number: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['guests']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['guests']['Insert']>
      }
      reservations: {
        Row: {
          id: string
          booking_code: string
          room_id: string
          guest_id: string
          check_in: string
          check_out: string
          nights: number
          total_price: number
          adults: number
          youths: number
          children: number
          infants: number
          status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show'
          notes: string | null
          checked_in_at: string | null
          checked_out_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['reservations']['Row'], 'id' | 'booking_code' | 'nights' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['reservations']['Insert']>
      }
      check_ins: {
        Row: {
          id: string
          reservation_id: string
          checked_in_at: string
          checked_out_at: string | null
          checked_in_by: string | null
          checked_out_by: string | null
          additional_charges: number
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['check_ins']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['check_ins']['Insert']>
      }
      inventory_categories: {
        Row: {
          id: string
          name: string
          description: string | null
          icon: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['inventory_categories']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['inventory_categories']['Insert']>
      }
      inventory_products: {
        Row: {
          id: string
          category_id: string | null
          name: string
          description: string | null
          sku: string | null
          unit: string
          current_stock: number
          min_stock: number
          cost_per_unit: number | null
          supplier: string | null
          location: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['inventory_products']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['inventory_products']['Insert']>
      }
      inventory_movements: {
        Row: {
          id: string
          product_id: string
          movement_type: 'entrada' | 'salida' | 'ajuste'
          quantity: number
          previous_stock: number
          new_stock: number
          reason: string | null
          room_id: string | null
          reservation_id: string | null
          notes: string | null
          created_by: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['inventory_movements']['Row'], 'id' | 'previous_stock' | 'new_stock' | 'created_at'>
        Update: Partial<Database['public']['Tables']['inventory_movements']['Insert']>
      }
    }
  }
}

