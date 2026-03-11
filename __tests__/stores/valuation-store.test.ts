import { describe, it, expect, beforeEach } from 'vitest'
import { useValuationStore } from '@/stores/valuation-store'

describe('useValuationStore', () => {
  beforeEach(() => {
    useValuationStore.getState().reset()
  })

  it('initializes with step 1 and empty inputs', () => {
    const state = useValuationStore.getState()
    expect(state.currentStep).toBe(1)
    expect(state.inputs.company_name).toBe('')
    expect(state.inputs.sector).toBe('saas')
    expect(state.result).toBeNull()
  })

  it('updates inputs via setField', () => {
    useValuationStore.getState().setField('company_name', 'Test Co')
    expect(useValuationStore.getState().inputs.company_name).toBe('Test Co')
  })

  it('navigates steps with nextStep / prevStep', () => {
    useValuationStore.getState().nextStep()
    expect(useValuationStore.getState().currentStep).toBe(2)
    useValuationStore.getState().prevStep()
    expect(useValuationStore.getState().currentStep).toBe(1)
  })

  it('clamps step to 1-6 range', () => {
    useValuationStore.getState().prevStep()
    expect(useValuationStore.getState().currentStep).toBe(1)
    for (let i = 0; i < 10; i++) useValuationStore.getState().nextStep()
    expect(useValuationStore.getState().currentStep).toBe(6)
  })

  it('goToStep navigates directly', () => {
    useValuationStore.getState().goToStep(4)
    expect(useValuationStore.getState().currentStep).toBe(4)
  })

  it('setResult stores valuation result', () => {
    const mockResult = { composite_value: 100_000_000 } as any
    useValuationStore.getState().setResult(mockResult)
    expect(useValuationStore.getState().result).toBeDefined()
    expect(useValuationStore.getState().result?.composite_value).toBe(100_000_000)
  })

  it('reset clears all state', () => {
    useValuationStore.getState().setField('company_name', 'Test')
    useValuationStore.getState().nextStep()
    useValuationStore.getState().reset()
    expect(useValuationStore.getState().currentStep).toBe(1)
    expect(useValuationStore.getState().inputs.company_name).toBe('')
    expect(useValuationStore.getState().result).toBeNull()
  })

  it('tracks highest completed step', () => {
    useValuationStore.getState().completeStep(1)
    useValuationStore.getState().completeStep(2)
    expect(useValuationStore.getState().highestCompletedStep).toBe(2)
  })

  it('sets email via setEmail', () => {
    useValuationStore.getState().setEmail('test@startup.com')
    expect(useValuationStore.getState().email).toBe('test@startup.com')
  })

  it('reset clears email', () => {
    useValuationStore.getState().setEmail('test@startup.com')
    useValuationStore.getState().reset()
    expect(useValuationStore.getState().email).toBeNull()
  })
})
