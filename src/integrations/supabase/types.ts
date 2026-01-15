export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          confidence_scores: Json | null
          consultation_id: string | null
          id: string
          input_data: Json | null
          model_version: string | null
          output_data: Json | null
          timestamp: string
          user_id: string | null
        }
        Insert: {
          action: string
          confidence_scores?: Json | null
          consultation_id?: string | null
          id?: string
          input_data?: Json | null
          model_version?: string | null
          output_data?: Json | null
          timestamp?: string
          user_id?: string | null
        }
        Update: {
          action?: string
          confidence_scores?: Json | null
          consultation_id?: string | null
          id?: string
          input_data?: Json | null
          model_version?: string | null
          output_data?: Json | null
          timestamp?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_consultation_id_fkey"
            columns: ["consultation_id"]
            isOneToOne: false
            referencedRelation: "consultations"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          consultation_id: string | null
          content: string
          created_at: string
          id: string
          metadata: Json | null
          role: string
          user_id: string
        }
        Insert: {
          consultation_id?: string | null
          content: string
          created_at?: string
          id?: string
          metadata?: Json | null
          role: string
          user_id: string
        }
        Update: {
          consultation_id?: string | null
          content?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_consultation_id_fkey"
            columns: ["consultation_id"]
            isOneToOne: false
            referencedRelation: "consultations"
            referencedColumns: ["id"]
          },
        ]
      }
      consultations: {
        Row: {
          age: number | null
          consent_given: boolean | null
          created_at: string
          duration_days: number | null
          id: string
          severity: string | null
          status: string | null
          symptom_description: string | null
          symptoms: string[]
          updated_at: string
          user_id: string
        }
        Insert: {
          age?: number | null
          consent_given?: boolean | null
          created_at?: string
          duration_days?: number | null
          id?: string
          severity?: string | null
          status?: string | null
          symptom_description?: string | null
          symptoms: string[]
          updated_at?: string
          user_id: string
        }
        Update: {
          age?: number | null
          consent_given?: boolean | null
          created_at?: string
          duration_days?: number | null
          id?: string
          severity?: string | null
          status?: string | null
          symptom_description?: string | null
          symptoms?: string[]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      diagnoses: {
        Row: {
          confidence_score: number
          consultation_id: string
          created_at: string
          disease_name: string
          explanation: string | null
          id: string
          ranking: number
          symptom_relevance: Json | null
        }
        Insert: {
          confidence_score: number
          consultation_id: string
          created_at?: string
          disease_name: string
          explanation?: string | null
          id?: string
          ranking: number
          symptom_relevance?: Json | null
        }
        Update: {
          confidence_score?: number
          consultation_id?: string
          created_at?: string
          disease_name?: string
          explanation?: string | null
          id?: string
          ranking?: number
          symptom_relevance?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "diagnoses_consultation_id_fkey"
            columns: ["consultation_id"]
            isOneToOne: false
            referencedRelation: "consultations"
            referencedColumns: ["id"]
          },
        ]
      }
      drug_recommendations: {
        Row: {
          contraindications: string[] | null
          created_at: string
          diagnosis_id: string
          dosage: string
          drug_class: string | null
          drug_name: string
          duration: string | null
          frequency: string
          generic_name: string | null
          id: string
          is_safe: boolean | null
          route: string | null
          safety_notes: string | null
          side_effects: string[] | null
          timing: string | null
          warnings: string[] | null
        }
        Insert: {
          contraindications?: string[] | null
          created_at?: string
          diagnosis_id: string
          dosage: string
          drug_class?: string | null
          drug_name: string
          duration?: string | null
          frequency: string
          generic_name?: string | null
          id?: string
          is_safe?: boolean | null
          route?: string | null
          safety_notes?: string | null
          side_effects?: string[] | null
          timing?: string | null
          warnings?: string[] | null
        }
        Update: {
          contraindications?: string[] | null
          created_at?: string
          diagnosis_id?: string
          dosage?: string
          drug_class?: string | null
          drug_name?: string
          duration?: string | null
          frequency?: string
          generic_name?: string | null
          id?: string
          is_safe?: boolean | null
          route?: string | null
          safety_notes?: string | null
          side_effects?: string[] | null
          timing?: string | null
          warnings?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "drug_recommendations_diagnosis_id_fkey"
            columns: ["diagnosis_id"]
            isOneToOne: false
            referencedRelation: "diagnoses"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          allergies: string[] | null
          blood_type: string | null
          chronic_conditions: string[] | null
          created_at: string
          date_of_birth: string | null
          emergency_contact: string | null
          full_name: string | null
          gender: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          allergies?: string[] | null
          blood_type?: string | null
          chronic_conditions?: string[] | null
          created_at?: string
          date_of_birth?: string | null
          emergency_contact?: string | null
          full_name?: string | null
          gender?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          allergies?: string[] | null
          blood_type?: string | null
          chronic_conditions?: string[] | null
          created_at?: string
          date_of_birth?: string | null
          emergency_contact?: string | null
          full_name?: string | null
          gender?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_feedback: {
        Row: {
          actual_condition: string | null
          consultation_id: string
          created_at: string
          diagnosis_id: string | null
          feedback_text: string | null
          id: string
          is_correct: boolean | null
          user_id: string
        }
        Insert: {
          actual_condition?: string | null
          consultation_id: string
          created_at?: string
          diagnosis_id?: string | null
          feedback_text?: string | null
          id?: string
          is_correct?: boolean | null
          user_id: string
        }
        Update: {
          actual_condition?: string | null
          consultation_id?: string
          created_at?: string
          diagnosis_id?: string | null
          feedback_text?: string | null
          id?: string
          is_correct?: boolean | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_feedback_consultation_id_fkey"
            columns: ["consultation_id"]
            isOneToOne: false
            referencedRelation: "consultations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_feedback_diagnosis_id_fkey"
            columns: ["diagnosis_id"]
            isOneToOne: false
            referencedRelation: "diagnoses"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
