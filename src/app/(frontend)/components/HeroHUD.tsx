'use client'

import { useEffect, useState } from 'react'

export function HeroHUD({ engines }: { engines: string[] }) {
  const [time, setTime] = useState('00:00:00:00')
  const [engineIndex, setEngineIndex] = useState(0)

  useEffect(() => {
    let frame = 0
    const tick = setInterval(() => {
      frame = (frame + 1) % 25
      const now = new Date()
      const h = String(now.getHours()).padStart(2, '0')
      const m = String(now.getMinutes()).padStart(2, '0')
      const s = String(now.getSeconds()).padStart(2, '0')
      const f = String(frame).padStart(2, '0')
      setTime(`${h}:${m}:${s}:${f}`)
    }, 40)
    return () => clearInterval(tick)
  }, [])

  useEffect(() => {
    if (engines.length === 0) return
    const rotate = setInterval(() => {
      setEngineIndex((i) => (i + 1) % engines.length)
    }, 1800)
    return () => clearInterval(rotate)
  }, [engines.length])

  return (
    <div className="hero-hud">
      <div className="hud-top">
        <span className="hud-rec">
          <i className="hud-dot" /> REC
        </span>
        <span className="hud-tc">{time}</span>
      </div>
      <div className="hud-frame">
        <div className="hud-scan" />
        <div className="hud-badge">{engines[engineIndex] || 'ENGINE'}</div>
      </div>
      <div className="hud-bottom">
        <span>1920×1080</span>
        <span>59.94i</span>
        <span>LIVE</span>
      </div>
    </div>
  )
}
