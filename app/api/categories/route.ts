import { type NextRequest, NextResponse } from "next/server"
import { executeQuery, executeUpdate, testConnection } from "@/lib/database"

export async function GET() {
  try {
    console.log("[v0] Fetching categories...")

    const isConnected = await testConnection()
    if (!isConnected) {
      throw new Error("Database connection failed")
    }

    const categories = await executeQuery<any>(`
      SELECT 
        id, name, slug, description, image_url as image, age_category, active,
        DATE_FORMAT(created_at, '%Y-%m-%d') as createdAt,
        DATE_FORMAT(updated_at, '%Y-%m-%d') as updatedAt
      FROM categories 
      ORDER BY created_at DESC
    `)

    console.log("[v0] Categories fetched:", categories.length)

    // Получаем подкатегории для каждой категории
    for (const category of categories) {
      const subcategories = await executeQuery<any>(
        `
        SELECT 
          id, name, slug, description, image_url as image, age_category, count, active, available,
          DATE_FORMAT(created_at, '%Y-%m-%d') as createdAt,
          DATE_FORMAT(updated_at, '%Y-%m-%d') as updatedAt
        FROM subcategories 
        WHERE category_id = ? AND active = TRUE
        ORDER BY name
      `,
        [category.id],
      )

      category.subcategories = subcategories
    }

    return NextResponse.json(categories)
  } catch (error) {
    console.error("[v0] Error fetching categories:", error)
    return NextResponse.json({ error: "Failed to fetch categories", details: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const category = await request.json()
    console.log("[v0] Creating category:", category)

    const result = await executeUpdate(
      `
      INSERT INTO categories (name, slug, description, image_url, age_category, active)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
      [
        category.name || category.title, // Support both name and title
        category.slug ||
          category.name?.toLowerCase().replace(/\s+/g, "-") ||
          category.title?.toLowerCase().replace(/\s+/g, "-"),
        category.description,
        category.image || null,
        category.age_category || "children", // Default to children if not specified
        category.active !== false,
      ],
    )

    const categoryId = result.insertId
    console.log("[v0] Category created with ID:", categoryId)

    // Создаем подкатегории если есть
    if (category.subcategories && category.subcategories.length > 0) {
      for (const subcategory of category.subcategories) {
        console.log("[v0] Creating subcategory for category:", categoryId)

        await executeUpdate(
          `
          INSERT INTO subcategories (category_id, name, slug, description, image_url, age_category, count, active, available)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
          [
            categoryId,
            subcategory.name || subcategory.title,
            subcategory.slug ||
              subcategory.name?.toLowerCase().replace(/\s+/g, "-") ||
              subcategory.title?.toLowerCase().replace(/\s+/g, "-"),
            subcategory.description,
            subcategory.image || null,
            subcategory.age_category || category.age_category || "children", // Inherit from parent category
            subcategory.count || 0,
            subcategory.active !== false,
            subcategory.available !== false,
          ],
        )

        console.log("[v0] Subcategory created successfully")
      }
    }

    console.log("[v0] Category created successfully:", categoryId)
    return NextResponse.json({ success: true, id: categoryId })
  } catch (error) {
    console.error("[v0] Error creating category:", error)
    return NextResponse.json({ error: "Failed to create category", details: error.message }, { status: 500 })
  }
}
