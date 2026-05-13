export { default } from 'next-auth/middleware'

export const config = {
  // /onboarding is intentionally omitted: unauthenticated users need to reach
  // it to see the "Connect Google" step. The onboarding page itself guards
  // subsequent steps by checking `status === 'authenticated'` via useSession.
  matcher: ['/dashboard/:path*', '/settings/:path*', '/admin/:path*'],
}
