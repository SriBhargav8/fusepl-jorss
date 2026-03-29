import type { NextConfig } from "next";

// ValuateIN app Vercel deployment URL — update after first deploy
const VALUATEIN_URL = process.env.VALUATEIN_APP_URL || 'https://valuatein-app.vercel.app';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/valuatein',
        destination: `${VALUATEIN_URL}/valuatein`,
      },
      {
        source: '/valuatein/:path*',
        destination: `${VALUATEIN_URL}/valuatein/:path*`,
      },
    ]
  },
};

export default nextConfig;
