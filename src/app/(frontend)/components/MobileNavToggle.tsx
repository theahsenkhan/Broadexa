'use client'

import { useState } from 'react'

export function MobileNavToggle({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button className="nav-burger" aria-label="Menu" onClick={() => setOpen((o) => !o)}>
        <span />
        <span />
        <span />
      </button>
      <div className={`nav-mobile-panel ${open ? 'open' : ''}`} onClick={() => setOpen(false)}>
        {children}
      </div>
    </>
  )
}
