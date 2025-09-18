import { type NextRequest, NextResponse } from "next/server"
import { executeQuery, executeUpdate, testConnection } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get("categoryId")

    const isConnected = await testConnection()
    if (!isConnected) {
      throw new Error("Database connection failed")
    }

    let query = `
      SELECT 
        id, 
        category_id, 
        name, 
        slug, 
        description, 
        image_url, 
        count, 
        active, 
        available,
        DATE_FORMAT(created_at, '%Y-%m-%d') as created_at,
        DATE_FORMAT(updated_at, '%Y-%m-%d') as updated_at
      FROM subcategories 
    `
    const params: any[] = []

    if (categoryId) {
      query += ` WHERE category_id = ? AND active = TRUE`
      params.push(Number.parseInt(categoryId))
    } else {
      query += ` WHERE active = TRUE`
    }

    query += ` ORDER BY name`

    const subcategories = await executeQuery<any>(query, params)
    console.log("[v0] Subcategories fetched:", subcategories.length)
    console.log("[v0] Sample subcategory:", subcategories[0])
    return NextResponse.json(subcategories)
  } catch (error) {
    console.error("Error fetching subcategories:", error)
    return NextResponse.json({ error: "Failed to fetch subcategories" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const subcategory = await request.json()
    console.log("[v0] Creating standalone subcategory:", subcategory)

    const categoryId = Number.parseInt(subcategory.categoryId)
    if (isNaN(categoryId) || categoryId <= 0) {
      return NextResponse.json({ error: "Valid category ID is required" }, { status: 400 })
    }

    const result = await executeUpdate(
      `
      INSERT INTO subcategories (category_id, name, slug, description, image_url, count, active, available)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        categoryId,
        subcategory.name || subcategory.title, // Support both for compatibility
        subcategory.slug || (subcategory.name || subcategory.title)?.toLowerCase().replace(/\s+/g, "-"),
        subcategory.description,
        subcategory.image || null,
        subcategory.count || 0,
        subcategory.active !== false,
        subcategory.available !== false,
      ],
    )

    const subcategoryId = result.insertId
    console.log("[v0] Standalone subcategory created successfully:", subcategoryId)
    return NextResponse.json({ success: true, id: subcategoryId })
  } catch (error) {
    console.error("Error creating subcategory:", error)
    return NextResponse.json({ error: "Failed to create subcategory", details: error.message }, { status: 500 })
  }
}
