'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async () => {
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    console.log('data:', data)
    console.log('error:', error)
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      window.location.href = '/dashboard'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white border border-gray-200 rounded-xl p-8 w-full max-w-md">
        <h1 className="text-xl font-medium text-gray-900 mb-1">Welcome back</h1>
        <p className="text-sm text-gray-500 mb-6">Log in to your account</p>

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
              placeholder="Your password"
              className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-700"
            />
          </div>
          <button
            onClick={handleLogin}
            disabled={!email || !password || loading}
            className="w-full py-3 bg-green-700 text-white rounded-lg text-sm font-medium hover:bg-green-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </div>

        <p className="text-sm text-gray-500 text-center mt-4">
          No account yet?{' '}
          <Link href="/signup" className="text-green-700 hover:underline">Sign up free</Link>
        </p>
      </div>
    </div>
  )
}