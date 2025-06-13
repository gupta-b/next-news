import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongoose"
import Article from "@/models/Article"

export async function GET(request, context) {
  try {
    await dbConnect()
    const { _id } = await context.params;
    // const data = await request.json();
    // if (category) {
    //   query.category = category
    // }


    // Get total count for pagination
    // const total = await Article.countDocuments(query)

    // Get articles
    const articles = await Article.findById(_id);
    // const pages = Math.ceil(total / limit);
    return NextResponse.json(articles)
  } catch (error) {
    console.error("Error fetching article:", error)
    return NextResponse.json({ error: "Failed to fetch article" }, { status: 500 })
  }
}
export async function PUT(request, context) {
  try {
    await dbConnect();

    const { _id } = await context.params; // e.g., /api/articles/123
    const data = await request.json();

    const updatedArticle = await Article.findByIdAndUpdate(_id, data, {
      new: false, // Return updated document
      runValidators: true, // Validate before update
    });

    if (!updatedArticle) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    return NextResponse.json(updatedArticle);
  } catch (error) {
    console.error("Error updating article:", error);
    return NextResponse.json({ error: "Failed to update article" }, { status: 500 });
  }
}
