import type { NextConfig } from "next";

const supabaseHostname = (() => {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    return url ? new URL(url).hostname : undefined;
  } catch {
    return undefined;
  }
})();

const nextConfig: NextConfig = {
  output: "standalone",
  // Properti lain yang mungkin sudah Anda miliki bisa tetap ada di sini
  // Enforce ESLint during builds
  eslint: {},

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Content-Security-Policy-Report-Only',
            value: [
              "default-src 'self'",
              "img-src 'self' data: blob: https:",
              "style-src 'self' 'unsafe-inline' https:",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https:",
              "connect-src 'self' https:",
              "font-src 'self' https: data:",
              "frame-ancestors 'self'",
              "object-src 'none'",
              "report-uri /api/csp/report",
            ].join('; '),
          },
        ],
      },
    ];
  },

  images: {
    domains: ["tk-aba-mertosanan.sch.id", "images.pexels.com", "placehold.co"],
    remotePatterns: [
      ...(supabaseHostname
        ? [
            {
              protocol: 'https' as const,
              hostname: supabaseHostname,
              port: '',
              pathname: '/storage/v1/object/public/**',
            },
          ]
        : []),
      {
        protocol: 'https' as const,
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
