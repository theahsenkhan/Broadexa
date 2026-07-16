import { getPayload } from 'payload'
import config from '@payload-config'
import { redirect } from 'next/navigation'
import { getSessionUser } from '@/lib/session'
import { UploadWizard } from './UploadWizard'

export const dynamic = 'force-dynamic'

export default async function NewAssetPage() {
  const user = await getSessionUser()
  if (!user) redirect('/login?next=/dashboard/new-asset')
  if (user.role !== 'designer' && user.role !== 'admin') redirect('/dashboard')

  const payload = await getPayload({ config })
  const [engines, categories, genres] = await Promise.all([
    payload.find({ collection: 'engines', limit: 100, sort: 'name' }),
    payload.find({ collection: 'categories', limit: 100, sort: 'name' }),
    payload.find({ collection: 'genres', limit: 100, sort: 'name' }),
  ])

  return (
    <div>
      <h1 style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: 20, marginBottom: 20 }}>Upload a new asset</h1>
      <UploadWizard
        userId={String(user.id)}
        engines={engines.docs.map((e: any) => ({ id: e.id, name: e.name }))}
        categories={categories.docs.map((c: any) => ({ id: c.id, name: c.name }))}
        genres={genres.docs.map((g: any) => ({ id: g.id, name: g.name }))}
      />
    </div>
  )
}
