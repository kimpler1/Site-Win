// Утилиты для работы с MySQL базой данных
import mysql from "mysql2/promise"

// Создание пула соединений
const pool = mysql.createPool({
  uri: process.env.DATABASE_URL,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: "+00:00",
})

// Функция для выполнения запросов
export async function executeQuery<T = any>(query: string, params: any[] = []): Promise<T[]> {
  try {
    const [rows] = await pool.execute(query, params)
    return rows as T[]
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

// Функция для выполнения одиночного запроса
export async function executeQuerySingle<T = any>(query: string, params: any[] = []): Promise<T | null> {
  try {
    const [rows] = await pool.execute(query, params)
    const result = rows as T[]
    return result.length > 0 ? result[0] : null
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

// Функция для выполнения INSERT/UPDATE/DELETE запросов
export async function executeUpdate(
  query: string,
  params: any[] = [],
): Promise<{ insertId?: number; affectedRows: number }> {
  try {
    const [result] = await pool.execute(query, params)
    const mysqlResult = result as mysql.ResultSetHeader
    return {
      insertId: mysqlResult.insertId,
      affectedRows: mysqlResult.affectedRows,
    }
  } catch (error) {
    console.error("Database update error:", error)
    throw error
  }
}

// Функция для закрытия пула соединений
export async function closePool(): Promise<void> {
  await pool.end()
}

// Функция для тестирования соединения с базой данных
export async function testConnection(): Promise<boolean> {
  try {
    const [rows] = await pool.execute("SELECT 1 as test")
    console.log("[v0] Database connection successful")
    return true
  } catch (error) {
    console.error("[v0] Database connection failed:", error)
    return false
  }
}

export default pool
