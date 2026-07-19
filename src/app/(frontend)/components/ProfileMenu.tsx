'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

export function ProfileMenu({
  name,
  username,
  role,
  avatarUrl,
}: {
  name: string
  username?: string | null
  role: string
  avatarUrl?: string | null
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  const initials = name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()
  const profileHref = username ? `/${role === 'designer' ? 'designer' : 'buyer'}/${username}` : '/account'

  return (
    <div className="profile-menu" ref={ref}>
      <button type="button" className="profile-trigger" onClick={() => setOpen((o) => !o)}>
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="profile-avatar" src={avatarUrl} alt="" />
        ) : (
          <span className="profile-avatar profile-avatar-fallback">{initials}</span>
        )}
        <span className="profile-name">{name}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6" /></svg>
      </button>
      {open && (
        <div className="profile-dropdown">
          <Link href={profileHref} onClick={() => setOpen(false)}>View public profile</Link>
          <Link href="/account" onClick={() => setOpen(false)}>Account settings</Link>
          <div className="profile-dropdown-divider" />
          <form action="/api/users/logout" method="POST">
            <button type="submit">Sign out</button>
          </form>
        </div>
      )}
    </div>
  )
}
