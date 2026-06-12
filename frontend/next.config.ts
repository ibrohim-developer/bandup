import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "bandup-media.fra1.cdn.digitaloceanspaces.com",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    const securityHeaders = [
      { key: "X-DNS-Prefetch-Control", value: "on" },
      {
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains; preload",
      },
      { key: "X-Content-Type-Options", value: "nosniff" },
      {
        key: "Referrer-Policy",
        value: "strict-origin-when-cross-origin",
      },
    ];

    // Content-Security-Policy. Shipped in *Report-Only* mode first: a wrong
    // policy would break real features — opus-recorder needs WASM + web-workers
    // (speaking module), video lessons embed YouTube iframes, and the GA/Meta-
    // Pixel bootstraps are inline scripts. Report-Only logs violations to the
    // browser console without blocking anything.
    //
    // TO ENFORCE: verify in a browser (record a speaking answer, play a video
    // lesson, watch the console for CSP violations), then change the header key
    // below from "Content-Security-Policy-Report-Only" to "Content-Security-Policy".
    const csp = [
      "default-src 'self'",
      // 'unsafe-inline' for the GA/Pixel inline bootstraps; 'wasm-unsafe-eval'
      // for opus-recorder's WASM encoder.
      "script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' https://www.googletagmanager.com https://connect.facebook.net",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "media-src 'self' blob: https:",
      "font-src 'self' data: https:",
      "connect-src 'self' https:",
      "worker-src 'self' blob:",
      "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com",
      // Site is no longer embedded as a Telegram Mini App, so block framing.
      "frame-ancestors 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; ");

    return [
      {
        source: "/api/:path*",
        headers: [
          ...securityHeaders,
          { key: "X-Frame-Options", value: "DENY" },
        ],
      },
      {
        source: "/((?!api).*)",
        headers: [
          ...securityHeaders,
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Content-Security-Policy-Report-Only", value: csp },
        ],
      },
    ];
  },
};

export default nextConfig;
