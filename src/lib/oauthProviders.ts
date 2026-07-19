export type OAuthProviderConfig = {
  authUrl: string
  tokenUrl: string
  userinfoUrl: string
  scope: string
  clientId?: string
  clientSecret?: string
}

export function getOAuthProvider(id: string): OAuthProviderConfig | null {
  if (id === 'google') {
    return {
      authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
      tokenUrl: 'https://oauth2.googleapis.com/token',
      userinfoUrl: 'https://www.googleapis.com/oauth2/v3/userinfo',
      scope: 'openid email profile',
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }
  }
  if (id === 'linkedin') {
    return {
      authUrl: 'https://www.linkedin.com/oauth/v2/authorization',
      tokenUrl: 'https://www.linkedin.com/oauth/v2/accessToken',
      userinfoUrl: 'https://api.linkedin.com/v2/userinfo',
      scope: 'openid profile email',
      clientId: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    }
  }
  return null
}
