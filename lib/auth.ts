// lib/auth.ts
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

// Create a single supabase client for client-side use
const supabaseClient = createPagesBrowserClient()

export function createClientClient() {
  return supabaseClient
}

export async function getSession() {
  try {
    const { data: { session } } = await supabaseClient.auth.getSession()
    return session
  } catch (error) {
    console.error('Error getting session:', error)
    return null
  }
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password,
  })
  
  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabaseClient.auth.signOut()
  if (error) throw error
}

export async function requireSession() {
  const session = await getSession()
  if (!session) {
    throw new Error('Authentication required')
  }
  return session
}