"use client"

import * as React from "react"
import { Slider as SliderPrimitive } from "@base-ui/react/slider"

import { cn } from "@/lib/utils"

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: SliderPrimitive.Root.Props) {
  const isDragging = React.useRef(false)
  const [localValue, setLocalValue] = React.useState<number[]>(() => {
    const val = (value as number | number[]) ?? (defaultValue as number | number[]) ?? [min, max]
    return (Array.isArray(val) ? val : [val]).map(v => Number(v) || 0)
  })

  // Sync with prop ONLY when not interacting to prevent "stuck" feeling during drag
  React.useEffect(() => {
    if (value !== undefined && !isDragging.current) {
      const incoming = (Array.isArray(value) ? value : [value]).map(v => Number(v) || 0)
      const matches = incoming.length === localValue.length && 
                      incoming.every((v, i) => v === localValue[i])
      
      if (!matches) {
        setLocalValue(incoming)
      }
    }
  }, [value])

  const _values = React.useMemo(() => localValue, [localValue])

  const handleValueChange = (v: any) => {
    const vals = Array.isArray(v) ? v : [v]
    const sanitized = vals.map(val => Number(val) || 0)
    setLocalValue(sanitized)
    if (props.onValueChange) {
      // @ts-ignore - Base-UI signature mismatch across versions
      props.onValueChange(sanitized)
    }
  }

  return (
    <SliderPrimitive.Root
      {...props}
      className={cn("data-horizontal:w-full data-vertical:h-full relative", className)}
      data-slot="slider"
      value={_values}
      min={min}
      max={max}
      onValueChange={handleValueChange}
      thumbAlignment="edge"
      onPointerDown={() => { isDragging.current = true }}
      onPointerUp={() => { isDragging.current = false }}
      onBlur={() => { isDragging.current = false }}
    >
      <SliderPrimitive.Control className="relative flex w-full touch-none items-center select-none data-disabled:opacity-50 data-vertical:h-full data-vertical:min-h-40 data-vertical:w-auto data-vertical:flex-col">
        <SliderPrimitive.Track
          data-slot="slider-track"
          className="relative grow overflow-hidden rounded-full bg-muted select-none data-horizontal:h-1 data-horizontal:w-full data-vertical:h-full data-vertical:w-1"
        >
          <SliderPrimitive.Indicator
            data-slot="slider-range"
            className="bg-primary select-none data-horizontal:h-full data-vertical:w-full"
          />
        </SliderPrimitive.Track>
        {Array.from({ length: _values.length }, (_, index) => (
          <SliderPrimitive.Thumb
            data-slot="slider-thumb"
            key={index}
            className="relative block size-5 shrink-0 rounded-full border-2 border-primary bg-white ring-ring/50 transition-[color,box-shadow] select-none touch-none after:absolute after:-inset-4 hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden active:ring-4 disabled:pointer-events-none disabled:opacity-50 cursor-grab active:cursor-grabbing"
          />
        ))}
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  )
}

export { Slider }
