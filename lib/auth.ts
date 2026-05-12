import type { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { supabaseAdmin } from './supabase'

export const authOptions: NextAuthOptions = {
  debug: true, // temporary — remove after auth is fixed
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: [
            'openid',
            'email',
            'profile',
            'https://www.googleapis.com/auth/drive.readonly',
          ].join(' '),
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
        // Record when the access token expires so refreshAccessToken can fire
        // correctly. Prefer expires_at (Unix epoch seconds) when available,
        // fall back to computing from expires_in, then default to 1 hour.
        const expiresIn =
          typeof account.expires_in === 'number' ? account.expires_in : 3600
        token.accessTokenExpires = account.expires_at
          ? account.expires_at * 1000
          : Date.now() + expiresIn * 1000
        token.email = profile.email ?? null

        // Only upsert if we have an email — Google profile always includes one
        // but the type allows undefined, so guard here to be safe.
        if (profile.email) {
          await supabaseAdmin.from('users').upsert(
            {
              email: profile.email,
              name: (profile as { name?: string }).name ?? null,
              google_access_token: account.access_token,
              google_refresh_token: account.refresh_token,
            },
            { onConflict: 'email' }
          )
        }
      }

      // Refresh access token if it has expired
      if (token.refreshToken && isTokenExpired(token)) {
        token = await refreshAccessToken(token)
      }

      return token
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken as string
      session.user.email = token.email as string
      return session
    },
  },
  pages: {
    signIn: '/',
    error: '/',
  },
}

function isTokenExpired(token: Record<string, unknown>): boolean {
  if (!token.accessTokenExpires) return false
  return Date.now() > (token.accessTokenExpires as number)
}

async function refreshAccessToken(token: Record<string, unknown>) {
  try {
    const url = 'https://oauth2.googleapis.com/token'
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        grant_type: 'refresh_token',
        refresh_token: token.refreshToken as string,
      }),
    })
    const refreshed = await res.json()
    if (!res.ok) throw refreshed

    const newToken = {
      ...token,
      accessToken: refreshed.access_token,
      accessTokenExpires: Date.now() + refreshed.expires_in * 1000,
      refreshToken: refreshed.refresh_token ?? token.refreshToken,
    }

    // Persist refreshed token to DB
    await supabaseAdmin
      .from('users')
      .update({ google_access_token: refreshed.access_token })
      .eq('email', token.email as string)

    return newToken
  } catch {
    return { ...token, error: 'RefreshAccessTokenError' }
  }
}
