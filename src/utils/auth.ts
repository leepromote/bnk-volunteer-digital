// ─── 인증 유틸리티 ────────────────────────────────────────────
// Web Crypto API 기반 (Cloudflare Workers 호환)

const SECRET = 'BNK_DIGITALIT_SECRET_2024'

// SHA-256 해시
export async function sha256(message: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(message)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

// 간단한 세션 토큰 생성 (HMAC-SHA256 기반)
export async function createToken(userId: number, username: string): Promise<string> {
  const payload = JSON.stringify({ userId, username, exp: Date.now() + 24 * 60 * 60 * 1000 })
  const encoder = new TextEncoder()
  const keyData = encoder.encode(SECRET)
  const key = await crypto.subtle.importKey('raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(payload))
  const sigHex = Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('')
  return btoa(payload) + '.' + sigHex
}

// 토큰 검증
export async function verifyToken(token: string): Promise<{ userId: number; username: string } | null> {
  try {
    const [payloadB64, sigHex] = token.split('.')
    if (!payloadB64 || !sigHex) return null
    const payload = atob(payloadB64)
    const encoder = new TextEncoder()
    const keyData = encoder.encode(SECRET)
    const key = await crypto.subtle.importKey('raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['verify'])
    const sigBytes = new Uint8Array(sigHex.match(/.{2}/g)!.map(h => parseInt(h, 16)))
    const valid = await crypto.subtle.verify('HMAC', key, sigBytes, encoder.encode(payload))
    if (!valid) return null
    const data = JSON.parse(payload)
    if (data.exp < Date.now()) return null
    return { userId: data.userId, username: data.username }
  } catch {
    return null
  }
}

// 쿠키에서 토큰 추출
export function getTokenFromCookie(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null
  const match = cookieHeader.match(/admin_token=([^;]+)/)
  return match ? match[1] : null
}

// 관리자 인증 미들웨어
export async function requireAuth(c: any, next: any) {
  const cookie = c.req.header('Cookie') || ''
  const token = getTokenFromCookie(cookie)
  if (!token) return c.redirect('/admin/login')
  const user = await verifyToken(token)
  if (!user) return c.redirect('/admin/login')
  c.set('adminUser', user)
  await next()
}
