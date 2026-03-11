import { Skeleton } from '@/components/ui/skeleton'

export function ValuationSkeleton() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 px-4">
      {/* Reveal card skeleton */}
      <div className="border-2 border-slate-800 rounded-xl p-6 space-y-4">
        <div className="flex flex-col items-center space-y-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-10 w-72" />
          <Skeleton className="h-4 w-56" />
        </div>
      </div>

      {/* Method cards skeleton */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="border border-slate-800 rounded-xl p-6 space-y-3">
          <div className="flex justify-between">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-5 w-24" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function WizardSkeleton() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 px-4">
      {/* Progress bar skeleton */}
      <div className="space-y-3">
        <Skeleton className="h-2 w-full rounded-full" />
        <div className="flex justify-between">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-3 w-16" />
            </div>
          ))}
        </div>
      </div>

      {/* Form skeleton */}
      <div className="border border-slate-800 rounded-2xl p-8 space-y-5">
        <Skeleton className="h-6 w-48" />
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Buttons skeleton */}
      <div className="flex justify-between">
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-28" />
      </div>
    </div>
  )
}

export function ReportSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header skeleton */}
      <div className="border border-slate-800 rounded-lg p-6 space-y-3 text-center">
        <Skeleton className="h-8 w-64 mx-auto" />
        <Skeleton className="h-6 w-48 mx-auto" />
        <Skeleton className="h-4 w-40 mx-auto" />
      </div>

      {/* Section skeletons */}
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="border border-slate-800 rounded-lg p-6 space-y-4">
          <Skeleton className="h-6 w-40" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-5/6" />
          </div>
          {i <= 2 && <Skeleton className="h-32 w-full" />}
        </div>
      ))}
    </div>
  )
}
