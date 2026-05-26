'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function PricingPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubscribe = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/checkout', { method: 'POST' })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else if (data.error === 'Not authenticated') {
        router.push('/login')
      }
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-10">
          <h1 className="text-2xl font-medium text-gray-900">Choose your plan</h1>
          <p className="text-sm text-gray-500 mt-2">Start free, upgrade when you need AI meal plans</p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="text-sm font-medium text-gray-900 mb-1">Free</div>
            <div className="text-3xl font-medium text-gray-900 mb-1">$0</div>
            <div className="text-xs text-gray-500 mb-6">forever</div>
            <ul className="space-y-2 mb-8">
              {['AAFCO calorie calculator','1 pet profile','AAFCO recipe builder link'].map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-green-700">✓</span>{f}
                </li>
              ))}
              {['AI meal plans','Food recommendations','Nutrition tips'].map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-400">
                  <span>✗</span>{f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => router.push('/')}
              className="w-full py-2.5 border border-gray-200 rounded-lg text-sm text-gray-500 hover:border-gray-300 transition-colors">
              Continue free
            </button>
          </div>

          <div className="bg-white border-2 border-green-700 rounded-xl p-6 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-700 text-white text-xs px-3 py-1 rounded-full">
              Most popular
            </div>
            <div className="text-sm font-medium text-gray-900 mb-1">Pro</div>
            <div className="text-3xl font-medium text-gray-900 mb-1">$4.99</div>
            <div className="text-xs text-gray-500 mb-6">/ month · cancel anytime</div>
            <ul className="space-y-2 mb-8">
              {[
                'Everything in Free',
                'Unlimited AI meal plans',
                'Food recommendations',
                'Personalized nutrition tips',
                'Supplement guidance',
                'Up to 5 pet profiles',
                'Hydration notes'
              ].map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-green-700">✓</span>{f}
                </li>
              ))}
            </ul>
            <button
              onClick={handleSubscribe}
              disabled={loading}
              className="w-full py-2.5 bg-green-700 text-white rounded-lg text-sm font-medium hover:bg-green-800 transition-colors disabled:opacity-50">
              {loading ? 'Loading...' : 'Start 7-day free trial'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}