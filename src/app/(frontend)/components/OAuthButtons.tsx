export function OAuthButtons({ oauth, next, role }: { oauth: { google: boolean; linkedin: boolean }; next: string; role?: string }) {
  if (!oauth.google && !oauth.linkedin) return null
  const qs = new URLSearchParams({ next, ...(role ? { role } : {}) }).toString()

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {oauth.google && (
          <a className="btn btn-ghost btn-block oauth-btn" href={`/api/auth/google/start?${qs}`}>
            <svg width="16" height="16" viewBox="0 0 48 48" style={{ marginRight: 8 }}>
              <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l6-6C34.4 5.1 29.5 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21 21-9.4 21-21c0-1.2-.1-2.4-.4-3.5z"/>
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.8 18.9 13 24 13c3.1 0 5.8 1.1 8 3l6-6C34.4 5.1 29.5 3 24 3 16.3 3 9.6 7.3 6.3 14.7z"/>
              <path fill="#4CAF50" d="M24 45c5.3 0 10.1-2 13.7-5.4l-6.3-5.3C29.4 35.9 26.8 37 24 37c-5.2 0-9.6-3.1-11.3-7.6l-6.5 5C9.5 41.6 16.2 45 24 45z"/>
              <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.5l6.3 5.3C39.9 36.9 43 31.2 43 24c0-1.2-.1-2.4-.4-3.5z"/>
            </svg>
            Continue with Google
          </a>
        )}
        {oauth.linkedin && (
          <a className="btn btn-ghost btn-block oauth-btn" href={`/api/auth/linkedin/start?${qs}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" style={{ marginRight: 8 }}>
              <rect width="24" height="24" rx="4" fill="#0A66C2" />
              <path fill="#fff" d="M7.1 9.6H4.4V19h2.7V9.6zM5.7 8.4c.9 0 1.5-.6 1.5-1.4 0-.8-.6-1.4-1.5-1.4S4.2 6.2 4.2 7c0 .8.6 1.4 1.5 1.4zM9 9.6V19h2.7v-5.1c0-1.3.8-2.1 1.9-2.1 1 0 1.6.7 1.6 2.1V19H18v-5.6c0-2.6-1.4-3.9-3.3-3.9-1.5 0-2.2.8-2.6 1.4V9.6H9z"/>
            </svg>
            Continue with LinkedIn
          </a>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--muted)', fontSize: 11.5, margin: '18px 0' }}>
        <div style={{ flex: 1, height: 1, background: 'var(--line)' }} /> or <div style={{ flex: 1, height: 1, background: 'var(--line)' }} />
      </div>
    </div>
  )
}
