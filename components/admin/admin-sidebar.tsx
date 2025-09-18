"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, Package, Tags, Settings } from "lucide-react"

const navigation = [
  { name: "Главная", href: "/admin", icon: Home },
  { name: "Костюмы", href: "/admin/costumes", icon: Package },
  { name: "Категории", href: "/admin/categories", icon: Tags },
  { name: "Настройки", href: "/admin/settings", icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Arlekino</h2>
            <p className="text-sm text-gray-600">Админ-панель</p>
          </div>
        </div>
      </div>

      <nav className="px-3">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive ? "bg-orange-100 text-orange-700" : "text-gray-700 hover:bg-gray-100",
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
