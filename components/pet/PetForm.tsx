'use client'

import { useState } from 'react'

const MULTIPLIERS: Record<string, Record<string, number>> = {
  dog: { na: 1.6, ia: 1.8, pi: 3.0, pn: 2.67 },
  cat: { na: 1.2, ia: 1.4, pi: 3.0, pn: 2.57 }
}

const STATUS_LABELS: Record<string, string> = {
  na: 'Neutered/Spayed adult',
  ia: 'Intact adult',
  pi: 'Puppy/Kitten (intact)',
  pn: 'Puppy/Kitten (neutered)'
}

export default function PetForm() {
  const [petType, setPetType] = useState<'dog' | 'cat'>('dog')
  const [weight, setWeight] = useState('')
  const [status, setStatus] = useState('na')
  const [name, setName] = useState('')
  const [breed, setBreed] = useState('')
  const [age, setAge] = useState('')
  const [health, setHealth] = useState('')
  const [ingredients, setIngredients] = useState('')
  const [loading, setLoading] = useState(false)
  const [plan, setPlan] = useState<any>(null)

  const calcCalories = () => {
    const w = parseFloat(weight)
    if (!w || w <= 0) return null
    const kg = w * 0.453592
    const rer = 70 * Math.pow(kg, 0.75)
    const m = MULTIPLIERS[petType][status]
    return Math.round(rer * m)
  }

  const kcal = calcCalories()
 

const handleSubmit = async () => {
  if (!kcal) return
  setLoading(true)
  try {
    const res = await fetch('/api/meal-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ petType, name, breed, age, weight, status, health, ingredients, kcal })
    })
    const data = await res.json()
    setPlan(data)
  } catch (e) {
    console.error(e)
  }
  setLoading(false)
}

  return (
    <div className="space-y-6">
      <div className="flex gap-3">
        {(['dog', 'cat'] as const).map(t => (
          <button
            key={t}
            onClick={() => setPetType(t)}
            className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-all ${
              petType === t
                ? 'border-green-700 bg-green-50 text-green-700'
                : 'border-gray-200 text-gray-500 hover:border-gray-300'
            }`}
          >
            {t === 'dog' ? '🐶 Dog' : '🐱 Cat'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs uppercase tracking-wide text-gray-500 mb-1">Pet name</label>
          <input value={name} onChange={e => setName(e.target.value)}
            placeholder="e.g. Buddy"
            className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-700" />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wide text-gray-500 mb-1">Breed</label>
          <input value={breed} onChange={e => setBreed(e.target.value)}
            placeholder={petType === 'dog' ? 'e.g. Labrador' : 'e.g. Persian'}
            className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-700" />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wide text-gray-500 mb-1">Weight (lbs)</label>
          <input type="number" value={weight} onChange={e => setWeight(e.target.value)}
            placeholder="e.g. 25"
            className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-700" />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wide text-gray-500 mb-1">Age</label>
          <input value={age} onChange={e => setAge(e.target.value)}
            placeholder="e.g. 3 years"
            className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-700" />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wide text-gray-500 mb-1">Reproductive status</label>
          <select value={status} onChange={e => setStatus(e.target.value)}
            className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-700">
            {Object.entries(STATUS_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wide text-gray-500 mb-1">Health conditions</label>
          <input value={health} onChange={e => setHealth(e.target.value)}
            placeholder="e.g. none, allergies"
            className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-700" />
        </div>
        <div className="col-span-2">
          <label className="block text-xs uppercase tracking-wide text-gray-500 mb-1">Preferred ingredients</label>
          <input value={ingredients} onChange={e => setIngredients(e.target.value)}
            placeholder="e.g. chicken, rice, sweet potato"
            className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-700" />
        </div>
      </div>

      {kcal && (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-3xl font-medium text-green-700">{kcal.toLocaleString()}</div>
          <div className="text-xs text-gray-500 mt-1">kcal / day estimated</div>
          <div className="text-xs text-gray-400 italic mt-1">
            RER × {MULTIPLIERS[petType][status]} ({STATUS_LABELS[status]})
          </div>
          <div className="text-xs text-gray-400 mt-2 pt-2 border-t border-gray-200">
            Typical range: {Math.round(kcal * 0.5).toLocaleString()}–{Math.round(kcal * 1.5).toLocaleString()} kcal/day
          </div>
        </div>
      )}

      <button
  onClick={handleSubmit}
  disabled={!kcal || loading}
  className="w-full py-3 bg-green-700 text-white rounded-lg text-sm font-medium hover:bg-green-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
  {loading ? 'Generating...' : 'Get AI meal plan ↗'}
</button>
{plan && (
  <div className="space-y-4 mt-4">
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <div className="text-xs uppercase tracking-wide text-gray-400 mb-3">Meal schedule</div>
      {plan.meals.map((m: any) => (
        <div key={m.time} className="flex gap-3 bg-gray-50 rounded-lg p-3 mb-2">
          <div className="text-xs font-medium text-green-700 w-16 pt-0.5">{m.time}<br/>
            <span className="font-normal text-gray-400">{m.amount}</span>
          </div>
          <div className="text-sm text-gray-700">{m.description}</div>
        </div>
      ))}
    </div>

    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <div className="text-xs uppercase tracking-wide text-gray-400 mb-3">Recommended foods</div>
      <div className="flex flex-wrap gap-2 mb-3">
        {plan.recommended.map((f: string) => (
          <span key={f} className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs">{f}</span>
        ))}
      </div>
      <div className="text-xs uppercase tracking-wide text-gray-400 mb-2">Never feed these</div>
      <div className="flex flex-wrap gap-2">
        {plan.avoid.map((f: string) => (
          <span key={f} className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs">{f}</span>
        ))}
      </div>
    </div>

    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <div className="text-xs uppercase tracking-wide text-gray-400 mb-3">Nutrition notes</div>
      <p className="text-sm text-gray-700 leading-relaxed">{plan.tips}</p>
      {plan.supplement && (
        <p className="text-xs text-gray-500 mt-3"><strong className="text-gray-700">Supplement:</strong> {plan.supplement}</p>
      )}
      {plan.hydration && (
        <p className="text-xs text-gray-500 mt-2"><strong className="text-gray-700">Water:</strong> {plan.hydration}</p>
      )}
    </div>
  </div>
)}
    </div>
  )
}