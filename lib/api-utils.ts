export function getApiUrl(path: string): string {
  // Check if we're on the server side
  if (typeof window === "undefined") {
    // Server-side: use environment variable or localhost
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"
    return `${baseUrl}${path}`
  }
  // Client-side: use relative URL
  return path
}
