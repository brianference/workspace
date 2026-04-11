import type { FlaggedPost } from '../lib/types'

interface EventItemProps {
  post: FlaggedPost
}

const CATEGORY_EMOJI: Record<string, string> = {
  legal: '\u2696',
  mention: '\uD83D\uDC64',
  org: '\uD83C\uDFDB',
}

/**
 * Timeline event card with category dot, accent stripe,
 * handle, timestamp, excerpt, tags, and "View on X" button.
 */
export function EventItem({ post }: EventItemProps) {
  const isOrg = post.category === 'org'
  const borderColor = isOrg ? 'var(--accent)' : 'var(--danger)'
  const stripeColor = isOrg ? 'var(--accent)' : 'var(--danger)'
  const emoji = CATEGORY_EMOJI[post.category] ?? '\u2696'

  const postDate = new Date(post.created_at)
  const now = new Date()
  const diffMs = now.getTime() - postDate.getTime()
  const diffH = Math.floor(diffMs / (1000 * 60 * 60))
  const timeLabel = diffH < 1 ? 'just now' : `${diffH}h ago`

  return (
    <div
      style={{
        position: 'relative',
        marginBottom: '0.75rem',
      }}
    >
      {/* Category dot */}
      <div
        style={{
          position: 'absolute',
          left: '-1.5rem',
          width: '18px',
          height: '18px',
          borderRadius: '50%',
          border: `2px solid ${borderColor}`,
          background: 'var(--bg)',
          top: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.58rem',
          lineHeight: 1,
          boxShadow: `0 0 8px color-mix(in srgb, ${borderColor} 30%, transparent)`,
        }}
      >
        {emoji}
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
            background: stripeColor,
            flexShrink: 0,
            alignSelf: 'stretch',
          }}
        />

        {/* Content */}
        <div style={{ padding: '0.65rem 0.8rem 0.7rem', flex: 1 }}>
          {/* Top row: handle + timestamp */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '4px',
            }}
          >
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.72rem',
                fontWeight: 600,
                color: 'var(--accent)',
              }}
            >
              @{post.handle}
            </span>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.55rem',
                color: 'var(--t3)',
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
              marginBottom: '0.5rem',
              margin: '0 0 0.5rem 0',
            }}
          >
            {post.excerpt}
          </p>

          {/* Footer: tags + View on X */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              {post.tags.map((tag) => {
                const isDanger = tag.toLowerCase().includes('legal') || tag.toLowerCase().includes('kirk')
                return (
                  <span
                    key={tag}
                    style={{
                      fontSize: '0.56rem',
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: '4px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      background: isDanger
                        ? 'color-mix(in srgb, var(--danger) 10%, transparent)'
                        : 'color-mix(in srgb, var(--accent) 10%, transparent)',
                      color: isDanger ? 'var(--danger)' : 'var(--accent)',
                      border: isDanger
                        ? '1px solid color-mix(in srgb, var(--danger) 24%, transparent)'
                        : '1px solid color-mix(in srgb, var(--accent) 22%, transparent)',
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
              }}
              aria-label={`View post by @${post.handle} on X`}
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
