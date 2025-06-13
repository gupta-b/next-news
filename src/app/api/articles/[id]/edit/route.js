import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongoose"
import Article from "@/models/Article"

export async function GET(request) {
  try {
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "2")

    return NextResponse.json({ message: "This is the edit route for articles" })
    
  } catch (error) {
    console.error("Error fetching articles:", error)
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 })
  }
}
