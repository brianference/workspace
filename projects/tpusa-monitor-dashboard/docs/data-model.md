# Data model

## Tables

### sweeps

| Column | Type | Description |
|---|---|---|
| id | uuid (PK) | Auto-generated |
| created_at | timestamptz | When the sweep ran |
| flag_count | integer | Total flagged posts found |
| legal_count | integer | Posts with legal implications |
| mention_count | integer | Direct mentions found |
| org_count | integer | Organization-related posts |
| raw_report | text | Full text report from the agent |

### flagged_posts

| Column | Type | Description |
|---|---|---|
| id | uuid (PK) | Auto-generated |
| sweep_id | uuid (FK -> sweeps.id) | Parent sweep |
| handle | text | X/Twitter handle |
| excerpt | text | Post excerpt |
| category | text | Classification category |
| tags | text[] | Array of tags |
| source_url | text | Link to original post |
| created_at | timestamptz | When the post was flagged |
