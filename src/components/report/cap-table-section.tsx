'use client'

import { useState } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { simulateRound } from '@/lib/calculators/cap-table'
import { formatINR } from '@/lib/utils'
import type { CapTableEntry } from '@/types'

const COLORS = ['#2563eb', '#16a34a', '#d97706', '#9333ea', '#ef4444', '#06b6d4', '#f43f5e', '#84cc16', '#a855f7', '#f59e0b']

interface Props {
  valuation: {
    targetRaise: number | null
    esopPoolPct: number | null
    currentCapTable: CapTableEntry[] | null
  }
  compositeValue: number
}

export function CapTableSection({ valuation, compositeValue }: Props) {
  const [raiseAmount, setRaiseAmount] = useState(Number(valuation.targetRaise) ?? compositeValue * 0.2)
  const [preMoney, setPreMoney] = useState(compositeValue)
  const [esopTiming, setEsopTiming] = useState<'pre_round' | 'post_round'>('pre_round')

  const currentCapTable: CapTableEntry[] = valuation.currentCapTable ?? [
    { name: 'Founders', percentage: 80, share_class: 'common' },
    { name: 'ESOP Pool', percentage: 10, share_class: 'esop' },
    { name: 'Angel Investors', percentage: 10, share_class: 'preference' },
  ]

  const esopExpansion = Number(valuation.esopPoolPct) ?? 0
  const roundResult = simulateRound(currentCapTable, {
    raise_amount: raiseAmount,
    pre_money: preMoney,
    esop_expansion_pct: esopExpansion,
    esop_timing: esopTiming,
  })

  const preData = currentCapTable.map((e, i) => ({
    name: e.name,
    value: e.percentage,
    fill: COLORS[i % COLORS.length],
  }))

  const postData = roundResult.shareholders.map((e, i) => ({
    name: e.name,
    value: parseFloat(e.percentage.toFixed(1)),
    fill: COLORS[i % COLORS.length],
  }))

  return (
    <div className="glass-card grain relative rounded-xl p-6 h-full flex flex-col" 
      style={{ 
        borderColor: 'oklch(0.91 0.005 260 / 0.8)', 
        background: 'linear-gradient(135deg, oklch(0.99 0.002 260), oklch(0.985 0.002 260))' 
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="space-y-0.5">
          <h3 className="text-sm font-bold uppercase tracking-widest text-[oklch(0.45_0.01_260)]">Cap Table Simulator</h3>
          <p className="text-[10px] text-[oklch(0.50 0.01 260)]">Round Modeling & Dilution</p>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-[oklch(0.62_0.22_330/0.1)] text-[9px] font-bold text-[oklch(0.62_0.22_330)] uppercase">Simulation</span>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold uppercase text-[oklch(0.45_0.01_260)]">Raise Amount (₹)</Label>
            <Input
              type="number"
              value={raiseAmount}
              onChange={(e) => setRaiseAmount(parseFloat(e.target.value) || 0)}
              className="h-8 bg-white/50 border-[oklch(0.91_0.005_260/0.6)] text-[oklch(0.15_0.02_260)] font-mono text-xs rounded-lg focus-visible:ring-0"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold uppercase text-[oklch(0.45_0.01_260)]">Pre-Money (₹)</Label>
            <Input
              type="number"
              value={preMoney}
              onChange={(e) => setPreMoney(parseFloat(e.target.value) || 0)}
              className="h-8 bg-white/50 border-[oklch(0.91_0.005_260/0.6)] text-[oklch(0.15_0.02_260)] font-mono text-xs rounded-lg focus-visible:ring-0"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] font-bold uppercase text-[oklch(0.45_0.01_260)]">ESOP Timing</Label>
          <RadioGroup value={esopTiming} onValueChange={(v) => setEsopTiming(v as 'pre_round' | 'post_round')} className="flex gap-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="pre_round" id="esop-pre" />
              <Label htmlFor="esop-pre" className="text-[10px] font-medium text-[oklch(0.45_0.01_260)]">Pre-round</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="post_round" id="esop-post" />
              <Label htmlFor="esop-post" className="text-[10px] font-medium text-[oklch(0.45_0.01_260)]">Post-round</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-2 rounded-xl bg-white/30 border border-[oklch(0.91_0.005_260/0.4)]">
            <p className="text-[9px] font-bold uppercase text-center text-[oklch(0.45_0.01_260)] mb-1">Pre-Round</p>
            <div className="h-[120px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={preData} cx="50%" cy="50%" innerRadius={35} outerRadius={50} dataKey="value">
                    {preData.map((e) => <Cell key={e.name} fill={e.fill} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="p-2 rounded-xl bg-white/30 border border-[oklch(0.91_0.005_260/0.4)]">
            <p className="text-[9px] font-bold uppercase text-center text-[oklch(0.45_0.01_260)] mb-1">Post-Round</p>
            <div className="h-[120px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={postData} cx="50%" cy="50%" innerRadius={35} outerRadius={50} dataKey="value">
                    {postData.map((e) => <Cell key={e.name} fill={e.fill} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-[oklch(0.91_0.005_260/0.4)] text-center space-y-1">
          <p className="text-[10px] font-bold text-[oklch(0.15_0.02_260)]">
            Post-money: <span className="font-mono">{formatINR(preMoney + raiseAmount)}</span>
          </p>
          <p className="text-[9px] text-[oklch(0.45_0.01_260)] uppercase tracking-widest font-medium">
            New investor: <span className="font-bold text-[oklch(0.65_0.18_160)]">{((raiseAmount / (preMoney + raiseAmount)) * 100).toFixed(1)}% stake</span>
          </p>
        </div>
      </div>
    </div>
  )
}
