import { type NextRequest, NextResponse } from "next/server"
import { executeQuery, executeQuerySingle, executeUpdate } from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const costume = await executeQuerySingle<any>(
      `
      SELECT 
        id, title, description, category_id as categoryId, subcategory_id as subcategoryId,
        image_url as image, size, age_category as ageCategory, price_per_day as price, 
        deposit, active, available,
        DATE_FORMAT(created_at, '%Y-%m-%d') as createdAt,
        DATE_FORMAT(updated_at, '%Y-%m-%d') as updatedAt
      FROM costumes 
      WHERE id = ?
    `,
      [params.id],
    )

    if (!costume) {
      return NextResponse.json({ error: "Costume not found" }, { status: 404 })
    }

    // Получаем характеристики
    const characteristics = await executeQuery<any>(
      `
      SELECT characteristic_name, characteristic_value
      FROM costume_characteristics 
      WHERE costume_id = ?
    `,
      [params.id],
    )

    costume.characteristics = {}
    characteristics.forEach((char: any) => {
      costume.characteristics[char.characteristic_name] = char.characteristic_value
    })

    return NextResponse.json(costume)
  } catch (error) {
    console.error("Error fetching costume:", error)
    return NextResponse.json({ error: "Failed to fetch costume" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const updates = await request.json()

    const setClause = []
    const queryParams = []

    if (updates.title !== undefined) {
      setClause.push("title = ?")
      queryParams.push(updates.title)
    }
    if (updates.description !== undefined) {
      setClause.push("description = ?")
      queryParams.push(updates.description)
    }
    if (updates.categoryId !== undefined || updates.category !== undefined) {
      setClause.push("category_id = ?")
      queryParams.push(updates.categoryId || updates.category)
    }
    if (updates.subcategoryId !== undefined || updates.subcategory !== undefined) {
      setClause.push("subcategory_id = ?")
      queryParams.push(updates.subcategoryId || updates.subcategory)
    }
    if (updates.image !== undefined) {
      setClause.push("image_url = ?")
      queryParams.push(updates.image)
    }
    if (updates.size !== undefined) {
      setClause.push("size = ?")
      queryParams.push(updates.size)
    }
    if (updates.ageCategory !== undefined) {
      setClause.push("age_category = ?")
      queryParams.push(updates.ageCategory)
    }
    if (updates.price !== undefined) {
      setClause.push("price_per_day = ?")
      queryParams.push(updates.price)
    }
    if (updates.deposit !== undefined) {
      setClause.push("deposit = ?")
      queryParams.push(updates.deposit)
    }
    if (updates.active !== undefined) {
      setClause.push("active = ?")
      queryParams.push(updates.active)
    }
    if (updates.available !== undefined) {
      setClause.push("available = ?")
      queryParams.push(updates.available)
    }

    if (setClause.length > 0) {
      queryParams.push(params.id)
      await executeUpdate(
        `
        UPDATE costumes 
        SET ${setClause.join(", ")}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
        queryParams,
      )
    }

    // Обновляем характеристики если переданы
    if (updates.characteristics) {
      // Удаляем старые характеристики
      await executeUpdate("DELETE FROM costume_characteristics WHERE costume_id = ?", [params.id])

      // Добавляем новые характеристики
      for (const [name, value] of Object.entries(updates.characteristics)) {
        if (value) {
          await executeUpdate(
            `
            INSERT INTO costume_characteristics (costume_id, characteristic_name, characteristic_value)
            VALUES (?, ?, ?)
          `,
            [params.id, name, value],
          )
        }
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating costume:", error)
    return NextResponse.json({ error: "Failed to update costume" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const result = await executeUpdate("DELETE FROM costumes WHERE id = ?", [params.id])

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Costume not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting costume:", error)
    return NextResponse.json({ error: "Failed to delete costume" }, { status: 500 })
  }
}
