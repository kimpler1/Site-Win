"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { AdminAuthGuard } from "@/components/admin-auth-guard"
import { costumeService } from "@/lib/costumes-data"
import { categoryService } from "@/lib/categories-data"
import { useRouter } from "next/navigation"

function AdminDashboardContent() {
  const router = useRouter()
  const [costumes, setCostumes] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [costumeStats, setCostumeStats] = useState({ children: 0, adults: 0, total: 0 })
  const [isAdultMode, setIsAdultMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("adminAgeMode") === "adult"
    }
    return false
  })

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("costumes")
      localStorage.removeItem("categories")
    }

    setCostumes(costumeService.getAll())
    setCategories(categoryService.getAll())
    setCostumeStats(costumeService.getStatsByAgeCategory())
  }, [])

  const handleAgeModeChange = (checked: boolean) => {
    setIsAdultMode(checked)
    localStorage.setItem("adminAgeMode", checked ? "adult" : "children")
  }

  const handleLogout = () => {
    localStorage.removeItem("adminToken")
    router.push("/admin/login")
  }

  const stats = {
    totalCostumes: costumeStats.total,
    childrenCostumes: costumeStats.children,
    adultsCostumes: costumeStats.adults,
    totalCategories: categories.filter((c) => c.active).length,
    pendingOrders: 8,
    monthlyRevenue: 45600,
    weeklyRevenue: 12400,
    dailyRevenue: 1800,
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="flex h-16 items-center px-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-bold">A</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Arlekino Admin</h1>
              <p className="text-sm text-muted-foreground">Панель управления</p>
            </div>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <Button variant="outline" asChild>
              <Link href="/">Вернуться на сайт</Link>
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              Выйти
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-screen bg-sidebar border-r border-sidebar-border">
          <nav className="p-4 space-y-2">
            <Link
              href="/admin"
              className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"
            >
              <span>📊</span>
              <span>Дашборд</span>
            </Link>
            <Link
              href="/admin/costumes"
              className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-sidebar-primary/10 text-sidebar-foreground"
            >
              <span>👗</span>
              <span>Костюмы</span>
            </Link>
            <Link
              href="/admin/categories"
              className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-sidebar-primary/10 text-sidebar-foreground"
            >
              <span>📂</span>
              <span>Категории</span>
            </Link>
            <Link
              href="/admin/settings"
              className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-sidebar-primary/10 text-sidebar-foreground"
            >
              <span>⚙️</span>
              <span>Настройки</span>
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-foreground">Дашборд</h2>
            <p className="text-muted-foreground">Обзор деятельности костюмерной</p>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Режим работы</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Label htmlFor="age-mode" className="text-sm font-medium">
                  Для детей
                </Label>
                <Switch id="age-mode" checked={isAdultMode} onCheckedChange={handleAgeModeChange} />
                <Label htmlFor="age-mode" className="text-sm font-medium">
                  Для взрослых
                </Label>
              </div>
              <div className="mt-3">
                <p className="text-sm text-muted-foreground">
                  Текущий режим:{" "}
                  <span className="font-medium text-foreground">
                    {isAdultMode ? "Костюмы для взрослых" : "Костюмы для детей"}
                  </span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Все категории, подкатегории и костюмы будут относиться к выбранной возрастной группе
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Всего костюмов</CardTitle>
                  <span className="text-2xl">👗</span>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{stats.totalCostumes}</div>
                  <p className="text-xs text-muted-foreground">В каталоге</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Детские костюмы</CardTitle>
                  <span className="text-2xl">🧒</span>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{stats.childrenCostumes}</div>
                  <p className="text-xs text-muted-foreground">Для детей</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Взрослые костюмы</CardTitle>
                  <span className="text-2xl">👨</span>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{stats.adultsCostumes}</div>
                  <p className="text-xs text-muted-foreground">Для взрослых</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Категории</CardTitle>
                  <span className="text-2xl">📂</span>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{stats.totalCategories}</div>
                  <p className="text-xs text-muted-foreground">Активных</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  return (
    <AdminAuthGuard>
      <AdminDashboardContent />
    </AdminAuthGuard>
  )
}
