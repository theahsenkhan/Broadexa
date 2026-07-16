import { SiteNav } from '../components/SiteNav'
import { SiteFooter } from '../components/SiteFooter'
import { getSessionUser } from '@/lib/session'
import { CartView } from './CartView'

export const dynamic = 'force-dynamic'

export default async function CartPage() {
  const user = await getSessionUser().catch(() => null)

  return (
    <>
      <SiteNav />
      <div className="container">
        <div className="page-head">
          <div className="eyebrow">Cart</div>
          <h1>Your cart</h1>
        </div>
        <CartView isLoggedIn={Boolean(user)} />
      </div>
      <SiteFooter />
    </>
  )
}
