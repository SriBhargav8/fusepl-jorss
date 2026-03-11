import type { CapTableEntry, CapTableRound, CapTableResult } from '@/types'

/**
 * Cap Table Simulator — Pre/Post-Round ESOP Modeling
 * Spec: Cap Table Simulator section
 *
 * Pre-round ESOP: Carved from existing shareholders BEFORE investor enters.
 * Post-round ESOP: Carved from ALL shareholders AFTER investor enters.
 */

export function simulateRound(
  currentCapTable: CapTableEntry[],
  round: CapTableRound
): CapTableResult {
  const postMoney = round.pre_money + round.raise_amount
  const newInvestorPct = (round.raise_amount / postMoney) * 100

  let shareholders = currentCapTable.map(s => ({ ...s } as CapTableEntry))

  if (round.esop_timing === 'pre_round' && round.esop_expansion_pct > 0) {
    // Step 1: Carve ESOP from existing shareholders before investor
    const esopFactor = 1 - round.esop_expansion_pct / 100
    shareholders = shareholders.map(s => ({
      ...s,
      percentage: s.percentage * esopFactor,
    } as CapTableEntry))
    // Add/expand ESOP pool
    const existingEsop = shareholders.find(s => s.share_class === 'esop')
    if (existingEsop) {
      existingEsop.percentage += round.esop_expansion_pct
    } else {
      shareholders.push({
        name: 'ESOP Pool',
        percentage: round.esop_expansion_pct,
        share_class: 'esop',
      })
    }
  }

  // Step 2: Investor enters — dilutes all existing proportionally
  const investorDilution = 1 - newInvestorPct / 100
  shareholders = shareholders.map(s => ({
    ...s,
    percentage: s.percentage * investorDilution,
  } as CapTableEntry))

  // Add new investor
  shareholders.push({
    name: 'New Investor',
    percentage: newInvestorPct,
    share_class: 'preference',
  })

  if (round.esop_timing === 'post_round' && round.esop_expansion_pct > 0) {
    // Step 3: Carve ESOP from ALL shareholders including new investor
    const esopFactor = 1 - round.esop_expansion_pct / 100
    shareholders = shareholders.map(s => ({
      ...s,
      percentage: s.percentage * esopFactor,
    } as CapTableEntry))
    const existingEsop = shareholders.find(s => s.share_class === 'esop')
    if (existingEsop) {
      existingEsop.percentage += round.esop_expansion_pct
    } else {
      shareholders.push({
        name: 'ESOP Pool',
        percentage: round.esop_expansion_pct,
        share_class: 'esop',
      })
    }
  }

  const founderPct = shareholders
    .filter(s => s.share_class === 'common')
    .reduce((sum, s) => sum + s.percentage, 0)

  return {
    shareholders,
    post_money: postMoney,
    new_investor_pct: newInvestorPct,
    founder_pct_after: founderPct,
  }
}

/**
 * Simulate up to 3 sequential rounds.
 * Each round's output cap table feeds into the next round's input.
 */
export function simulateMultiRound(
  initialCapTable: CapTableEntry[],
  rounds: CapTableRound[]
): CapTableResult[] {
  const maxRounds = 3
  const results: CapTableResult[] = []
  let currentCapTable = initialCapTable

  for (let i = 0; i < Math.min(rounds.length, maxRounds); i++) {
    const result = simulateRound(currentCapTable, rounds[i])
    results.push(result)
    currentCapTable = result.shareholders
  }

  return results
}
