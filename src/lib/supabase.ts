import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'YOUR_SUPABASE_URL'
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          role: 'patient' | 'doctor' | 'pharmacy' | 'admin'
          avatar_url?: string
          phone?: string
          created_at: string
          updated_at: string
          specialization?: string
          license_number?: string
          experience_years?: number
          consultation_fee?: number
          date_of_birth?: string
          gender?: string
          address?: string
          emergency_contact?: string
          pharmacy_name?: string
          license_id?: string
          location?: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          role: 'patient' | 'doctor' | 'pharmacy' | 'admin'
          avatar_url?: string
          phone?: string
          specialization?: string
          license_number?: string
          experience_years?: number
          consultation_fee?: number
          date_of_birth?: string
          gender?: string
          address?: string
          emergency_contact?: string
          pharmacy_name?: string
          license_id?: string
          location?: string
        }
        Update: {
          email?: string
          full_name?: string
          role?: 'patient' | 'doctor' | 'pharmacy' | 'admin'
          avatar_url?: string
          phone?: string
          specialization?: string
          license_number?: string
          experience_years?: number
          consultation_fee?: number
          date_of_birth?: string
          gender?: string
          address?: string
          emergency_contact?: string
          pharmacy_name?: string
          license_id?: string
          location?: string
        }
      }
      appointments: {
        Row: {
          id: string
          patient_id: string
          doctor_id: string
          appointment_date: string
          status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled'
          symptoms?: string
          notes?: string
          video_room_id?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          patient_id: string
          doctor_id: string
          appointment_date: string
          status?: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled'
          symptoms?: string
          notes?: string
          video_room_id?: string
        }
        Update: {
          appointment_date?: string
          status?: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled'
          symptoms?: string
          notes?: string
          video_room_id?: string
        }
      }
      messages: {
        Row: {
          id: string
          sender_id: string
          receiver_id: string
          appointment_id?: string
          content: string
          message_type: 'text' | 'image' | 'file' | 'system'
          file_url?: string
          is_read: boolean
          created_at: string
        }
        Insert: {
          sender_id: string
          receiver_id: string
          appointment_id?: string
          content: string
          message_type?: 'text' | 'image' | 'file' | 'system'
          file_url?: string
          is_read?: boolean
        }
        Update: {
          is_read?: boolean
        }
      }
      symptom_assessments: {
        Row: {
          id: string
          patient_id: string
          symptoms: any
          ai_recommendation: string
          severity_level: string
          recommended_action: string
          created_at: string
        }
        Insert: {
          patient_id: string
          symptoms: any
          ai_recommendation: string
          severity_level: string
          recommended_action: string
        }
        Update: {
          symptoms?: any
          ai_recommendation?: string
          severity_level?: string
          recommended_action?: string
        }
      }
    }
  }
}