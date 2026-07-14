import { headers as nextHeaders } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { User } from '../payload-types'

export async function getSessionUser(): Promise<User | null> {
  const payload = await getPayload({ config })
  const headersList = await nextHeaders()
  const { user } = await payload.auth({ headers: headersList })
  return user as User | null
}

export async function requireSessionUser(): Promise<User> {
  const user = await getSessionUser()
  if (!user) throw new Error('Not authenticated')
  return user
}
