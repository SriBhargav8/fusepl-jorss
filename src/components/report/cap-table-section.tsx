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
    target_raise: number | null
    esop_pool_pct: number | null
    current_cap_table: CapTableEntry[] | null
  }
  compositeValue: number
}

export function CapTableSection({ valuation, compositeValue }: Props) {
  const [raiseAmount, setRaiseAmount] = useState(valuation.target_raise ?? compositeValue * 0.2)
  const [preMoney, setPreMoney] = useState(compositeValue)
  const [esopTiming, setEsopTiming] = useState<'pre_round' | 'post_round'>('pre_round')

  const currentCapTable: CapTableEntry[] = valuation.current_cap_table ?? [
    { name: 'Founders', percentage: 80, share_class: 'common' },
    { name: 'ESOP Pool', percentage: 10, share_class: 'esop' },
    { name: 'Angel Investors', percentage: 10, share_class: 'preference' },
  ]

  const esopExpansion = valuation.esop_pool_pct ?? 0
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
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <CardTitle className="text-white">Cap Table Simulator</CardTitle>
        <p className="text-sm text-slate-400">Interactive — adjust parameters to model your next round</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-slate-300">Raise Amount (Rs)</Label>
            <Input
              type="number"
              value={raiseAmount}
              onChange={(e) => setRaiseAmount(parseFloat(e.target.value) || 0)}
              className="bg-slate-800 border-slate-700 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-slate-300">Pre-Money Valuation (Rs)</Label>
            <Input
              type="number"
              value={preMoney}
              onChange={(e) => setPreMoney(parseFloat(e.target.value) || 0)}
              className="bg-slate-800 border-slate-700 text-white"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-slate-300">ESOP Pool Creation</Label>
          <RadioGroup value={esopTiming} onValueChange={(v) => setEsopTiming(v as 'pre_round' | 'post_round')}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="pre_round" id="esop-pre" />
              <Label htmlFor="esop-pre" className="text-slate-300">Before round (recommended)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="post_round" id="esop-post" />
              <Label htmlFor="esop-post" className="text-slate-300">After round</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-medium mb-2 text-center text-white">Pre-Round</p>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={preData} cx="50%" cy="50%" outerRadius={80} dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}>
                    {preData.map((e) => <Cell key={e.name} fill={e.fill} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium mb-2 text-center text-white">Post-Round</p>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={postData} cx="50%" cy="50%" outerRadius={80} dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}>
                    {postData.map((e) => <Cell key={e.name} fill={e.fill} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <p className="text-sm text-center text-slate-400">
          Post-money: {formatINR(preMoney + raiseAmount)} | New investor: {((raiseAmount / (preMoney + raiseAmount)) * 100).toFixed(1)}%
        </p>
      </CardContent>
    </Card>
  )
}
