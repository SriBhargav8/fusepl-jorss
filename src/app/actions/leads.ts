'use server'

import { db } from '@/db'
import { users } from '@/db/schema'
import { normalizePhone } from '@/lib/utils'

export async function saveLead(data: { name: string, email: string, phone: string, companyName: string, message?: string, source?: string }) {
  try {
    const normalizedPhone = normalizePhone(data.phone)

    const userResult = await db.insert(users)
      .values({ 
        email: data.email,
        name: data.name,
        phone: normalizedPhone,
        companyName: data.companyName,
        message: data.message,
        source: data.source || 'book_valuation_review'
      })
      .onConflictDoUpdate({
        target: users.email,
        set: { 
          name: data.name,
          phone: normalizedPhone,
          companyName: data.companyName,
          message: data.message
        }
      })
      .returning({ id: users.id })
    
    return { success: true, userId: userResult[0].id }
  } catch (error) {
    console.error('[Action] saveLead failed:', error)
    return { success: false, error: 'Failed to save lead info. Please try again.' }
  }
}
