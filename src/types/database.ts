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
      profiles: {
        Row: {
          id: string
          email: string
          name: string | null
          role: 'developer' | 'consultant' | 'contractor' | 'cpm' | 'lender' | 'admin'
          company: string | null
          avatar: string | null
          location: string | null
          certifications: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          role?: 'developer' | 'consultant' | 'contractor' | 'cpm' | 'lender' | 'admin'
          company?: string | null
          avatar?: string | null
          location?: string | null
          certifications?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          role?: 'developer' | 'consultant' | 'contractor' | 'cpm' | 'lender' | 'admin'
          company?: string | null
          avatar?: string | null
          location?: string | null
          certifications?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          owner_id: string
          title: string
          description: string | null
          location: string | null
          type: 'residential' | 'commercial' | 'strata' | 'mixed' | 'development'
          status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled'
          start_date: string | null
          end_date: string | null
          budget: number | null
          deadline: string | null
          ltv: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          title: string
          description?: string | null
          location?: string | null
          type: 'residential' | 'commercial' | 'strata' | 'mixed' | 'development'
          status?: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled'
          start_date?: string | null
          end_date?: string | null
          budget?: number | null
          deadline?: string | null
          ltv?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          title?: string
          description?: string | null
          location?: string | null
          type?: 'residential' | 'commercial' | 'strata' | 'mixed' | 'development'
          status?: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled'
          start_date?: string | null
          end_date?: string | null
          budget?: number | null
          deadline?: string | null
          ltv?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      project_milestones: {
        Row: {
          id: string
          project_id: string
          title: string
          description: string | null
          due_date: string
          completed_date: string | null
          status: 'pending' | 'in-progress' | 'completed' | 'delayed'
          assigned_to: string | null
          dependencies: string[]
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          title: string
          description?: string | null
          due_date: string
          completed_date?: string | null
          status?: 'pending' | 'in-progress' | 'completed' | 'delayed'
          assigned_to?: string | null
          dependencies?: string[]
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          title?: string
          description?: string | null
          due_date?: string
          completed_date?: string | null
          status?: 'pending' | 'in-progress' | 'completed' | 'delayed'
          assigned_to?: string | null
          dependencies?: string[]
          created_at?: string
        }
      }
      project_participants: {
        Row: {
          id: string
          project_id: string
          user_id: string
          role: 'developer' | 'consultant' | 'contractor' | 'cpm' | 'lender'
          name: string
          email: string | null
          company: string | null
          avatar: string | null
          invited_at: string | null
          joined_at: string | null
          status: 'invited' | 'active' | 'inactive'
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          user_id: string
          role: 'developer' | 'consultant' | 'contractor' | 'cpm' | 'lender'
          name: string
          email?: string | null
          company?: string | null
          avatar?: string | null
          invited_at?: string | null
          joined_at?: string | null
          status?: 'invited' | 'active' | 'inactive'
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          user_id?: string
          role?: 'developer' | 'consultant' | 'contractor' | 'cpm' | 'lender'
          name?: string
          email?: string | null
          company?: string | null
          avatar?: string | null
          invited_at?: string | null
          joined_at?: string | null
          status?: 'invited' | 'active' | 'inactive'
          created_at?: string
        }
      }
      consultant_profiles: {
        Row: {
          id: string
          discipline: string
          company: string
          phone: string | null
          location: string | null
          coordinates: Json | null
          rating: number
          review_count: number
          projects_completed: number
          years_experience: number
          licenses: string[]
          certifications: string[]
          memberships: string[]
          specializations: string[]
          availability: 'available' | 'limited' | 'busy'
          preferred_project_types: string[]
          min_project_value: number | null
          max_project_value: number | null
          fee_structure: string | null
          typical_fee_range: Json | null
          company_profile: string | null
          sample_contracts: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          discipline: string
          company: string
          phone?: string | null
          location?: string | null
          coordinates?: Json | null
          rating?: number
          review_count?: number
          projects_completed?: number
          years_experience: number
          licenses?: string[]
          certifications?: string[]
          memberships?: string[]
          specializations?: string[]
          availability?: 'available' | 'limited' | 'busy'
          preferred_project_types?: string[]
          min_project_value?: number | null
          max_project_value?: number | null
          fee_structure?: string | null
          typical_fee_range?: Json | null
          company_profile?: string | null
          sample_contracts?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          discipline?: string
          company?: string
          phone?: string | null
          location?: string | null
          coordinates?: Json | null
          rating?: number
          review_count?: number
          projects_completed?: number
          years_experience?: number
          licenses?: string[]
          certifications?: string[]
          memberships?: string[]
          specializations?: string[]
          availability?: 'available' | 'limited' | 'busy'
          preferred_project_types?: string[]
          min_project_value?: number | null
          max_project_value?: number | null
          fee_structure?: string | null
          typical_fee_range?: Json | null
          company_profile?: string | null
          sample_contracts?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      consultant_proposals: {
        Row: {
          id: string
          consultant_id: string
          project_id: string
          discipline: string
          scope_of_work: string
          deliverables: string[]
          timeline: number
          fee_structure: string
          fee_amount: number | null
          fee_percentage: number | null
          payment_schedule: string
          proposal_document: string | null
          fee_proposal_letter: string | null
          contract_template: string | null
          tor: string | null
          status: 'submitted' | 'under-review' | 'accepted' | 'rejected' | 'withdrawn'
          submitted_at: string
          valid_until: string
          team_members: string[]
          sub_consultants: string[]
          assumptions: string[]
          exclusions: string[]
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          consultant_id: string
          project_id: string
          discipline: string
          scope_of_work: string
          deliverables: string[]
          timeline: number
          fee_structure: string
          fee_amount?: number | null
          fee_percentage?: number | null
          payment_schedule: string
          proposal_document?: string | null
          fee_proposal_letter?: string | null
          contract_template?: string | null
          tor?: string | null
          status?: 'submitted' | 'under-review' | 'accepted' | 'rejected' | 'withdrawn'
          submitted_at?: string
          valid_until: string
          team_members?: string[]
          sub_consultants?: string[]
          assumptions?: string[]
          exclusions?: string[]
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          consultant_id?: string
          project_id?: string
          discipline?: string
          scope_of_work?: string
          deliverables?: string[]
          timeline?: number
          fee_structure?: string
          fee_amount?: number | null
          fee_percentage?: number | null
          payment_schedule?: string
          proposal_document?: string | null
          fee_proposal_letter?: string | null
          contract_template?: string | null
          tor?: string | null
          status?: 'submitted' | 'under-review' | 'accepted' | 'rejected' | 'withdrawn'
          submitted_at?: string
          valid_until?: string
          team_members?: string[]
          sub_consultants?: string[]
          assumptions?: string[]
          exclusions?: string[]
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      land_listings: {
        Row: {
          id: string
          owner_id: string
          title: string
          location: string
          coordinates: Json | null
          price: number
          size: number
          zoning: string
          description: string
          images: string[]
          documents: string[]
          features: string[]
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          title: string
          location: string
          coordinates?: Json | null
          price: number
          size: number
          zoning: string
          description: string
          images?: string[]
          documents?: string[]
          features?: string[]
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          title?: string
          location?: string
          coordinates?: Json | null
          price?: number
          size?: number
          zoning?: string
          description?: string
          images?: string[]
          documents?: string[]
          features?: string[]
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      contractor_bids: {
        Row: {
          id: string
          project_id: string
          contractor_id: string
          amount: number
          timeline: number
          proposal: string
          documents: string[]
          status: 'submitted' | 'under-review' | 'accepted' | 'rejected'
          submitted_at: string
          updated_at: string | null
          feedback: string | null
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          contractor_id: string
          amount: number
          timeline: number
          proposal: string
          documents?: string[]
          status?: 'submitted' | 'under-review' | 'accepted' | 'rejected'
          submitted_at?: string
          updated_at?: string | null
          feedback?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          contractor_id?: string
          amount?: number
          timeline?: number
          proposal?: string
          documents?: string[]
          status?: 'submitted' | 'under-review' | 'accepted' | 'rejected'
          submitted_at?: string
          updated_at?: string | null
          feedback?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'developer' | 'consultant' | 'contractor' | 'cpm' | 'lender' | 'admin'
      project_type: 'residential' | 'commercial' | 'strata' | 'mixed' | 'development'
      project_status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled'
    }
  }
}
