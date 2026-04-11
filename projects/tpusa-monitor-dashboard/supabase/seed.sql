-- Seed data: two sweeps with flagged posts for development

insert into sweeps (id, created_at, flag_count, legal_count, mention_count, org_count, raw_report)
values
  (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    '2026-04-11T12:00:00Z',
    3, 1, 8, 2,
    'Sweep at 2026-04-11T12:00Z found 3 flagged posts. 1 post has potential legal implications regarding defamation claims. 8 direct mentions of TPUSA detected, 2 from organizational accounts.'
  ),
  (
    'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    '2026-04-11T06:00:00Z',
    2, 0, 5, 1,
    'Sweep at 2026-04-11T06:00Z found 2 flagged posts. No legal concerns identified. 5 direct mentions of TPUSA detected, 1 from an organizational account.'
  );

insert into flagged_posts (id, sweep_id, handle, excerpt, category, tags, source_url, created_at)
values
  (
    'f0000000-0000-0000-0000-000000000001',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    '@watchdog_press',
    'New documents suggest TPUSA campus chapter funding discrepancies in three states...',
    'legal',
    '{"funding","campus","documents"}',
    'https://x.com/watchdog_press/status/1234567890',
    '2026-04-11T11:42:00Z'
  ),
  (
    'f0000000-0000-0000-0000-000000000002',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    '@campus_reporter',
    'Students at State U protest TPUSA event, citing controversial speaker lineup...',
    'mention',
    '{"protest","campus","events"}',
    'https://x.com/campus_reporter/status/1234567891',
    '2026-04-11T11:50:00Z'
  ),
  (
    'f0000000-0000-0000-0000-000000000003',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    '@political_daily',
    'Erika Kirk responds to criticism of TPUSA outreach program in viral thread...',
    'mention',
    '{"kirk","outreach","response"}',
    'https://x.com/political_daily/status/1234567892',
    '2026-04-11T11:55:00Z'
  ),
  (
    'f0000000-0000-0000-0000-000000000004',
    'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    '@edu_watchdog',
    'TPUSA affiliate organization announces expansion into community colleges...',
    'org',
    '{"expansion","community-college","affiliate"}',
    'https://x.com/edu_watchdog/status/1234567893',
    '2026-04-11T05:30:00Z'
  ),
  (
    'f0000000-0000-0000-0000-000000000005',
    'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    '@media_critic',
    'Thread analyzing TPUSA social media strategy and engagement metrics this quarter...',
    'mention',
    '{"strategy","social-media","analysis"}',
    'https://x.com/media_critic/status/1234567894',
    '2026-04-11T05:45:00Z'
  );
