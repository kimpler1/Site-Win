"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Простая проверка - в реальном приложении это должно быть через API
    if (email === "admin@arlekino.ru" && password === "admin123") {
      // Сохраняем токен в localStorage
      localStorage.setItem("adminToken", "authenticated")
      router.push("/admin")
    } else {
      setError("Неверный email или пароль")
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-primary-foreground font-bold text-2xl">A</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Arlekino Admin</h1>
          <p className="text-muted-foreground">Вход в панель управления</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Авторизация</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@arlekino.ru"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Пароль</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Введите пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Вход..." : "Войти"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 p-4 bg-muted rounded-lg border">
          <h3 className="text-sm font-medium text-muted-foreground mb-3 text-center">
            Данные для входа в демо-версию:
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Email:</span>
              <code className="bg-background px-2 py-1 rounded text-foreground font-mono">admin@arlekino.ru</code>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Пароль:</span>
              <code className="bg-background px-2 py-1 rounded text-foreground font-mono">admin123</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
