import { Suspense } from 'react'
import { LoginForm } from './LoginForm'

export default function LoginPage() {
  const oauth = {
    google: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
    linkedin: Boolean(process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET),
  }
  return (
    <Suspense>
      <LoginForm oauth={oauth} />
    </Suspense>
  )
}
