import { Suspense } from 'react'
import { SignupForm } from './SignupForm'

export default function SignupPage() {
  const oauth = {
    google: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
    linkedin: Boolean(process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET),
  }
  return (
    <Suspense>
      <SignupForm oauth={oauth} />
    </Suspense>
  )
}
