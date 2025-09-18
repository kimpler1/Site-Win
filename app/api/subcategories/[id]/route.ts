import { type NextRequest, NextResponse } from "next/server"
import { executeQuery, executeUpdate, testConnection } from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const isConnected = await testConnection()
    if (!isConnected) {
      throw new Error("Database connection failed")
    }

    const subcategory = await executeQuery<any>(
      `
      SELECT 
        id, category_id as categoryId, name, slug, description, image_url as image, count, active, available,
        DATE_FORMAT(created_at, '%Y-%m-%d') as createdAt,
        DATE_FORMAT(updated_at, '%Y-%m-%d') as updatedAt
      FROM subcategories 
      WHERE id = ?
    `,
      [params.id],
    )

    if (subcategory.length === 0) {
      return NextResponse.json({ error: "Subcategory not found" }, { status: 404 })
    }

    return NextResponse.json(subcategory[0])
  } catch (error) {
    console.error("Error fetching subcategory:", error)
    return NextResponse.json({ error: "Failed to fetch subcategory" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const updates = await request.json()

    await executeUpdate(
      `
      UPDATE subcategories 
      SET name = ?, slug = ?, description = ?, image_url = ?, count = ?, active = ?, available = ?, updated_at = NOW()
      WHERE id = ?
    `,
      [
        updates.name || updates.title, // Support both
        updates.slug,
        updates.description,
        updates.image,
        updates.count,
        updates.active,
        updates.available,
        params.id,
      ],
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating subcategory:", error)
    return NextResponse.json({ error: "Failed to update subcategory" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await executeUpdate("DELETE FROM subcategories WHERE id = ?", [params.id])
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting subcategory:", error)
    return NextResponse.json({ error: "Failed to delete subcategory" }, { status: 500 })
  }
}
