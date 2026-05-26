import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const supabase = createServerSupabaseClient()
  await supabase.auth.signOut()
  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login`)
}