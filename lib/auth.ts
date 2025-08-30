import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import { supabaseHelpers } from './supabase-helpers'

const secret = new TextEncoder().encode('your-secret-key-change-this-in-production')

export async function createSession(username: string) {
  const token = await new SignJWT({ username })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret)

  const cookieStore = await cookies()
  cookieStore.set('admin-session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 // 24 hours
  })

  return token
}

export async function verifySession() {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin-session')?.value

  if (!token) {
    return null
  }

  try {
    const { payload } = await jwtVerify(token, secret)
    return payload
  } catch (error) {
    return null
  }
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete('admin-session')
}

export async function authenticateAdmin(username: string, password: string) {
  const admin = await supabaseHelpers.getAdminByUsername(username)
  
  if (!admin || !bcrypt.compareSync(password, admin.password)) {
    return null
  }

  return admin
}

export async function requireAuth() {
  const session = await verifySession()
  if (!session) {
    throw new Error('Unauthorized')
  }
  return session
}