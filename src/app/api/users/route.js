import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongoose"
import User from "@/models/User"

export async function GET(request) {
  try {
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    // const category = searchParams.get("category")
    // const trending = searchParams.get("trending")

    const skip = (page - 1) * limit

    // Build query based on parameters
    const query = {}

    // if (category) {
    //   query.category = category
    // }


    // Get total count for pagination
    const total = await User.countDocuments(query)

    // Get articles
    const users = await User.find(query).sort({ publishedAt: -1 }).skip(skip).limit(limit)
    const pages = Math.ceil(total / limit);
    return NextResponse.json({
      users,
      pagination: {
        total,
        page,
        limit,
        hasMore: (page !== pages && total),
        pages
      },
    })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

