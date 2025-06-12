import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongoose"
import Article from "@/models/Article"

export async function GET(request) {
  try {
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "2")
    // const category = searchParams.get("category")
    // const trending = searchParams.get("trending")

    const skip = (page - 1) * limit

    // Build query based on parameters
    const query = {}

    // if (category) {
    //   query.category = category
    // }


    // Get total count for pagination
    const total = await Article.countDocuments(query)

    // Get articles
    const articles = await Article.find(query).sort({ publishedAt: -1 }).skip(skip).limit(limit)
    const pages = Math.ceil(total / limit);
    return NextResponse.json({
      articles,
      pagination: {
        total,
        page,
        limit,
        hasMore: (page !== pages),
        pages
      },
    })
  } catch (error) {
    console.error("Error fetching articles:", error)
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 })
  }
}
