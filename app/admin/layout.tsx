import type React from "react"
import type { Metadata } from "next"
import { AuthProvider } from "@/lib/contexts/auth-context"

export const metadata: Metadata = {
  title: "Arlekino Admin - Панель управления",
  description: "Административная панель для управления костюмерной Arlekino",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AuthProvider>{children}</AuthProvider>
}
