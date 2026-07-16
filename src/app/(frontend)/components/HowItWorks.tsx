'use client'

import { useState } from 'react'

type Step = { title: string; body: string }

export function HowItWorks({ buyerSteps, designerSteps }: { buyerSteps: Step[]; designerSteps: Step[] }) {
  const [tab, setTab] = useState<'buyer' | 'designer'>('buyer')
  const steps = tab === 'buyer' ? buyerSteps : designerSteps

  return (
    <div>
      <div className="tab-switch">
        <button className={`tab-btn ${tab === 'buyer' ? 'active' : ''}`} onClick={() => setTab('buyer')}>
          For buyers
        </button>
        <button className={`tab-btn ${tab === 'designer' ? 'active' : ''}`} onClick={() => setTab('designer')}>
          For designers
        </button>
      </div>
      <div className="hiw-steps">
        {steps.map((s, i) => (
          <div key={i} className="card-a" style={{ padding: 20 }}>
            <h3 style={{ marginBottom: 6, fontSize: 15 }}>{s.title}</h3>
            <p style={{ fontSize: 13.5, color: 'var(--muted)', lineHeight: 1.6 }}>{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
