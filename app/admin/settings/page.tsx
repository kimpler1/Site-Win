"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AdminAuthGuard } from "@/components/admin-auth-guard"
import { useRouter } from "next/navigation"

function SettingsPageContent() {
  const router = useRouter()
  const [settings, setSettings] = useState({
    siteName: "Arlekino Costume Rental",
    siteDescription: "Прокат костюмов для любых мероприятий",
    contactEmail: "info@arlekino.ru",
    contactPhone: "+7 (999) 123-45-67",
    address: "г. Москва, ул. Примерная, д. 123",
    workingHours: "Пн-Пт: 10:00-19:00, Сб-Вс: 11:00-17:00",
  })

  const handleSave = () => {
    // Здесь будет логика сохранения настроек
    alert("Настройки сохранены!")
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
              <p className="text-sm text-muted-foreground">Настройки системы</p>
            </div>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <Button variant="outline" asChild>
              <Link href="/">Вернуться на сайт</Link>
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                localStorage.removeItem("adminToken")
                router.push("/admin/login")
              }}
            >
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
              className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-sidebar-primary/10 text-sidebar-foreground"
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
              className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"
            >
              <span>⚙️</span>
              <span>Настройки</span>
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-foreground">Настройки</h2>
            <p className="text-muted-foreground">Управление основными настройками сайта</p>
          </div>

          <div className="grid gap-6">
            {/* Основная информация */}
            <Card>
              <CardHeader>
                <CardTitle>Основная информация</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="siteName">Название сайта</Label>
                    <Input
                      id="siteName"
                      value={settings.siteName}
                      onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactEmail">Email для связи</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={settings.contactEmail}
                      onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="siteDescription">Описание сайта</Label>
                  <Textarea
                    id="siteDescription"
                    value={settings.siteDescription}
                    onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Контактная информация */}
            <Card>
              <CardHeader>
                <CardTitle>Контактная информация</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contactPhone">Телефон</Label>
                    <Input
                      id="contactPhone"
                      value={settings.contactPhone}
                      onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="workingHours">Часы работы</Label>
                    <Input
                      id="workingHours"
                      value={settings.workingHours}
                      onChange={(e) => setSettings({ ...settings, workingHours: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="address">Адрес</Label>
                  <Input
                    id="address"
                    value={settings.address}
                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Кнопки действий */}
            <div className="flex justify-end space-x-4">
              <Button variant="outline" asChild>
                <Link href="/admin">Отмена</Link>
              </Button>
              <Button onClick={handleSave}>Сохранить настройки</Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default function SettingsPage() {
  return (
    <AdminAuthGuard>
      <SettingsPageContent />
    </AdminAuthGuard>
  )
}
