import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Dominios permitidos para imágenes externas (Supabase Storage)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },

  // Suprimir advertencias de hidratación conocidas en desarrollo
  // (eliminado en Next.js 16, ya no es necesario)

  // Configuración para Vercel: headers de seguridad
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ]
  },
}

export default nextConfig
