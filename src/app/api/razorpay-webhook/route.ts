import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { users, valuations, certifiedRequests } from '@/db/schema'
import { eq } from 'drizzle-orm'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET

    if (!webhookSecret) {
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

      // Look up user_id by email if available
      let userId: string | null = null
      if (notes.email) {
        const userList = await db.select({ id: users.id }).from(users).where(eq(users.email, notes.email)).limit(1)
        userId = userList[0]?.id ?? null
      }

      // Create certified request record & update valuation in a transaction
      await db.transaction(async (tx) => {
        await tx.insert(certifiedRequests).values({
          valuationId: notes.valuation_id,
          userId: userId,
          status: 'paid',
          paymentId: payment.id,
          razorpayOrderId: payment.order_id,
          amount: (payment.amount / 100).toString(), // paise to rupees, store as string for decimal
          reportType: notes.purpose || notes.report_type || 'rule_11ua',
          purpose: notes.purpose || '',
          paidAt: new Date(),
        })

        if (notes.valuation_id) {
          await tx.update(valuations)
            .set({ paidPurpose: notes.purpose || 'rule_11ua' })
            .where(eq(valuations.id, notes.valuation_id))
        }
      })
    }

    return NextResponse.json({ status: 'ok' })
  } catch (err) {
    console.error('Webhook error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
