'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const [email, setEmail] = useState('')
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
      } else {
        setEmail(user.email || '')
      }
    }
    getUser()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-medium text-gray-900">🐾 Pet Diet Planner</h1>
            <p className="text-sm text-gray-500 mt-1">{email}</p>
          </div>
          <button
            onClick={async () => {
              await supabase.auth.signOut()
              router.push('/login')
            }}
            className="text-sm text-gray-500 hover:text-gray-700 border border-gray-200 px-4 py-2 rounded-lg">
            Log out
          </button>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
          <p className="text-gray-500 text-sm">Your pet profiles will appear here.</p>
          <p className="text-green-700 text-sm mt-1 font-medium">Step 4 coming next — Stripe subscriptions.</p>
        </div>
      </div>
    </div>
  )
}