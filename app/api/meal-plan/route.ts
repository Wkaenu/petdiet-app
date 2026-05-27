import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createServerSupabaseClient } from '@/lib/supabase-server'

const client = new Anthropic()

export async function POST(req: NextRequest) {
  const authSupabase = createServerSupabaseClient()
  const { data: { user } } = await authSupabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_pro')
    .eq('id', user.id)
    .single()

  if (!profile?.is_pro) {
    return NextResponse.json({ error: 'Pro required' }, { status: 403 })
  }

  const { petType, name, breed, age, weight, status, health, ingredients, kcal } = await req.json()

  const prompt = `You are a veterinary nutritionist following AAFCO guidelines. Create a meal plan for:
- Animal: ${petType}, Breed: ${breed}, Age: ${age}
- Weight: ${weight} lbs, Status: ${status}
- Daily calories (AAFCO RER): ${kcal} kcal
- Health conditions: ${health}
- Preferred ingredients: ${ingredients}

Respond ONLY in valid JSON with no markdown:
{
  "meals": [
    {"time": "Morning", "amount": "e.g. 1 cup", "description": "detailed meal"},
    {"time": "Evening", "amount": "e.g. 1 cup", "description": "detailed meal"}
  ],
  "recommended": ["food1","food2","food3","food4","food5"],
  "avoid": ["food1","food2","food3","food4"],
  "tips": "2-3 personalized sentences",
  "supplement": "supplementation note",
  "hydration": "daily water target"
}`

  const message = await client.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }]
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''
  const plan = JSON.parse(text.replace(/```json|```/g, '').trim())
await supabase.from('meal_history').insert({
  user_id: user.id,
  kcal,
  plan
})
  return NextResponse.json(plan)
}