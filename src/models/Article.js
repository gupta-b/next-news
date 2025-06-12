import mongoose, { Schema } from "mongoose"

// export interface IArticle extends Document {
//   titleEn: body.titleEn || "",
    // titleEHi: body.titleEHi || "",
    // titleGuj: body.titleGuj || "",
    // category: body.category || "",
    // URLs: body.URLs || [],
    // hashtags: body.hashtags || [],
    // langCheck: body.langCheck || ['en', 'hi', 'guj'],
    // status: body.status || "draft",
    // bodyEn: body.bodyEn || "",
    // bodyHi: body.bodyHi || "",
    // bodyGuj: body.bodyGuj || "",
    // category: body.category || "",
    // fromDate: body.fromDate || new Date(),
    // toDate: body.toDate || new Date(),
// }

const ArticleSchema = new Schema(
  {
    titleEn: { type: String, required: true },
    titleHi: { type: String, required: true },
    titleGuj: { type: String, required: true },
    URLs: { type: Array, required: true },
    hashtags: { type: Array, required: true },
    langCheck: { type: Array, required: true },
    status: { type: String, required: true },
    bodyEn: { type: String, required: true },
    bodyHi: { type: String, required: true },
    bodyGuj: { type: String, required: true },
    category: { type: String, required: true },
    role: { type: String, required: true },
    fromDate: { type: String, required: true },
    fromDate: { type: Date, required: true, default: Date.now },
    toDate: { type: Date, required: true, default: Date.now },
    trendingRank: { type: Number },
  },
  {
    timestamps: true,
  }
)

// Prevent multiple models from being created
export default mongoose.models.Article || mongoose.model("Article", ArticleSchema)
