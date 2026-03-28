'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { 
  Send, 
  MessageCircle, 
  Phone, 
  Mail, 
  MapPin, 
  CheckCircle2, 
  Loader2,
  ShieldCheck,
  RefreshCw,
  ArrowRight
} from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { saveLead } from '@/app/actions/leads'
import { toast } from 'sonner'

export default function ContactPage() {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  
  // Captcha State
  const [captcha, setCaptcha] = useState({ a: 0, b: 0, result: '' })
  const generateCaptcha = () => {
    const a = Math.floor(Math.random() * 9) + 1
    const b = Math.floor(Math.random() * 9) + 1
    setCaptcha({ a, b, result: '' })
  }

  useEffect(() => {
    generateCaptcha()
  }, [])

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    companyName: '',
    message: '',
    website: '' // Honeypot
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 1. Honeypot check
    if (formData.website) return

    // 2. Captcha check
    if (parseInt(captcha.result) !== (captcha.a + captcha.b)) {
      toast.error('Human verification failed. Please try again.')
      generateCaptcha()
      return
    }

    setLoading(true)
    try {
      const result = await saveLead({
        ...formData,
        source: 'contact_page'
      })

      if (result.success) {
        setSubmitted(true)
        toast.success("Message received. We'll be in touch soon.")
      } else {
        toast.error(result.error || "Submission failed. Please try again.")
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[oklch(0.99_0.001_260)] py-24 sm:py-32 px-6">
      {/* Background Ornaments */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-[oklch(0.62_0.22_330/0.03)] to-transparent" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[oklch(0.62_0.22_330/0.02)] blur-[100px] rounded-full" />
      </div>

      <div className="relative max-w-5xl mx-auto">
        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div 
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="grid lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-20"
            >
              {/* Left Column: Context & Direct Contact */}
              <div className="flex flex-col justify-between py-4">
                <div className="space-y-8">
                  <div>
                    <motion.span 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[oklch(0.62_0.22_330/0.06)] text-[10px] font-bold text-[oklch(0.62_0.22_330)] uppercase tracking-[0.2em] mb-6"
                    >
                      Connect with Experts
                    </motion.span>
                    <div className="flex flex-wrap items-center gap-2 mb-6">
                      <ToolPill href="/valuation" label="Valuation" />
                      <ToolPill href="/deal-check" label="Deal Check" />
                      <ToolPill href="/cap-table" label="Cap Table" />
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-heading text-[oklch(0.15_0.02_260)] leading-[1.1] mb-6">
                      Let&apos;s build <br />
                      <span className="text-gold-gradient italic">Value Together</span>
                    </h1>
                    <p className="text-base text-[oklch(0.40_0.01_260)] max-w-sm leading-relaxed font-medium">
                      Whether you need a formal valuation, fundraising support, or strategic guidance, our team of licensed experts is here for you.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-[11px] font-bold text-[oklch(0.50_0.01_260)] uppercase tracking-[0.15em]">Direct Channels</h3>
                    <div className="grid gap-3">
                      <CompactContactLink 
                        icon={<Mail className="w-3.5 h-3.5" />}
                        label="Support Email"
                        value="info@firstunicornstartup.com"
                        href="mailto:info@firstunicornstartup.com"
                      />
                      <CompactContactLink 
                        icon={<Phone className="w-3.5 h-3.5" />}
                        label="WhatsApp Support"
                        value="+91 96677 44073"
                        href="https://wa.me/919667744073"
                      />
                      <CompactContactLink 
                        icon={<MapPin className="w-3.5 h-3.5" />}
                        label="Headquarters"
                        value="Gurugram, Haryana"
                      />
                    </div>
                  </div>
                </div>

                {/* Proof/Badge Area (Desktop Only) */}
                <div className="hidden lg:block mt-20 p-6 rounded-2xl bg-white border border-[oklch(0.91_0.005_260)] shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[oklch(0.62_0.22_330/0.1)] flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5 text-[oklch(0.62_0.22_330)]" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[oklch(0.15_0.02_260)] uppercase tracking-tight">Institutional Response</p>
                      <p className="text-[11px] text-[oklch(0.45_0.01_260)]">We aim to respond to all inquiries within 24 business hours.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Premium Form */}
              <div className="lg:pt-2">
                <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 sm:p-12 shadow-[0_20px_50px_oklch(0_0_0/0.05)] border border-[oklch(0.91_0.005_260)] relative">
                  {/* Subtle Top Accent */}
                  <div className="absolute top-0 left-12 right-12 h-px bg-gradient-to-r from-transparent via-[oklch(0.62_0.22_330/0.4)] to-transparent" />
                  
                  <div className="space-y-8">
                    <div className="grid sm:grid-cols-2 gap-8">
                      <MinimalInput 
                        label="Full Name" 
                        placeholder="John Doe" 
                        value={formData.name}
                        onChange={(val) => setFormData({...formData, name: val})}
                        required
                      />
                      <MinimalInput 
                        label="Work Email" 
                        placeholder="john@startup.com" 
                        type="email"
                        value={formData.email}
                        onChange={(val) => setFormData({...formData, email: val})}
                        required
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-8">
                      <MinimalInput 
                        label="Company Name" 
                        placeholder="Acme Inc." 
                        value={formData.companyName}
                        onChange={(val) => setFormData({...formData, companyName: val})}
                        required
                      />
                      <MinimalInput 
                        label="Phone Number" 
                        placeholder="+91 987..." 
                        type="tel"
                        value={formData.phone}
                        onChange={(val) => setFormData({...formData, phone: val})}
                        required
                      />
                    </div>

                    <div className="space-y-4">
                      <Label className="text-[10px] font-bold uppercase tracking-wider text-[oklch(0.5_0.01_260)] pl-1">Inquiry Details</Label>
                      <textarea 
                        required 
                        rows={4}
                        placeholder="Briefly describe your requirements..."
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        className="w-full p-5 rounded-2xl bg-[oklch(0.985_0.002_260)] border border-[oklch(0.91_0.005_260/0.5)] focus:outline-none focus:ring-2 focus:ring-[oklch(0.62_0.22_330/0.1)] focus:bg-white transition-all resize-none text-sm placeholder:text-[oklch(0.7_0.01_260)]"
                      />
                    </div>

                    {/* Minimal Captcha */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 rounded-2xl bg-[oklch(0.985_0.002_260)] border border-[oklch(0.91_0.005_260/0.4)]">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="text-[10px] font-bold uppercase tracking-widest text-[oklch(0.4_0.01_260)]">Verification</span>
                        </div>
                        <p className="text-[11px] text-[oklch(0.5_0.01_260)]">Prove you&apos;re human</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2.5 px-4 py-2.5 bg-white rounded-xl border border-[oklch(0.91_0.005_260)] select-none">
                          <span className="font-heading text-base leading-none translate-y-px">{captcha.a}</span>
                          <span className="text-[oklch(0.7_0.01_260)] font-bold text-sm">+</span>
                          <span className="font-heading text-base leading-none translate-y-px">{captcha.b}</span>
                          <span className="text-[oklch(0.7_0.01_260)] font-bold text-sm">=</span>
                        </div>
                        <Input 
                          required 
                          placeholder="?" 
                          value={captcha.result}
                          onChange={(e) => setCaptcha({...captcha, result: e.target.value})}
                          className="w-16 text-center font-bold text-base h-11 rounded-xl border-[oklch(0.91_0.005_260)] focus:ring-[oklch(0.62_0.22_330/0.1)] bg-white"
                        />
                        <button type="button" onClick={generateCaptcha} className="p-2.5 text-[oklch(0.62_0.22_330)] hover:bg-[oklch(0.62_0.22_330/0.05)] rounded-lg transition-all hover:rotate-90">
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      disabled={loading}
                      className="w-full h-14 bg-[#1d2024] hover:bg-black text-white rounded-2xl font-bold text-base shadow-lg transition-all hover:scale-[1.01] active:scale-[0.98]"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          Submit Inquiry
                          <ArrowRight className="w-4 h-4 ml-3" />
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Honeypot */}
                  <input type="text" className="hidden" tabIndex={-1} autoComplete="off" value={formData.website} onChange={(e) => setFormData({...formData, website: e.target.value})} />
                </form>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-xl mx-auto bg-white rounded-[2.5rem] p-12 sm:p-20 text-center shadow-2xl border border-[oklch(0.91_0.005_260)]"
            >
              <div className="w-24 h-24 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100 mx-auto mb-10">
                <CheckCircle2 className="w-12 h-12 text-emerald-500" />
              </div>
              <h2 className="text-4xl font-heading text-[oklch(0.15_0.02_260)] mb-6 tracking-tight">Message Received</h2>
              <p className="text-[oklch(0.40_0.01_260)] text-lg leading-relaxed mb-12 font-medium">
                Our specialists have received your inquiry. We will review your requirements and reach out at <b>{formData.email}</b> within 24 hours.
              </p>
              <Link 
                href="/"
                className={buttonVariants({ variant: 'default', size: 'lg', className: 'btn-press h-14 px-10 rounded-2xl bg-[#1d2024] hover:bg-black font-bold text-sm tracking-wide' })}
              >
                Back to Dashboard
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}

function CompactContactLink({ icon, label, value, href }: { icon: any, label: string, value: string, href?: string }) {
  const content = (
    <div className="group flex items-center gap-4 p-4 rounded-xl border border-[oklch(0.91_0.005_260/0.5)] transition-all hover:bg-white hover:border-[oklch(0.62_0.22_330/0.2)] hover:shadow-sm">
      <div className="w-8 h-8 rounded-lg bg-[oklch(0.985_0.002_260)] flex items-center justify-center text-[oklch(0.62_0.22_330)] group-hover:bg-[oklch(0.62_0.22_330)] group-hover:text-white transition-colors duration-300">
        {icon}
      </div>
      <div>
        <p className="text-[9px] font-bold text-[oklch(0.6_0.01_260)] uppercase tracking-widest leading-none mb-1">{label}</p>
        <p className="text-sm font-semibold text-[oklch(0.25_0.01_260)] leading-tight">{value}</p>
      </div>
    </div>
  )

  if (href) {
    return (
      <a href={href} target={href.startsWith('http') ? '_blank' : undefined} className="block no-underline">
        {content}
      </a>
    )
  }

  return content
}

function ToolPill({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} className="px-2.5 py-1 rounded-md bg-[oklch(0.96_0.005_260)] border border-[oklch(0.91_0.005_260)] text-[10px] font-bold text-[oklch(0.40_0.01_260)] uppercase tracking-wider hover:bg-white hover:border-[oklch(0.62_0.22_330/0.3)] hover:text-[oklch(0.62_0.22_330)] transition-all">
      {label}
    </a>
  )
}

function MinimalInput({ label, placeholder, type = "text", value, onChange, required }: { label: string, placeholder: string, type?: string, value: string, onChange: (val: string) => void, required?: boolean }) {
  return (
    <div className="space-y-3 group">
      <Label className="text-[10px] font-bold uppercase tracking-wider text-[oklch(0.5_0.01_260)] pl-1 transition-colors group-focus-within:text-[oklch(0.62_0.22_330)]">{label}</Label>
      <Input 
        required={required}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-14 rounded-2xl bg-[oklch(0.985_0.002_260)] border border-[oklch(0.91_0.005_260/0.5)] focus:ring-4 focus:ring-[oklch(0.62_0.22_330/0.04)] focus:border-[oklch(0.62_0.22_330/0.3)] focus:bg-white transition-all text-[15px] placeholder:text-[oklch(0.75_0.01_260)]"
      />
    </div>
  )
}
