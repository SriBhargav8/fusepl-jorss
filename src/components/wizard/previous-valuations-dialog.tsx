'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Search, Loader2, ArrowRight, Calendar, Building2, History as HistoryIcon } from 'lucide-react'
import { getValuationHistory, getValuationById } from '@/app/actions/valuation'
import { useValuationStore } from '@/stores/valuation-store'
import { motion, AnimatePresence } from 'framer-motion'
import { normalizePhone } from '@/lib/utils'
import Link from 'next/link'

interface PreviousValuationsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PreviousValuationsDialog({ open, onOpenChange }: PreviousValuationsDialogProps) {
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [records, setRecords] = useState<any[] | null>(null)

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !phone) return
    
    setLoading(true)
    setError(null)
    
    const normalizedPhone = normalizePhone(phone)
    
    try {
      const result = await getValuationHistory(email, normalizedPhone)
      if (result.success) {
        setRecords(result.records || [])
      } else {
        setError(result.error || 'No records found.')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setEmail('')
    setPhone('')
    setRecords(null)
    setError(null)
  }

  return (
    <Dialog open={open} onOpenChange={(val) => {
      onOpenChange(val)
      if (!val) setTimeout(reset, 300)
    }}>
      <DialogContent className="sm:max-w-[460px] p-0 overflow-hidden bg-[oklch(0.99_0.002_260)] border-[oklch(0.91_0.005_260)]">
        <div className="relative p-6 space-y-6">
          {/* Ambient Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[200px] bg-gradient-to-b from-[oklch(0.62_0.22_330/0.05)] to-transparent pointer-events-none" />

          <DialogHeader className="relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-[oklch(0.15_0.02_260)] flex items-center justify-center mb-4 shadow-xl shadow-[oklch(0.15_0.02_260/0.1)]">
              <HistoryIcon className="w-6 h-6 text-white" />
            </div>
            <DialogTitle className="text-2xl font-heading text-[oklch(0.15_0.02_260)]">Previous Valuations</DialogTitle>
            <DialogDescription className="text-sm text-[oklch(0.45_0.01_260)]">
              Enter the email and phone number you used for previous valuations to securely access your history.
            </DialogDescription>
          </DialogHeader>

          <AnimatePresence mode="wait">
            {!records ? (
              <motion.form
                key="verify-form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleVerify}
                className="space-y-4 relative z-10"
              >
                <div className="space-y-2">
                  <Label htmlFor="hist-email" className="text-[10px] font-bold uppercase tracking-widest text-[oklch(0.45_0.01_260)]">Work Email</Label>
                  <Input
                    id="hist-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="h-11 bg-white border-[oklch(0.91_0.005_260)] placeholder:text-[oklch(0.45_0.01_260/0.4)]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hist-phone" className="text-[10px] font-bold uppercase tracking-widest text-[oklch(0.45_0.01_260)]">Phone Number</Label>
                  <Input
                    id="hist-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="10-Digit Mobile Number"
                    className="h-11 bg-white border-[oklch(0.91_0.005_260)] placeholder:text-[oklch(0.45_0.01_260/0.4)]"
                  />
                </div>

                {error && (
                  <p className="text-xs font-medium text-red-500 bg-red-50 p-3 rounded-lg border border-red-100 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    {error}
                  </p>
                )}

                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full h-12 bg-[oklch(0.15_0.02_260)] hover:bg-[oklch(0.05_0.02_260)] text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-[oklch(0.15_0.02_260/0.2)]"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Search className="w-4 h-4 mr-2" />}
                  Verify & Access Records
                </Button>
              </motion.form>
            ) : (
              <motion.div
                key="records-list"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4 relative z-10"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[oklch(0.45_0.01_260)]">Matched Records ({records.length})</span>
                  <button onClick={() => setRecords(null)} className="text-[10px] font-bold text-[oklch(0.62_0.22_330)] uppercase">Change Details</button>
                </div>

                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                  {records.length > 0 ? records.map((record) => (
                    <button
                      key={record.id}
                      disabled={loading}
                      onClick={async () => {
                        setLoading(true)
                        try {
                          const fullData = await getValuationHistory(email, normalizePhone(phone))
                          // Actually we need getValuationById for full data
                          const detail = await getValuationById(record.id)
                          if (detail) {
                            useValuationStore.getState().loadSession({
                              inputs: {
                                company_name: detail.company_name || '',
                                sector: (detail.sector as any) || 'saas_horizontal',
                                stage: (detail.stage as any) || 'seed',
                                business_model: (detail.business_model as any) || 'saas_subscription',
                                city: detail.city || '',
                                founding_year: Number(detail.founding_year) || new Date().getFullYear() - 1,
                                team_size: Number(detail.team_size) || 1,
                                founder_experience: Number(detail.founder_experience) || 1,
                                domain_expertise: Number(detail.domain_expertise) || 1,
                                previous_exits: !!detail.previous_exits,
                                technical_cofounder: false, 
                                key_hires: [],
                                annual_revenue: Number(detail.annual_revenue) || 0,
                                revenue_growth_pct: Number(detail.revenue_growth_pct) || 0,
                                gross_margin_pct: Number(detail.gross_margin_pct) || 0,
                                monthly_burn: Number(detail.monthly_burn) || 0,
                                cash_in_bank: Number(detail.cash_in_bank) || 0,
                                cac: null,
                                ltv: null,
                                last_round_size: null,
                                last_round_valuation: null,
                                tam: Number(detail.tam) || 1000,
                                dev_stage: (detail.dev_stage as any) || 'idea',
                                competition_level: Number(detail.competition_level) || 3,
                                competitive_advantages: (detail.competitive_advantages as any) || [],
                                patents_count: 0,
                                strategic_partnerships: 'none',
                                regulatory_risk: 3,
                                revenue_concentration_pct: null,
                                international_revenue_pct: 0,
                                esop_pool_pct: detail.esop_pool_pct ? Number(detail.esop_pool_pct) : null,
                                time_to_liquidity_years: Number(detail.time_to_liquidity_years) || 4,
                                current_cap_table: (detail.current_cap_table as any) || null,
                                target_raise: detail.target_raise ? Number(detail.target_raise) : null,
                                expected_dilution_pct: null,
                              },
                              result: {
                                composite_value: Number(detail.valuation_mid),
                                composite_low: Number(detail.valuation_low),
                                composite_high: Number(detail.valuation_high),
                                confidence_score: Number(detail.confidence_score),
                                methods: detail.method_results as any,
                                monte_carlo: detail.monte_carlo_percentiles as any,
                                ibc_recovery_range: detail.ibc_recovery_range as any,
                              },
                              email: detail.userEmail || email,
                              userName: detail.userName || undefined,
                              userPhone: detail.userPhone || phone,
                            })
                            onOpenChange(false)
                            // If we're not on /valuation, redirect there
                            if (window.location.pathname !== '/valuation') {
                              window.location.href = '/valuation'
                            }
                          }
                        } catch (err) {
                          console.error(err)
                        } finally {
                          setLoading(false)
                        }
                      }}
                      className="w-full text-left group block glass-card grain p-4 rounded-xl border border-[oklch(0.91_0.005_260)] hover:border-[oklch(0.62_0.22_330/0.5)] hover:bg-[oklch(0.62_0.22_330/0.02)] transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Building2 className="w-3 h-3 text-[oklch(0.15_0.02_260)]" />
                            <h4 className="font-heading text-sm text-[oklch(0.15_0.02_260)] font-bold">{record.companyName || 'Unnamed Venture'}</h4>
                          </div>
                          <div className="flex items-center gap-3 text-[10px] text-[oklch(0.45_0.01_260)]">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-2.5 h-2.5" />
                              {new Date(record.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-[oklch(0.91_0.005_260)]" />
                            <span>{record.stage?.replace('_', ' ')}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold text-[oklch(0.62_0.22_330)]">₹{(Number(record.valuationMid) / 10000000).toFixed(1)} Cr</p>
                          <ArrowRight className="w-3 h-3 ml-auto mt-1 text-[oklch(0.45_0.01_260)] group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </button>
                  )) : (
                    <div className="py-12 text-center space-y-3 bg-[oklch(0.15_0.02_260/0.02)] rounded-2xl border border-dashed border-[oklch(0.91_0.005_260)]">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mx-auto shadow-sm">
                        <Search className="w-5 h-5 text-[oklch(0.45_0.01_260)] opacity-40" />
                      </div>
                      <p className="text-xs text-[oklch(0.45_0.01_260)] font-medium">No valuations found for this account.</p>
                      <Button variant="outline" size="sm" onClick={() => setRecords(null)}>Try Different Email</Button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  )
}
