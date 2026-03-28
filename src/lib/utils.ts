import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a number as INR in lakh/crore notation.
 * < Rs 1 Cr → "Rs X L"
 * >= Rs 1 Cr → "Rs X.X Cr"
 */
export function formatINR(value: number): string {
  if (value === 0) return 'Rs 0'
  const crore = 10_000_000
  const lakh = 100_000
  if (Math.abs(value) >= crore) {
    return `Rs ${(value / crore).toFixed(1)} Cr`
  }
  if (Math.abs(value) >= lakh) {
    return `Rs ${Math.round(value / lakh)} L`
  }
  return `Rs ${formatIndianNumber(Math.round(value))}`
}

/** Format percentage with 1 decimal place */
export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`
}

/** Format number in Indian comma notation: 1,00,000 */
export function formatIndianNumber(num: number): string {
  const str = Math.round(num).toString()
  if (str.length <= 3) return str
  let result = str.slice(-3)
  let remaining = str.slice(0, -3)
  while (remaining.length > 0) {
    const chunk = remaining.slice(-2)
    result = chunk + ',' + result
    remaining = remaining.slice(0, -2)
  }
  return result
}

/** Clamp a value between min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/** Shared email validation regex */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Normalize phone number by stripping all non-digits and removing Indian country code if present */
export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.length === 12 && digits.startsWith('91')) {
    return digits.slice(2)
  }
  return digits
}
