import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const basicAuth = req.headers.get('authorization')
  
  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1]
    const [user, pwd] = atob(authValue).split(':')

    const expectedUser = process.env.ADMIN_USER || "admin"
    const expectedPwd = process.env.ADMIN_PASSWORD || "admin"

    if (user === expectedUser && pwd === expectedPwd) {
      return NextResponse.next()
    }
  }

  return new NextResponse('Authentication Required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Sentinel-AI Command Center"',
    },
  })
}

export const config = {
  matcher: [
    /*
     * Match all /api/ paths EXCEPT /api/simulate
     * This protects the dashboard endpoints but allows the public Simulator to work.
     */
    '/api/((?!simulate).*)',
    /* Protect the Admin Command Center */
    '/admin/:path*'
  ],
}
