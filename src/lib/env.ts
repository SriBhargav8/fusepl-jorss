// Server-side environment validation
// Import this in API routes to validate env vars are set

const REQUIRED_SERVER_VARS = [
  'DATABASE_URL',
  'ANTHROPIC_API_KEY',
  'NEXT_PUBLIC_RAZORPAY_KEY_ID',
  'RAZORPAY_KEY_SECRET',
  'RAZORPAY_WEBHOOK_SECRET',
] as const

type EnvKey = (typeof REQUIRED_SERVER_VARS)[number]

function getEnv(key: string): string {
  const value = process.env[key]
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${key}. ` +
      `Check your .env.local file. See .env.example for reference.`
    )
  }
  return value
}

export const env = {
  db: {
    url: () => getEnv('DATABASE_URL'),
  },
  anthropic: {
    apiKey: () => getEnv('ANTHROPIC_API_KEY'),
  },
  razorpay: {
    keyId: () => getEnv('NEXT_PUBLIC_RAZORPAY_KEY_ID'),
    keySecret: () => getEnv('RAZORPAY_KEY_SECRET'),
    webhookSecret: () => getEnv('RAZORPAY_WEBHOOK_SECRET'),
  },
} as const

/** Call at app startup or in API routes to validate all env vars are set */
export function validateEnv(): void {
  const missing: string[] = []
  for (const key of REQUIRED_SERVER_VARS) {
    if (!process.env[key]) {
      missing.push(key)
    }
  }
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missing.map((k) => `  - ${k}`).join('\n')}\n\nCheck your .env.local file. See .env.example for reference.`
    )
  }
}
