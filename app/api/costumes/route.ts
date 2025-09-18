import { type NextRequest, NextResponse } from "next/server"
import { executeQuery, executeUpdate, testConnection } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    console.log("[v0] Fetching costumes...")

    const isConnected = await testConnection()
    if (!isConnected) {
      throw new Error("Database connection failed")
    }

    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get("categoryId")
    const subcategoryId = searchParams.get("subcategoryId")
    const ageCategory = searchParams.get("ageCategory")

    let query = `
      SELECT 
        id, 
        title as name, 
        description, 
        price_per_day as price, 
        image_url as image, 
        category_id, 
        subcategory_id, 
        age_category, 
        size, 
        deposit, 
        active, 
        available,
        DATE_FORMAT(created_at, '%Y-%m-%d') as created_at,
        DATE_FORMAT(updated_at, '%Y-%m-%d') as updated_at
      FROM costumes 
      WHERE 1=1
    `
    const params: any[] = []

    if (categoryId) {
      query += ` AND category_id = ?`
      params.push(Number.parseInt(categoryId))
    }

    if (subcategoryId) {
      query += ` AND subcategory_id = ?`
      params.push(Number.parseInt(subcategoryId))
    }

    if (ageCategory) {
      query += ` AND age_category = ?`
      params.push(ageCategory)
    }

    query += ` ORDER BY created_at DESC`

    const costumes = await executeQuery<any>(query, params)

    console.log("[v0] Costumes fetched:", costumes.length)
    console.log("[v0] Sample costume:", costumes[0])
    return NextResponse.json(costumes)
  } catch (error) {
    console.error("[v0] Error fetching costumes:", error)
    return NextResponse.json({ error: "Failed to fetch costumes", details: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const costume = await request.json()

    console.log("[v0] Received costume data:", costume)

    // Validate required fields
    if (!costume.title && !costume.name) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    if (!costume.description) {
      return NextResponse.json({ error: "Description is required" }, { status: 400 })
    }

    if (!costume.price || isNaN(Number(costume.price))) {
      return NextResponse.json({ error: "Valid price is required" }, { status: 400 })
    }

    if (!costume.image) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 })
    }

    const categoryId = Number.parseInt(costume.categoryId)
    if (isNaN(categoryId) || categoryId <= 0) {
      return NextResponse.json({ error: "Valid category ID is required" }, { status: 400 })
    }

    const subcategoryId = Number.parseInt(costume.subcategoryId)
    if (isNaN(subcategoryId) || subcategoryId <= 0) {
      return NextResponse.json({ error: "Valid subcategory ID is required" }, { status: 400 })
    }

    if (!costume.ageCategory || (costume.ageCategory !== "children" && costume.ageCategory !== "adults")) {
      return NextResponse.json({ error: "Age Category must be 'children' or 'adults'" }, { status: 400 })
    }

    console.log("[v0] Validated values:", { categoryId, subcategoryId, ageCategory: costume.ageCategory })

    const isConnected = await testConnection()
    if (!isConnected) {
      throw new Error("Database connection failed")
    }

    await executeUpdate(
      `
      INSERT INTO costumes (
        title, description, price_per_day, image_url, category_id, subcategory_id, 
        age_category, size, deposit, active, available
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        costume.title || costume.name,
        costume.description,
        Number(costume.price),
        costume.image,
        categoryId,
        subcategoryId,
        costume.ageCategory,
        costume.size || null,
        costume.deposit || 0,
        costume.active !== false,
        costume.available !== false,
      ],
    )

    console.log("[v0] Costume created successfully")
    return NextResponse.json({ success: true, message: "Costume created successfully" })
  } catch (error) {
    console.error("[v0] Error creating costume:", error)
    return NextResponse.json(
      {
        error: "Failed to create costume",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
