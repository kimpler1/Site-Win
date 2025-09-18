"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AuthGuard } from "@/components/admin/auth-guard"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

function SettingsPageContent() {
  const [settings, setSettings] = useState({
    siteName: "Arlekino Costume Rental",
    siteDescription: "Прокат костюмов для любых мероприятий",
    contactEmail: "info@arlekino.ru",
    contactPhone: "+7 (999) 123-45-67",
    address: "г. Москва, ул. Примерная, д. 123",
    workingHours: "Пн-Пт: 10:00-19:00, Сб-Вс: 11:00-17:00",
  })

  const handleSave = () => {
    alert("Настройки сохранены!")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <AdminSidebar />

        <div className="flex-1">
          <AdminHeader title="Настройки" description="Управление основными настройками сайта" />

          <main className="p-6">
            <div className="max-w-4xl">
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
                  <Button variant="outline" onClick={() => window.history.back()}>
                    Отмена
                  </Button>
                  <Button onClick={handleSave} className="bg-orange-500 hover:bg-orange-600">
                    Сохранить настройки
                  </Button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default function SettingsPage() {
  return (
    <AuthGuard>
      <SettingsPageContent />
    </AuthGuard>
  )
}
