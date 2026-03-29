'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Send, 
  MessageCircle, 
  LineChart, 
  ArrowRight,
  Loader2,
  CheckCircle2,
  Clock
} from 'lucide-react'
import { 
  Dialog, 
  DialogContent,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { saveLead } from '@/app/actions/leads'
import { toast } from 'sonner'
import Link from 'next/link'

interface LeadCaptureModalProps {
  isOpen: boolean
  onClose: () => void
}

export function LeadCaptureModal({ isOpen, onClose }: LeadCaptureModalProps) {
  const [step, setStep] = useState<'form' | 'success'>('form')
  const [loading, setLoading] = useState(false)
  const [timer, setTimer] = useState(5)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    companyName: ''
  })

  // WhatsApp Pre-fill Logic
  const waMessage = `Hey My Name is ${formData.name}, Representing ${formData.companyName} we are looking for support on valuation and related services.`
  const waUrl = `https://wa.me/919667744073?text=${encodeURIComponent(waMessage)}`

  // Reset modal state on open
  useEffect(() => {
    if (isOpen) {
      setStep('form')
      setTimer(5)
    }
  }, [isOpen])

  // Countdown timer logic
  useEffect(() => {
    if (step === 'success' && timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1)
      }, 1000)
      return () => clearInterval(interval)
    } else if (step === 'success' && timer === 0) {
      window.open(waUrl, '_blank')
    }
  }, [step, timer, waUrl])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const result = await saveLead(formData)
      if (result.success) {
        setStep('success')
        toast.success("Details saved! Connecting you to an expert...")
      } else {
        toast.error(result.error || "Something went wrong")
      }
    } catch (error) {
      toast.error("Failed to submit. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md p-0 overflow-hidden border-none bg-transparent shadow-none">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="relative bg-white rounded-2xl overflow-hidden shadow-2xl"
        >
          {/* Header Accent */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 via-[oklch(0.62_0.22_330)] to-emerald-400" />
          
          <div className="p-8">
            <AnimatePresence mode="wait">
              {step === 'form' ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <h2 className="text-2xl font-heading text-[oklch(0.15_0.02_260)]">Book Your Review</h2>
                    <p className="text-sm text-[oklch(0.45_0.01_260)]">
                      Fill in your details and our expert will reach out to you within 24 hours.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-[10px] font-bold uppercase tracking-wider text-[oklch(0.5_0.01_260)]">Full Name</Label>
                        <Input 
                          id="name" 
                          placeholder="John Doe" 
                          required 
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="rounded-xl border-[oklch(0.91_0.005_260)] focus:ring-[oklch(0.62_0.22_330/0.2)]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company" className="text-[10px] font-bold uppercase tracking-wider text-[oklch(0.5_0.01_260)]">Company Name</Label>
                        <Input 
                          id="company" 
                          placeholder="Unicorn Inc." 
                          required 
                          value={formData.companyName}
                          onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                          className="rounded-xl border-[oklch(0.91_0.005_260)] focus:ring-[oklch(0.62_0.22_330/0.2)]"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-wider text-[oklch(0.5_0.01_260)]">Email Address</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="john@example.com" 
                        required 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="rounded-xl border-[oklch(0.91_0.005_260)] focus:ring-[oklch(0.62_0.22_330/0.2)]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-[10px] font-bold uppercase tracking-wider text-[oklch(0.5_0.01_260)]">Phone Number</Label>
                      <Input 
                        id="phone" 
                        type="tel" 
                        placeholder="+91 98765 43210" 
                        required 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="rounded-xl border-[oklch(0.91_0.005_260)] focus:ring-[oklch(0.62_0.22_330/0.2)]"
                      />
                    </div>

                    <Button 
                      type="submit" 
                      disabled={loading}
                      className="w-full h-12 bg-[oklch(0.15_0.02_260)] hover:bg-black text-white rounded-xl font-bold shadow-lg shadow-black/10 transition-all hover:scale-[1.02]"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          Submit & Request Review
                          <Send className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center space-y-8 py-4"
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100 mb-2">
                      <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-2xl font-heading text-[oklch(0.15_0.02_260)]">Successfully Saved!</h2>
                      <p className="text-sm text-[oklch(0.45_0.01_260)] px-6">
                        Your details are secured. We are redirecting you to WhatsApp for a quick chat.
                      </p>
                    </div>
                  </div>

                  {/* Redirection Options */}
                  <div className="grid grid-cols-1 gap-3 px-4">
                    <Link 
                      href={waUrl}
                      target="_blank"
                      className="group flex items-center justify-between p-4 rounded-2xl bg-emerald-50 border border-emerald-100 hover:bg-emerald-500 hover:text-white transition-all duration-300"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                          <MessageCircle className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                          <span className="block text-xs font-bold uppercase tracking-wider opacity-60">Connect Now</span>
                          <span className="font-bold text-sm">Expert on WhatsApp</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <ArrowRight className="w-5 h-5" />
                        <span className="text-[9px] font-bold uppercase tracking-tighter opacity-80 flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          {timer}s Auto
                        </span>
                      </div>
                    </Link>

                    <Link 
                      href="/valuation"
                      onClick={onClose}
                      className="group flex items-center justify-between p-4 rounded-2xl bg-[oklch(0.96_0.02_260)] border border-[oklch(0.91_0.005_260)] hover:bg-[oklch(0.15_0.02_260)] hover:text-white transition-all duration-300"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[oklch(0.62_0.22_330)] group-hover:scale-110 transition-transform">
                          <LineChart className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                          <span className="block text-xs font-bold uppercase tracking-wider opacity-60">Try Tool</span>
                          <span className="font-bold text-sm">Instant Valuation</span>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>

                  {/* Progress bar for timer */}
                  <div className="w-full h-1 bg-emerald-100 overflow-hidden">
                    <motion.div 
                      initial={{ width: "100%" }}
                      animate={{ width: "0%" }}
                      transition={{ duration: 5, ease: "linear" }}
                      className="h-full bg-emerald-500"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
