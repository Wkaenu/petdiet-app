import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

const client = new Anthropic()

export async function POST(req: NextRequest) {
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

  return NextResponse.json(plan)
}