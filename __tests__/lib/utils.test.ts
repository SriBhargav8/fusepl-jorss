import { describe, it, expect } from 'vitest'
import { formatINR, formatPercentage, formatIndianNumber, clamp } from '@/lib/utils'

describe('formatINR', () => {
  it('formats values under Rs 1 Cr in lakhs', () => {
    expect(formatINR(5_000_000)).toBe('Rs 50 L')
    expect(formatINR(1_500_000)).toBe('Rs 15 L')
    expect(formatINR(500_000)).toBe('Rs 5 L')
  })

  it('formats values >= Rs 1 Cr in crores', () => {
    expect(formatINR(10_000_000)).toBe('Rs 1.0 Cr')
    expect(formatINR(80_000_000)).toBe('Rs 8.0 Cr')
    expect(formatINR(1_250_000_000)).toBe('Rs 125.0 Cr')
  })

  it('formats zero', () => {
    expect(formatINR(0)).toBe('Rs 0')
  })
})

describe('formatPercentage', () => {
  it('formats with one decimal', () => {
    expect(formatPercentage(23.456)).toBe('23.5%')
    expect(formatPercentage(100)).toBe('100.0%')
  })
})

describe('formatIndianNumber', () => {
  it('uses Indian comma format', () => {
    expect(formatIndianNumber(100000)).toBe('1,00,000')
    expect(formatIndianNumber(10000000)).toBe('1,00,00,000')
  })
})

describe('clamp', () => {
  it('clamps values to range', () => {
    expect(clamp(50, 0, 100)).toBe(50)
    expect(clamp(-10, 0, 100)).toBe(0)
    expect(clamp(150, 0, 100)).toBe(100)
  })
})
