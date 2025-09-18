import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ valid: false, message: "No token provided" }, { status: 401 })
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any

    return NextResponse.json({
      valid: true,
      user: { username: decoded.username, role: decoded.role },
    })
  } catch (error) {
    return NextResponse.json({ valid: false, message: "Invalid token" }, { status: 401 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("admin-token")?.value

    if (!token) {
      return NextResponse.json({ valid: false, message: "No token found" }, { status: 401 })
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any

    return NextResponse.json({
      valid: true,
      user: { username: decoded.username, role: decoded.role },
    })
  } catch (error) {
    return NextResponse.json({ valid: false, message: "Invalid token" }, { status: 401 })
  }
}
