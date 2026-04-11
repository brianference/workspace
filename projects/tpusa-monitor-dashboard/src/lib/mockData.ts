import type { Sweep, FlaggedPost } from './types'

const SWEEP_1_ID = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
const SWEEP_2_ID = 'b2c3d4e5-f6a7-8901-bcde-f12345678901'

export const MOCK_SWEEPS: Sweep[] = [
  {
    id: SWEEP_1_ID,
    created_at: '2026-04-11T12:00:00Z',
    flag_count: 3,
    legal_count: 1,
    mention_count: 8,
    org_count: 2,
    raw_report:
      'Sweep at 2026-04-11T12:00Z found 3 flagged posts. 1 post has potential legal implications regarding defamation claims. 8 direct mentions of TPUSA detected, 2 from organizational accounts.',
  },
  {
    id: SWEEP_2_ID,
    created_at: '2026-04-11T06:00:00Z',
    flag_count: 2,
    legal_count: 0,
    mention_count: 5,
    org_count: 1,
    raw_report:
      'Sweep at 2026-04-11T06:00Z found 2 flagged posts. No legal concerns identified. 5 direct mentions of TPUSA detected, 1 from an organizational account.',
  },
]

export const MOCK_POSTS: FlaggedPost[] = [
  {
    id: 'p001',
    sweep_id: SWEEP_1_ID,
    handle: '@watchdog_press',
    excerpt:
      'New documents suggest TPUSA campus chapter funding discrepancies in three states...',
    category: 'legal',
    tags: ['funding', 'campus', 'documents'],
    source_url: 'https://x.com/watchdog_press/status/1234567890',
    created_at: '2026-04-11T11:42:00Z',
  },
  {
    id: 'p002',
    sweep_id: SWEEP_1_ID,
    handle: '@campus_reporter',
    excerpt:
      'Students at State U protest TPUSA event, citing controversial speaker lineup...',
    category: 'mention',
    tags: ['protest', 'campus', 'events'],
    source_url: 'https://x.com/campus_reporter/status/1234567891',
    created_at: '2026-04-11T11:50:00Z',
  },
  {
    id: 'p003',
    sweep_id: SWEEP_1_ID,
    handle: '@political_daily',
    excerpt:
      'Erika Kirk responds to criticism of TPUSA outreach program in viral thread...',
    category: 'mention',
    tags: ['kirk', 'outreach', 'response'],
    source_url: 'https://x.com/political_daily/status/1234567892',
    created_at: '2026-04-11T11:55:00Z',
  },
  {
    id: 'p004',
    sweep_id: SWEEP_2_ID,
    handle: '@edu_watchdog',
    excerpt:
      'TPUSA affiliate organization announces expansion into community colleges...',
    category: 'org',
    tags: ['expansion', 'community-college', 'affiliate'],
    source_url: 'https://x.com/edu_watchdog/status/1234567893',
    created_at: '2026-04-11T05:30:00Z',
  },
  {
    id: 'p005',
    sweep_id: SWEEP_2_ID,
    handle: '@media_critic',
    excerpt:
      'Thread analyzing TPUSA social media strategy and engagement metrics this quarter...',
    category: 'mention',
    tags: ['strategy', 'social-media', 'analysis'],
    source_url: 'https://x.com/media_critic/status/1234567894',
    created_at: '2026-04-11T05:45:00Z',
  },
]
