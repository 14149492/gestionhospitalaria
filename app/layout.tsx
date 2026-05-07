import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"
 
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})
 
export const metadata: Metadata = {
  title: "Sistema de Vacunación PAI",
  description: "Sistema Nacional de Inmunización — Gestión Operativa",
}
 
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}
