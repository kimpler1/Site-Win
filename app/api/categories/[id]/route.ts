import { type NextRequest, NextResponse } from "next/server"
import { executeQuery, executeQuerySingle, executeUpdate } from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const category = await executeQuerySingle<any>(
      `
      SELECT 
        id, name, slug, description, image_url as image, active,
        DATE_FORMAT(created_at, '%Y-%m-%d') as createdAt,
        DATE_FORMAT(updated_at, '%Y-%m-%d') as updatedAt
      FROM categories 
      WHERE id = ?
    `,
      [params.id],
    )

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    // Получаем подкатегории
    const subcategories = await executeQuery<any>(
      `
      SELECT 
        id, name, slug, description, image_url as image, count, active, available,
        DATE_FORMAT(created_at, '%Y-%m-%d') as createdAt,
        DATE_FORMAT(updated_at, '%Y-%m-%d') as updatedAt
      FROM subcategories 
      WHERE category_id = ?
      ORDER BY name
    `,
      [params.id],
    )

    category.subcategories = subcategories

    return NextResponse.json(category)
  } catch (error) {
    console.error("Error fetching category:", error)
    return NextResponse.json({ error: "Failed to fetch category" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const updates = await request.json()

    const setClause = []
    const queryParams = []

    if (updates.name !== undefined || updates.title !== undefined) {
      setClause.push("name = ?")
      queryParams.push(updates.name || updates.title)
    }
    if (updates.slug !== undefined) {
      setClause.push("slug = ?")
      queryParams.push(updates.slug)
    }
    if (updates.description !== undefined) {
      setClause.push("description = ?")
      queryParams.push(updates.description)
    }
    if (updates.image !== undefined) {
      setClause.push("image_url = ?")
      queryParams.push(updates.image)
    }
    if (updates.active !== undefined) {
      setClause.push("active = ?")
      queryParams.push(updates.active)
    }

    if (setClause.length > 0) {
      queryParams.push(params.id)

      await executeUpdate(
        `
        UPDATE categories 
        SET ${setClause.join(", ")}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
        queryParams,
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating category:", error)
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const result = await executeUpdate("DELETE FROM categories WHERE id = ?", [params.id])

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting category:", error)
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 })
  }
}
