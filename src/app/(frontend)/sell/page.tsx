import Link from 'next/link'
import { SiteNav } from '../components/SiteNav'
import { SiteFooter } from '../components/SiteFooter'

export const dynamic = 'force-dynamic'

export default function SellPage() {
  return (
    <>
      <SiteNav />

      <section className="hero">
        <div className="tc">For real-time designers</div>
        <h1>
          Sell your scenes.
          <br />
          <em>Keep 80%.</em>
        </h1>
        <p>
          List virtual sets, AR graphics and show packages for Viz Engine, Unreal, Zero Density, Pixotope,
          Aximmetry, Brainstorm, Chyron, Ross and Reality. You set your own prices. We take 20% — nothing else.
        </p>
        <div className="hero-ctas">
          <Link className="btn btn-primary" href="/signup?role=designer">Start selling</Link>
          <Link className="btn btn-ghost" href="/faq">Read the FAQ</Link>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="sec-head"><h2>How it works</h2></div>
          <div className="grid">
            <div className="card-a" style={{ padding: 20 }}>
              <h3 style={{ marginBottom: 8 }}>1. Upload</h3>
              <p style={{ fontSize: 13.5, color: 'var(--muted)', lineHeight: 1.6 }}>
                List your scene with specs, includes and a short on-engine recording. Set your own price, and
                optionally offer an exclusive buyout.
              </p>
            </div>
            <div className="card-a" style={{ padding: 20 }}>
              <h3 style={{ marginBottom: 8 }}>2. Reviewed</h3>
              <p style={{ fontSize: 13.5, color: 'var(--muted)', lineHeight: 1.6 }}>
                Every listing is checked before it goes live. Supply an on-engine recording and we&apos;ll verify it
                against your listing — that earns the Verified badge.
              </p>
            </div>
            <div className="card-a" style={{ padding: 20 }}>
              <h3 style={{ marginBottom: 8 }}>3. Get paid</h3>
              <p style={{ fontSize: 13.5, color: 'var(--muted)', lineHeight: 1.6 }}>
                Buyers pay you directly through Stripe. We take 20% commission — you keep 80%. Payouts run monthly.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--card)', borderTop: '1px solid var(--line)' }}>
        <div className="container">
          <div className="sec-head"><h2>What you can sell</h2></div>
          <div className="chips">
            <span className="chip">Virtual sets</span>
            <span className="chip">AR graphics</span>
            <span className="chip">Show packages</span>
            <span className="chip">Lower thirds</span>
            <span className="chip">Data visualization</span>
            <span className="chip">Transitions &amp; stingers</span>
            <span className="chip">Free assets (under a studio name if you like)</span>
          </div>
        </div>
      </section>

      <section className="hero" style={{ padding: '64px 24px' }}>
        <h2 style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 28, marginBottom: 16 }}>Ready to list your first scene?</h2>
        <Link className="btn btn-primary" href="/signup?role=designer">Create your designer account</Link>
      </section>

      <SiteFooter />
    </>
  )
}
