import type { FlaggedPost } from '../lib/types'

interface EventItemProps {
  post: FlaggedPost
  showMedia?: boolean
}

/** Per-category visual config: color variable, emoji, label */
const CATEGORY_CONFIG: Record<string, { color: string; emoji: string; label: string }> = {
  legal:   { color: 'var(--danger)', emoji: '⚖️',  label: 'Legal'   },
  mention: { color: 'var(--warn)',   emoji: '📢',   label: 'Mention' },
  org:     { color: 'var(--accent)', emoji: '🏛️',  label: 'Org'     },
  flag:    { color: 'var(--danger)', emoji: '🚩',   label: 'Flag'    },
}

const DEFAULT_CONFIG = { color: 'var(--warn)', emoji: '📌', label: 'Other' }

/**
 * Timeline event card. Left stripe color and category badge indicate type:
 *   Red  ⚖️  Legal   — court/investigation content
 *   Amber 📢 Mention — someone talking about TPUSA/Kirk
 *   Cyan 🏛️  Org     — official TPUSA org account posting
 */
export function EventItem({ post, showMedia = true }: EventItemProps) {
  const cfg = CATEGORY_CONFIG[post.category] ?? DEFAULT_CONFIG
  const color = cfg.color

  const postDate = new Date(post.tweet_created_at ?? post.created_at)
  const now = new Date()
  const diffMs = now.getTime() - postDate.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffH = Math.floor(diffMs / (1000 * 60 * 60))
  const diffD = Math.floor(diffH / 24)
  const timeLabel = post.tweet_created_at
    ? (diffMins < 60
        ? `${diffMins}m ago`
        : diffH < 24
          ? `${diffH}h ago`
          : diffD < 7
            ? `${diffD}d ago`
            : postDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: diffD > 365 ? 'numeric' : undefined }))
    : diffH < 1 ? 'just now' : diffH < 24 ? `${diffH}h ago` : `${diffD}d ago`

  return (
    <div
      style={{
        position: 'relative',
        marginBottom: '0.75rem',
      }}
    >
      {/* Category dot on timeline rail (hidden in grid via CSS) */}
      <div
        className="timeline-dot"
        style={{
          position: 'absolute',
          left: '-1.5rem',
          width: '18px',
          height: '18px',
          borderRadius: '50%',
          border: `2px solid ${color}`,
          background: 'var(--bg)',
          top: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.58rem',
          lineHeight: 1,
          boxShadow: `0 0 8px color-mix(in srgb, ${color} 30%, transparent)`,
        }}
      >
        {cfg.emoji}
      </div>

      {/* Card body */}
      <div
        style={{
          background: 'var(--card)',
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.05)',
          overflow: 'hidden',
          display: 'flex',
        }}
      >
        {/* Left accent stripe */}
        <div
          style={{
            width: '3px',
            background: color,
            flexShrink: 0,
            alignSelf: 'stretch',
          }}
        />

        {/* Content */}
        <div style={{ padding: '0.65rem 0.8rem 0.7rem', flex: 1 }}>
          {/* Top row: handle + category badge + timestamp */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '4px',
              gap: '6px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  color: 'var(--accent)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {post.handle}
              </span>

              {/* Category badge */}
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.52rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  background: `color-mix(in srgb, ${color} 12%, transparent)`,
                  border: `1px solid color-mix(in srgb, ${color} 28%, transparent)`,
                  color: color,
                  flexShrink: 0,
                }}
              >
                {cfg.label}
              </span>
            </div>

            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.55rem',
                color: 'var(--t3)',
                flexShrink: 0,
              }}
            >
              {timeLabel}
            </span>
          </div>

          {/* Excerpt */}
          <p
            style={{
              fontSize: '0.74rem',
              lineHeight: 1.6,
              color: 'var(--t2)',
              margin: '0 0 0.5rem 0',
            }}
          >
            {post.excerpt}
          </p>

          {/* Media thumbnail */}
          {showMedia && post.media_url && (
            <a
              href={post.source_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'block', marginBottom: '0.5rem', position: 'relative', borderRadius: '8px', overflow: 'hidden' }}
              aria-label={`View ${post.media_type ?? 'media'} on X`}
            >
              <img
                src={post.media_url}
                alt=""
                style={{
                  width: '100%',
                  maxHeight: '220px',
                  objectFit: 'cover',
                  display: 'block',
                  borderRadius: '8px',
                  border: '1px solid var(--sepc)',
                }}
                loading="lazy"
              />
              {(post.media_type === 'video' || post.media_type === 'animated_gif') && (
                <div style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(0,0,0,0.35)',
                }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '50%',
                    background: 'rgba(0,0,0,0.7)', border: '2px solid rgba(255,255,255,0.8)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                      <polygon points="5,3 19,12 5,21" />
                    </svg>
                  </div>
                </div>
              )}
            </a>
          )}

          {/* Footer: tags + View on X */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '6px',
            }}
          >
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', flex: 1 }}>
              {post.tags.map((tag) => {
                const isDanger = tag.toLowerCase().includes('legal') ||
                                 tag.toLowerCase().includes('murder') ||
                                 tag.toLowerCase().includes('threat')
                const tagColor = isDanger ? 'var(--danger)' : 'var(--t3)'
                return (
                  <span
                    key={tag}
                    style={{
                      fontSize: '0.54rem',
                      fontWeight: 600,
                      padding: '2px 6px',
                      borderRadius: '4px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      background: isDanger
                        ? 'color-mix(in srgb, var(--danger) 8%, transparent)'
                        : 'color-mix(in srgb, var(--t3) 12%, transparent)',
                      color: tagColor,
                      border: isDanger
                        ? '1px solid color-mix(in srgb, var(--danger) 20%, transparent)'
                        : '1px solid color-mix(in srgb, var(--t3) 20%, transparent)',
                    }}
                  >
                    {tag}
                  </span>
                )
              })}
            </div>

            <a
              href={post.source_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.6rem',
                fontWeight: 600,
                padding: '4px 9px',
                borderRadius: '7px',
                background: 'color-mix(in srgb, var(--accent) 9%, transparent)',
                border: '1px solid color-mix(in srgb, var(--accent) 20%, transparent)',
                color: 'var(--t1)',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                minHeight: '44px',
                minWidth: '44px',
                justifyContent: 'center',
                flexShrink: 0,
              }}
              aria-label={`View post by ${post.handle} on X`}
            >
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="currentColor"
                style={{ color: 'var(--accent)' }}
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.912-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              View
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
