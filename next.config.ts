import type { NextConfig } from "next";

const supabaseUrlConfig = (() => {
  try {
    const urlStr = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!urlStr) return undefined;
    const url = new URL(urlStr);
    return {
      protocol: (url.protocol.replace(":", "") === "https" ? "https" : "http") as "http" | "https",
      hostname: url.hostname,
      port: url.port || "",
    };
  } catch {
    return undefined;
  }
})();

const nextConfig: NextConfig = {
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
              "connect-src 'self' https: http://127.0.0.1:54321 ws://127.0.0.1:54321 http://localhost:54321 ws://localhost:54321",
              "worker-src 'self' blob:",
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
    dangerouslyAllowSVG: true,
    contentDispositionType: 'inline',
    remotePatterns: [
      ...(supabaseUrlConfig
        ? [
            {
              protocol: supabaseUrlConfig.protocol,
              hostname: supabaseUrlConfig.hostname,
              port: supabaseUrlConfig.port,
              pathname: '/storage/v1/object/public/**',
            },
            {
              protocol: supabaseUrlConfig.protocol,
              hostname: supabaseUrlConfig.hostname,
              port: supabaseUrlConfig.port,
              pathname: '/storage/v1/render/image/public/**',
            },
          ]
        : [
            {
              protocol: 'https' as const,
              hostname: '*.supabase.co',
              pathname: '/storage/v1/object/public/**',
            },
            {
              protocol: 'https' as const,
              hostname: '*.supabase.co',
              pathname: '/storage/v1/render/image/public/**',
            },
          ]),
      {
        protocol: 'http' as const,
        hostname: '127.0.0.1',
        port: '54321',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'http' as const,
        hostname: 'localhost',
        port: '54321',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https' as const,
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https' as const,
        hostname: 'plus.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https' as const,
        hostname: 'images.pexels.com',
        port: '',
        pathname: '/**',
      },
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
