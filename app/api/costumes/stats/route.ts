import { NextResponse } from "next/server"
import { executeQuerySingle, testConnection } from "@/lib/database"

export async function GET() {
  try {
    console.log("[v0] Fetching costume stats...")

    const isConnected = await testConnection()
    if (!isConnected) {
      throw new Error("Database connection failed")
    }

    const stats = await executeQuerySingle<any>(`
      SELECT 
        SUM(CASE WHEN age_category = 'children' THEN 1 ELSE 0 END) as children,
        SUM(CASE WHEN age_category = 'adults' THEN 1 ELSE 0 END) as adults,
        COUNT(*) as total
      FROM costumes
    `)

    console.log("[v0] Stats fetched:", stats)
    return NextResponse.json(stats || { children: 0, adults: 0, total: 0 })
  } catch (error) {
    console.error("[v0] Error fetching costume stats:", error)
    return NextResponse.json({ error: "Failed to fetch costume stats", details: error.message }, { status: 500 })
  }
}
