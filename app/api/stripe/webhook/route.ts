import { stripe } from '@/lib/stripe'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error('Webhook signature error:', err.message)
    console.error('Secret used:', process.env.STRIPE_WEBHOOK_SECRET?.slice(0, 20))
    return NextResponse.json({ error: err.message }, { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any
    const userId = session.metadata?.userId
    const customerId = session.customer
    const subscriptionId = session.subscription

    console.log('checkout completed for userId:', userId)

    if (userId) {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId,
          is_pro: true
        })
      console.log('upsert error:', error)
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as any
    await supabase
      .from('profiles')
      .update({ is_pro: false })
      .eq('stripe_subscription_id', subscription.id)
  }

  return NextResponse.json({ received: true })
}