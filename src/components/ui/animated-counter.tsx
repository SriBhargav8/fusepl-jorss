'use client'

import { useEffect, useRef, useState } from 'react'

interface Props {
  value: number
  duration?: number
  className?: string
  formatter: (value: number) => string
}

export function AnimatedCounter({ value, duration = 1500, className = '', formatter }: Props) {
  const [displayValue, setDisplayValue] = useState(0)
  const startTime = useRef<number | null>(null)
  const animationFrame = useRef<number>(0)

  useEffect(() => {
    const startValue = 0
    const endValue = value

    const animate = (timestamp: number) => {
      if (startTime.current === null) startTime.current = timestamp
      const elapsed = timestamp - startTime.current
      const progress = Math.min(elapsed / duration, 1)

      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = startValue + (endValue - startValue) * eased

      setDisplayValue(current)

      if (progress < 1) {
        animationFrame.current = requestAnimationFrame(animate)
      }
    }

    startTime.current = null
    animationFrame.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current)
    }
  }, [value, duration])

  return <span className={className}>{formatter(displayValue)}</span>
}
