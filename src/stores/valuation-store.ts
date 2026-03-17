'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { WizardInputs, ValuationResult, ValuationPurpose } from '@/types'

const DEFAULT_INPUTS: WizardInputs = {
  company_name: '',
  sector: 'saas_horizontal',
  stage: 'seed',
  business_model: 'saas_subscription',
  city: '',
  founding_year: new Date().getFullYear() - 1,
  team_size: 3,
  founder_experience: 3,
  domain_expertise: 3,
  previous_exits: false,
  technical_cofounder: false,
  key_hires: [],
  annual_revenue: 0,
  revenue_growth_pct: 0,
  gross_margin_pct: 0,
  monthly_burn: 0,
  cash_in_bank: 0,
  cac: null,
  ltv: null,
  last_round_size: null,
  last_round_valuation: null,
  tam: 1000,
  dev_stage: 'idea',
  competition_level: 3,
  competitive_advantages: [],
  patents_count: 0,
  strategic_partnerships: 'none',
  regulatory_risk: 3,
  revenue_concentration_pct: null,
  international_revenue_pct: 0,
  esop_pool_pct: null,
  time_to_liquidity_years: 4,
  current_cap_table: null,
  target_raise: null,
  expected_dilution_pct: null,
}

interface ValuationStore {
  currentStep: number
  highestCompletedStep: number
  inputs: WizardInputs
  result: ValuationResult | null
  email: string | null
  userName: string | null
  userPhone: string | null
  purpose: ValuationPurpose

  setField: <K extends keyof WizardInputs>(key: K, value: WizardInputs[K]) => void
  nextStep: () => void
  prevStep: () => void
  goToStep: (step: number) => void
  completeStep: (step: number) => void
  setResult: (result: ValuationResult) => void
  setEmail: (email: string) => void
  setUserName: (name: string) => void
  setUserPhone: (phone: string) => void
  setPurpose: (purpose: ValuationPurpose) => void
  loadSession: (data: { inputs: WizardInputs; result: ValuationResult; email?: string; userName?: string; userPhone?: string }) => void
  reset: () => void
}

export const useValuationStore = create<ValuationStore>()(
  persist(
    (set) => ({
      currentStep: 1,
      highestCompletedStep: 0,
      inputs: { ...DEFAULT_INPUTS },
      result: null,
      email: null,
      userName: null,
      userPhone: null,
      purpose: 'indicative',

      setField: (key, value) =>
        set((state) => ({
          inputs: { ...state.inputs, [key]: value },
        })),

      nextStep: () =>
        set((state) => ({
          currentStep: Math.min(6, state.currentStep + 1),
        })),

      prevStep: () =>
        set((state) => ({
          currentStep: Math.max(1, state.currentStep - 1),
        })),

      goToStep: (step) =>
        set({ currentStep: Math.max(1, Math.min(6, step)) }),

      completeStep: (step) =>
        set((state) => ({
          highestCompletedStep: Math.max(state.highestCompletedStep, step),
        })),

      setResult: (result) => set({ result }),

      setEmail: (email) => set({ email }),

      setUserName: (name) => set({ userName: name }),

      setUserPhone: (phone) => set({ userPhone: phone }),

      setPurpose: (purpose) => set({ purpose }),
      
      loadSession: (data) =>
        set({
          inputs: data.inputs,
          result: data.result,
          email: data.email || null,
          userName: data.userName || null,
          userPhone: data.userPhone || null,
          currentStep: 6,
          highestCompletedStep: 6,
        }),

      reset: () =>
        set({
          currentStep: 1,
          highestCompletedStep: 0,
          inputs: { ...DEFAULT_INPUTS },
          result: null,
          email: null,
          userName: null,
          userPhone: null,
          purpose: 'indicative',
        }),
    }),
    {
      name: 'fus-valuation-store',
      version: 3,
      migrate: (persisted, version) => {
        const state = persisted as Partial<ValuationStore>
        if (version < 2) {
          state.purpose = 'indicative'
        }
        if (version < 3) {
          // Clear stale wizard inputs from previous sessions
          state.inputs = { ...DEFAULT_INPUTS }
          state.currentStep = 1
          state.highestCompletedStep = 0
        }
        return state as ValuationStore
      },
    }
  )
)
