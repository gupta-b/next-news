import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongoose"
import Article from "@/models/Article"

export async function GET(request) {
  try {
    await dbConnect()
    console.log(request)
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
        hasMore: (page !== pages && total),
        pages
      },
    })
  } catch (error) {
    console.error("Error fetching articles:", error)
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()

    const newArticle = {
      titleEn: body.titleEn || "",
      titleHi: body.titleHi || "",
      titleGuj: body.titleGuj || "",
      category: body.category || "",
      URLs: body.URLs || [],
      hashtags: body.hashtags || [],
      langCheck: body.langCheck || ['en', 'hi', 'guj'],
      status: body.status || "draft",
      bodyEn: body.bodyEn || "",
      bodyHi: body.bodyHi || "",
      bodyGuj: body.bodyGuj || "",
      category: body.category || "",
      fromDate: body.fromDate || new Date(),
      toDate: body.toDate || new Date(),
    }

    console.log(newArticle)
    const result  = await Article.insertOne(newArticle);
    console.log(result);
    newArticle._id = result._id;
    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: "Failed to create article" }, { status: 500 })
  }
}

