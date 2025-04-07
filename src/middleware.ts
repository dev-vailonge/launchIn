import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { increment } from '@/lib/redis'

// Rate limit configuration
const RATE_LIMIT = {
  MAX_REQUESTS: 10,
  WINDOW_SECONDS: 10,
}

async function checkRateLimit(ip: string, path: string): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
  // Only rate limit specific paths that need protection
  if (!path.startsWith('/api/') && !path.match(/\/(login|signup|reset-password)$/)) {
    return {
      success: true,
      limit: RATE_LIMIT.MAX_REQUESTS,
      remaining: RATE_LIMIT.MAX_REQUESTS,
      reset: Math.floor(Date.now() / 1000) + RATE_LIMIT.WINDOW_SECONDS,
    }
  }

  const key = `rate_limit:${ip}:${path.split('/')[1]}`
  const now = Math.floor(Date.now() / 1000)
  const windowExpiry = now + RATE_LIMIT.WINDOW_SECONDS

  const requests = await increment(key, RATE_LIMIT.WINDOW_SECONDS)
  
  return {
    success: requests <= RATE_LIMIT.MAX_REQUESTS,
    limit: RATE_LIMIT.MAX_REQUESTS,
    remaining: Math.max(0, RATE_LIMIT.MAX_REQUESTS - requests),
    reset: windowExpiry,
  }
}

export async function middleware(request: NextRequest) {
  // Get IP address from request
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ?? '127.0.0.1'
  
  // Rate limiting check only for specific paths
  const { success, limit, reset, remaining } = await checkRateLimit(ip, request.nextUrl.pathname)
  
  // If rate limit exceeded, return 429 Too Many Requests
  if (!success) {
    return new NextResponse('Too Many Requests', {
      status: 429,
      headers: {
        'Retry-After': reset.toString(),
        'X-RateLimit-Limit': limit.toString(),
        'X-RateLimit-Remaining': remaining.toString(),
        'X-RateLimit-Reset': reset.toString(),
      },
    })
  }

  // Get response
  const response = NextResponse.next()

  // Check if we're in development mode
  const isDevelopment = process.env.NODE_ENV === 'development'

  // Add security headers
  const cspHeader = isDevelopment 
    ? `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline' https:;
      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
      img-src 'self' blob: data: https:;
      font-src 'self' https://fonts.gstatic.com;
      connect-src 'self' https://*.stripe.com https://*.supabase.co ws://localhost:* http://localhost:*;
      frame-src 'self' https://*.stripe.com;
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'none';
      block-all-mixed-content;
      upgrade-insecure-requests;
    `.replace(/\s{2,}/g, ' ').trim()
    : `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval' https: data:;
      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
      img-src 'self' blob: data: https:;
      font-src 'self' data: https://fonts.gstatic.com;
      connect-src 'self' https://*.stripe.com https://*.supabase.co https://*.vercel.app wss://*.vercel.app;
      frame-src 'self' https://*.stripe.com;
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'none';
      block-all-mixed-content;
      upgrade-insecure-requests;
    `.replace(/\s{2,}/g, ' ').trim()

  // Set security headers
  response.headers.set('Content-Security-Policy', cspHeader)
  response.headers.set('X-DNS-Prefetch-Control', 'on')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=()')
  
  // Add rate limit headers only for rate-limited paths
  if (request.nextUrl.pathname.startsWith('/api/') || request.nextUrl.pathname.match(/\/(login|signup|reset-password)$/)) {
    response.headers.set('X-RateLimit-Limit', limit.toString())
    response.headers.set('X-RateLimit-Remaining', remaining.toString())
    response.headers.set('X-RateLimit-Reset', reset.toString())
  }

  return response
}

// Update matcher to only include paths that need security headers
export const config = {
  matcher: [
    '/api/:path*',
    '/login',
    '/signup',
    '/reset-password',
    '/dashboard/:path*'
  ]
} 