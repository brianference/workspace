/** A single monitoring sweep run by the agent */
export interface Sweep {
  id: string
  created_at: string
  flag_count: number
  legal_count: number
  mention_count: number
  org_count: number
  raw_report: string
}

/** A flagged post identified during a sweep */
export interface FlaggedPost {
  id: string
  sweep_id: string
  handle: string
  excerpt: string
  category: string
  tags: string[]
  source_url: string
  created_at: string
}
