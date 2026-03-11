'use client'

import { useValuationStore } from '@/stores/valuation-store'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DEFAULT_ESOP_PCT } from '@/lib/constants'

export function ESOPCapTableStep() {
  const { inputs, setField } = useValuationStore()
  const defaultEsop = DEFAULT_ESOP_PCT[inputs.stage] ?? 10

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">ESOP & Cap Table</h2>
        <p className="text-slate-400 text-sm">Employee stock options and ownership structure (all fields optional)</p>
      </div>

      <div className="space-y-5">
        <div>
          <Label className="text-slate-300">ESOP Pool (%)</Label>
          <p className="text-xs text-slate-500 mb-1">
            Default for {inputs.stage.replace('_', ' ')} stage: {defaultEsop}%
          </p>
          <Input
            type="number"
            value={inputs.esop_pool_pct ?? ''}
            onChange={(e) => setField('esop_pool_pct', e.target.value === '' ? null : parseFloat(e.target.value))}
            min={0}
            max={30}
            placeholder={String(defaultEsop)}
            className="bg-slate-800 border-slate-700 text-white mt-1 w-32"
          />
        </div>

        <div>
          <Label className="text-slate-300">Time to Liquidity (years)</Label>
          <p className="text-xs text-slate-500 mb-1">Expected years until exit/IPO</p>
          <Input
            type="number"
            value={inputs.time_to_liquidity_years ?? ''}
            onChange={(e) => setField('time_to_liquidity_years', e.target.value === '' ? null : parseInt(e.target.value))}
            min={1}
            max={15}
            placeholder="4"
            className="bg-slate-800 border-slate-700 text-white mt-1 w-32"
          />
        </div>

        <div className="border-t border-slate-800 pt-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm text-slate-400">Current Cap Table (optional)</p>
              <p className="text-xs text-slate-500">Add up to 10 shareholders. Total should equal 100%.</p>
            </div>
            <button
              onClick={() => {
                const current = inputs.current_cap_table || []
                if (current.length < 10) {
                  setField('current_cap_table', [
                    ...current,
                    { name: '', percentage: 0, share_class: 'common' as const },
                  ])
                }
              }}
              className="text-sm text-amber-400 hover:text-amber-300 px-3 py-1 rounded border border-amber-400/30 hover:border-amber-400/50 transition-colors"
            >
              + Add Row
            </button>
          </div>

          {inputs.current_cap_table && inputs.current_cap_table.length > 0 ? (
            <div className="space-y-2">
              <div className="grid grid-cols-12 gap-2 text-xs text-slate-500 font-medium px-1">
                <span className="col-span-5">Name</span>
                <span className="col-span-3">Ownership %</span>
                <span className="col-span-3">Class</span>
                <span className="col-span-1"></span>
              </div>
              {inputs.current_cap_table.map((entry, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                  <Input
                    value={entry.name}
                    onChange={(e) => {
                      const updated = [...inputs.current_cap_table!]
                      updated[idx] = { ...updated[idx], name: e.target.value }
                      setField('current_cap_table', updated)
                    }}
                    placeholder="Shareholder name"
                    className="col-span-5 bg-slate-800 border-slate-700 text-white text-sm h-9"
                  />
                  <Input
                    type="number"
                    value={entry.percentage}
                    onChange={(e) => {
                      const updated = [...inputs.current_cap_table!]
                      updated[idx] = { ...updated[idx], percentage: parseFloat(e.target.value) || 0 }
                      setField('current_cap_table', updated)
                    }}
                    min={0}
                    max={100}
                    className="col-span-3 bg-slate-800 border-slate-700 text-white text-sm h-9"
                  />
                  <select
                    value={entry.share_class}
                    onChange={(e) => {
                      const updated = [...inputs.current_cap_table!]
                      updated[idx] = { ...updated[idx], share_class: e.target.value as any }
                      setField('current_cap_table', updated)
                    }}
                    className="col-span-3 bg-slate-800 border-slate-700 text-white text-sm h-9 rounded-md px-2"
                  >
                    <option value="common">Common</option>
                    <option value="preference">Preference</option>
                    <option value="esop">ESOP</option>
                  </select>
                  <button
                    onClick={() => {
                      const updated = inputs.current_cap_table!.filter((_, i) => i !== idx)
                      setField('current_cap_table', updated.length > 0 ? updated : null)
                    }}
                    className="col-span-1 text-red-400 hover:text-red-300 text-sm"
                  >
                    ×
                  </button>
                </div>
              ))}
              <p className="text-xs text-slate-500 mt-2">
                Total: {inputs.current_cap_table.reduce((s, e) => s + e.percentage, 0).toFixed(1)}%
              </p>
            </div>
          ) : (
            <p className="text-sm text-slate-600 italic">No cap table entries. Click &quot;+ Add Row&quot; to start.</p>
          )}
        </div>
      </div>
    </div>
  )
}
