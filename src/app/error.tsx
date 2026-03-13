'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main className="min-h-[calc(100vh-3.5rem)] bg-[oklch(0.985 0.002 260)] flex items-center justify-center px-6">
      <div className="text-center">
        <p className="text-[11px] font-semibold text-[oklch(0.62_0.18_25)] uppercase tracking-[0.2em] mb-4">
          Error
        </p>
        <h1 className="font-heading text-3xl text-[oklch(0.15 0.02 260)] mb-4">
          Something Went Wrong
        </h1>
        <p className="text-sm text-[oklch(0.45_0.01_260)] mb-2 max-w-sm mx-auto">
          An unexpected error occurred. Please try again.
        </p>
        {error.digest && (
          <p className="text-[10px] text-[oklch(0.50 0.01 260)] mb-6 font-mono">
            Error ID: {error.digest}
          </p>
        )}
        <button
          onClick={reset}
          className="inline-flex items-center justify-center h-10 px-6 text-sm font-semibold bg-[#32373c] text-white rounded-lg transition-all hover:bg-[#1d2024]"
        >
          Try Again
        </button>
      </div>
    </main>
  )
}
