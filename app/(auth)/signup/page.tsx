'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleSignup = async () => {
  setLoading(true)
  setError('')
  const { data, error } = await supabase.auth.signUp({ email, password })
  console.log('data:', data)
  console.log('error:', error)
  if (error) {
    setError(error.message)
  } else {
    router.push('/dashboard')
  }
  setLoading(false)
}

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white border border-gray-200 rounded-xl p-8 w-full max-w-md">
        <h1 className="text-xl font-medium text-gray-900 mb-1">Create your account</h1>
        <p className="text-sm text-gray-500 mb-6">Start your 7-day free trial</p>

        {error && (
          <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wide text-gray-500 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-700"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wide text-gray-500 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Min 6 characters"
              className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-700"
            />
          </div>
          <button
            onClick={handleSignup}
            disabled={!email || !password || loading}
            className="w-full py-3 bg-green-700 text-white rounded-lg text-sm font-medium hover:bg-green-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </div>

        <p className="text-sm text-gray-500 text-center mt-4">
          Already have an account?{' '}
          <Link href="/login" className="text-green-700 hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  )
}