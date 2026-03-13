import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-[calc(100vh-3.5rem)] bg-[oklch(0.985 0.002 260)] flex items-center justify-center px-6">
      <div className="text-center">
        <p className="text-[11px] font-semibold text-[oklch(0.62 0.22 330)] uppercase tracking-[0.2em] mb-4">
          404
        </p>
        <h1 className="font-heading text-4xl text-[oklch(0.15 0.02 260)] mb-4">
          Page Not Found
        </h1>
        <p className="text-sm text-[oklch(0.45_0.01_260)] mb-8 max-w-sm mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center h-10 px-6 text-sm font-semibold bg-[#32373c] text-white rounded-lg transition-all hover:bg-[#1d2024]"
          >
            Go Home
          </Link>
          <Link
            href="/valuation"
            className="inline-flex items-center justify-center h-10 px-6 text-sm font-medium border border-[oklch(0.62_0.22_330/0.2)] text-[oklch(0.35_0.01_260)] rounded-lg transition-all hover:border-[oklch(0.62_0.22_330/0.35)] hover:text-[oklch(0.62_0.22_330)]"
          >
            Get Valuation
          </Link>
        </div>
      </div>
    </main>
  )
}
