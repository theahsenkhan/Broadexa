import { getSessionUser } from '@/lib/session'
import { ConnectButton } from './ConnectButton'

export const dynamic = 'force-dynamic'

export default async function PayoutsPage() {
  const user = await getSessionUser()
  if (!user) return null

  return (
    <div>
      <h1 style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: 20, marginBottom: 8 }}>Payouts</h1>
      <p style={{ fontSize: 13.5, color: 'var(--muted)', marginBottom: 20, maxWidth: 480 }}>
        Broadexa pays designers through Stripe Connect. Connect your account once to receive monthly payouts —
        you keep 80% of every sale, we take 20% commission.
      </p>

      {user.stripeAccountId ? (
        <div className="chip">✓ Stripe account connected</div>
      ) : (
        <ConnectButton />
      )}
    </div>
  )
}
