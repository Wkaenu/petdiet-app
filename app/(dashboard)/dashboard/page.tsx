'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function DashboardPage() {
  const [email, setEmail] = useState('')
  const [isPro, setIsPro] = useState(false)
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setEmail(user.email || '')

      const { data: profile } = await supabase
        .from('profiles')
        .select('is_pro')
        .eq('id', user.id)
        .single()
      setIsPro(profile?.is_pro || false)

      const { data: meals } = await supabase
        .from('meal_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10)
      setHistory(meals || [])
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-sm text-gray-500">Loading...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-medium text-gray-900">🐾 My Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">{email}</p>
          </div>
          <div className="flex items-center gap-3">
            {isPro ? (
              <span className="text-xs bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-full">
                Pro plan
              </span>
            ) : (
              <Link href="/pricing" className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full hover:bg-gray-200">
                Upgrade to Pro
              </Link>
            )}
            <button
              onClick={async () => { await supabase.auth.signOut(); router.push('/login') }}
              className="text-sm text-gray-500 border border-gray-200 px-4 py-2 rounded-lg hover:border-gray-300">
              Log out
            </button>
          </div>
        </div>

        <div className="mb-6">
          <Link href="/"
            className="w-full block text-center py-3 bg-green-700 text-white rounded-xl text-sm font-medium hover:bg-green-800 transition-colors">
            Generate new meal plan ↗
          </Link>
        </div>

        <div>
          <h2 className="text-sm font-medium text-gray-900 mb-4">Recent meal plans</h2>
          {history.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
              <p className="text-sm text-gray-500">No meal plans yet.</p>
              <p className="text-sm text-green-700 mt-1">Generate your first plan above.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((item) => (
                <div key={item.id} className="bg-white border border-gray-200 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-gray-400">
                      {new Date(item.created_at).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric'
                      })}
                    </span>
                    <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full">
                      {item.kcal} kcal/day
                    </span>
                  </div>
                  {item.plan?.meals?.map((m: any) => (
                    <div key={m.time} className="flex gap-3 bg-gray-50 rounded-lg p-3 mb-2">
                      <span className="text-xs font-medium text-green-700 w-16">{m.time}</span>
                      <span className="text-xs text-gray-600 line-clamp-2">{m.description}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}