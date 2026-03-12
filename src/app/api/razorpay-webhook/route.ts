import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET

    if (!supabaseUrl || !serviceKey || !webhookSecret) {
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
    }

    const body = await req.text()
    const signature = req.headers.get('x-razorpay-signature')

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
    }

    // Verify Razorpay webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(body)
      .digest('hex')

    if (signature !== expectedSignature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const event = JSON.parse(body)

    if (event.event === 'payment.captured') {
      const payment = event.payload.payment.entity
      const notes = payment.notes || {}

      const supabase = createClient(supabaseUrl, serviceKey)

      // Look up user_id by email if available
      let userId: string | null = null
      if (notes.email) {
        const { data: user } = await supabase
          .from('users')
          .select('id')
          .eq('email', notes.email)
          .single()
        userId = user?.id ?? null
      }

      // Create certified request record
      const { error } = await supabase
        .from('certified_requests')
        .insert({
          valuation_id: notes.valuation_id,
          user_id: userId,
          status: 'paid',
          payment_id: payment.id,
          razorpay_order_id: payment.order_id,
          amount: payment.amount / 100, // paise to rupees
          report_type: notes.report_type || 'rule_11ua',
          purpose: notes.purpose || '',
          paid_at: new Date().toISOString(),
        })

      if (error) {
        console.error('Certified request insert error:', error)
        return NextResponse.json({ error: 'DB error' }, { status: 500 })
      }
    }

    return NextResponse.json({ status: 'ok' })
  } catch (err) {
    console.error('Webhook error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
