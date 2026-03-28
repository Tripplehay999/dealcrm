export type DealStage = 'interested' | 'contacted' | 'negotiating' | 'closed' | 'rejected'
export type DealPriority = 'low' | 'medium' | 'high'
export type DealStatus = 'active' | 'archived'

export interface Profile {
  id: string
  full_name: string | null
  email: string
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface Deal {
  id: string
  user_id: string
  name: string
  description: string | null
  website_url: string | null
  industry: string | null
  acquisition_type: string | null
  stage: DealStage
  priority: DealPriority
  status: DealStatus
  estimated_value: number | null
  potential_score: number | null
  risk_score: number | null
  traction_score: number | null
  final_score: number | null
  source: string | null
  notes_summary: string | null
  created_at: string
  updated_at: string
  // optional joined relations
  founders?: Founder[]
  notes?: Note[]
}

export interface Founder {
  id: string
  deal_id: string
  full_name: string
  email: string | null
  linkedin_url: string | null
  twitter_url: string | null
  role_title: string | null
  phone: string | null
  notes: string | null
  created_at: string
  updated_at: string
  // optional join
  deal?: Pick<Deal, 'id' | 'name'>
}

export interface Note {
  id: string
  deal_id: string
  user_id: string
  content: string
  created_at: string
  updated_at: string
}

export interface Activity {
  id: string
  user_id: string
  deal_id: string | null
  type: string
  description: string
  created_at: string
  deal?: Pick<Deal, 'id' | 'name'>
}

// Dashboard aggregate types
export interface DashboardStats {
  totalDeals: number
  activeDeals: number
  closedDeals: number
  highPriorityDeals: number
  averageScore: number
  estimatedTotalValue: number
}

export interface PipelineStageCount {
  stage: DealStage
  count: number
}
