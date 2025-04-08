import mongoose, { Schema } from "mongoose"

// export interface IArticle extends Document {
//   title: string
//   excerpt: string
//   content: string
//   author: string
//   source: string
//   publishedAt: Date
//   imageUrl: string
//   category: string
//   trending: boolean
//   trendingRank?: number
//   createdAt: Date
//   updatedAt: Date
// }

const ArticleSchema = new Schema(
  {
    title: { type: String, required: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    source: { type: String, required: true },
    publishedAt: { type: Date, required: true, default: Date.now },
    imageUrl: { type: String, required: true },
    category: { type: String, required: true },
    trending: { type: Boolean, default: false },
    trendingRank: { type: Number },
  },
  {
    timestamps: true,
  },
)

// Prevent multiple models from being created
export default mongoose.models.Article || mongoose.model("Article", ArticleSchema)
