'use client'

import React from 'react'
import { Button } from '@/components/ui/button'

interface Props {
  children: React.ReactNode
  fallbackTitle?: string
  fallbackMessage?: string
}

interface State {
  hasError: boolean
  error: Error | null
}

/**
 * React error boundary — must be a class component.
 * React requires `static getDerivedStateFromError` and `componentDidCatch`
 * for error boundaries; functional components cannot catch render errors.
 */
export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-8 text-center space-y-4">
          <h2 className="text-lg font-semibold text-white">
            {this.props.fallbackTitle ?? 'Something went wrong'}
          </h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            {this.props.fallbackMessage ??
              'An unexpected error occurred. Please try again.'}
          </p>
          {this.state.error && (
            <details className="text-xs text-slate-600 mt-2">
              <summary className="cursor-pointer hover:text-slate-400">Error details</summary>
              <pre className="mt-2 text-left bg-slate-900 p-3 rounded overflow-x-auto">
                {this.state.error.message}
              </pre>
            </details>
          )}
          <Button
            onClick={this.handleReset}
            className="bg-amber-500 hover:bg-amber-600 text-slate-900"
          >
            Try Again
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}
