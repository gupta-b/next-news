import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongoose"
import Contact from "@/models/Contact"

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
    const total = await Contact.countDocuments(query)

    // Get articles
    const contacts = await Contact.find(query).sort({ publishedAt: -1 }).skip(skip).limit(limit)
    const pages = Math.ceil(total / limit);
    return NextResponse.json({
      contacts,
      pagination: {
        total,
        page,
        limit,
        hasMore: (page !== pages),
        pages
      },
    })
  } catch (error) {
    console.error("Error fetching contacts:", error)
    return NextResponse.json({ error: "Failed to fetch contacts" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()

    const newContact = {
      name: body.name || "",
      email: body.email || "",
      phone: body.phone || "",
      status: body.status || "draft",
    }

    console.log(newContact)
    const result  = await Contact.insertOne(newContact);
    console.log(result);
    newContact._id = result._id;
    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create contact" }, { status: 500 })
  }
}