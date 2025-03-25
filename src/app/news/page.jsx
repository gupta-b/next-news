"use client"

import { useEffect, useRef, useState } from "react"
import { format, isToday, isYesterday } from "date-fns"
import { ChevronRight, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/hooks/use-translation"

export default function NewsPage() {
  const { t, language } = useTranslation()
  const [articles, setArticles] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [selectedArticle, setSelectedArticle] = useState(null)
  const observerTarget = useRef(null)

  // Function to generate mock news data
  const generateMockNews = (start, count) => {
    const categories = [t("politics"), t("technology"), t("business"), t("sports"), t("entertainment"), "Health"]
    const sources = ["The Daily News", "Tech Today", "Business Insider", "Sports Network", "Entertainment Weekly"]

    return Array.from({ length: count }, (_, i) => {
      const id = start + i
      const daysAgo = Math.floor(Math.random() * 3) // 0 = today, 1 = yesterday, 2 = day before
      const hoursAgo = Math.floor(Math.random() * 24)
      const date = new Date()
      date.setDate(date.getDate() - daysAgo)
      date.setHours(date.getHours() - hoursAgo)

      return {
        id,
        title: `News Article ${id}: ${Lorem.generateWords(5)}`,
        excerpt: Lorem.generateSentences(2),
        content: Lorem.generateParagraphs(5),
        author: `Author ${(id % 5) + 1}`,
        source: sources[id % sources.length],
        publishedAt: date,
        imageUrl: `/placeholder.svg?height=200&width=400&text=News+${id}`,
        category: categories[id % categories.length],
      }
    })
  }

  // Load more news articles
  const loadMoreArticles = () => {
    if (loading) return
    setLoading(true)

    // Simulate API call with setTimeout
    setTimeout(() => {
      const newArticles = generateMockNews(articles.length + 1, 10)
      setArticles((prev) => [...prev, ...newArticles])
      setPage((prev) => prev + 1)
      setLoading(false)

      // Stop after 5 pages for demo purposes
      if (page >= 5) {
        setHasMore(false)
      }
    }, 1000)
  }

  // Initial load
  useEffect(() => {
    loadMoreArticles()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Reset when language changes
  useEffect(() => {
    setArticles([])
    setPage(1)
    setHasMore(true)
    loadMoreArticles()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language])

  // Set up intersection observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMoreArticles()
        }
      },
      { threshold: 1.0 },
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current)
      }
    }
  }, [observerTarget, hasMore, loading])

  // Group articles by date
  const groupedArticles = articles.reduce(
    (groups, article) => {
      let dateKey = "older"

      if (isToday(article.publishedAt)) {
        dateKey = "today"
      } else if (isYesterday(article.publishedAt)) {
        dateKey = "yesterday"
      }

      if (!groups[dateKey]) {
        groups[dateKey] = []
      }

      groups[dateKey].push(article)
      return groups
    },
    {},
  )

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">{t("appName")}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* News List - Takes 1/3 on desktop, full width on mobile */}
        <div className={cn("col-span-1 lg:col-span-2 space-y-6", selectedArticle ? "hidden lg:block" : "block")}>
          {/* Today's News */}
          {groupedArticles.today && groupedArticles.today.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-blue-500 w-2 h-2 rounded-full"></div>
                <h2 className="text-xl font-semibold">{t("today")}</h2>
                <Separator className="flex-1" />
              </div>
              <div className="space-y-4">
                {groupedArticles.today.map((article) => (
                  <NewsCard key={article.id} article={article} onClick={() => setSelectedArticle(article)} />
                ))}
              </div>
            </div>
          )}

          {/* Yesterday's News */}
          {groupedArticles.yesterday && groupedArticles.yesterday.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-amber-500 w-2 h-2 rounded-full"></div>
                <h2 className="text-xl font-semibold">{t("yesterday")}</h2>
                <Separator className="flex-1" />
              </div>
              <div className="space-y-4">
                {groupedArticles.yesterday.map((article) => (
                  <NewsCard key={article.id} article={article} onClick={() => setSelectedArticle(article)} />
                ))}
              </div>
            </div>
          )}

          {/* Older News */}
          {groupedArticles.older && groupedArticles.older.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-gray-500 w-2 h-2 rounded-full"></div>
                <h2 className="text-xl font-semibold">{t("olderNews")}</h2>
                <Separator className="flex-1" />
              </div>
              <div className="space-y-4">
                {groupedArticles.older.map((article) => (
                  <NewsCard key={article.id} article={article} onClick={() => setSelectedArticle(article)} />
                ))}
              </div>
            </div>
          )}

          {/* Loading indicator and observer target */}
          {loading && (
            <div className="space-y-4 py-4">
              <NewsCardSkeleton />
              <NewsCardSkeleton />
            </div>
          )}
          <div ref={observerTarget} className="h-4" />
          {!hasMore && <p className="py-4 text-center text-sm text-muted-foreground">{t("noMoreNews")}</p>}
        </div>

        {/* Article Detail - Takes 2/3 on desktop, full width on mobile */}
        <div
          className={cn("col-span-1 lg:col-span-1 sticky top-4 h-fit", selectedArticle ? "block" : "hidden lg:block")}
        >
          {selectedArticle ? (
            <NewsDetail article={selectedArticle} onClose={() => setSelectedArticle(null)} />
          ) : (
            <div className="bg-muted rounded-lg p-8 text-center h-[70vh] flex items-center justify-center">
              <div className="space-y-4">
                <h3 className="text-xl font-medium">{t("selectArticle")}</h3>
                <p className="text-muted-foreground">{t("clickToView")}</p>
                <ChevronRight className="h-8 w-8 mx-auto text-muted-foreground" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// News Card Component
function NewsCard({ article, onClick }) {
  const { t } = useTranslation()

  return (
    <Card className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1">
          <img
            src={article.imageUrl || "/placeholder.svg"}
            alt={article.title}
            className="w-full h-full object-cover aspect-video md:aspect-square"
          />
        </div>
        <CardContent className="p-4 md:col-span-2">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded-full">
                {article.category}
              </span>
              <span className="text-xs text-muted-foreground">{format(article.publishedAt, "h:mm a")}</span>
            </div>
            <h3 className="font-bold line-clamp-2">{article.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{article.excerpt}</p>
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-muted-foreground">{article.source}</span>
              <Button variant="ghost" size="sm" className="text-xs">
                {t("readMore")} <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}

// News Card Skeleton for loading state
function NewsCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1">
          <Skeleton className="w-full h-full aspect-video md:aspect-square" />
        </div>
        <CardContent className="p-4 md:col-span-2">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <div className="flex items-center justify-between pt-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-28" />
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}

// News Detail Component
function NewsDetail({ article, onClose }) {
  const { t } = useTranslation()

  return (
    <Card className="overflow-hidden">
      <div className="relative">
        <img src={article.imageUrl || "/placeholder.svg"} alt={article.title} className="w-full h-48 object-cover" />
        <Button
          variant="outline"
          size="icon"
          className="absolute top-2 right-2 rounded-full bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
      </div>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded-full">
              {article.category}
            </span>
            <span className="text-xs text-muted-foreground">
              {format(article.publishedAt, "PPP")} {t("at")} {format(article.publishedAt, "h:mm a")}
            </span>
          </div>
          <h2 className="text-xl font-bold">{article.title}</h2>
          <div className="flex items-center justify-between text-sm">
            <span>
              {t("by")} {article.author}
            </span>
            <span className="text-muted-foreground">{article.source}</span>
          </div>
          <Separator />
          <div className="space-y-4 text-sm leading-relaxed">
            {article.content.split("\n\n").map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Simple Lorem Ipsum generator
const Lorem = {
  words: [
    "lorem",
    "ipsum",
    "dolor",
    "sit",
    "amet",
    "consectetur",
    "adipiscing",
    "elit",
    "sed",
    "do",
    "eiusmod",
    "tempor",
    "incididunt",
    "ut",
    "labore",
    "et",
    "dolore",
    "magna",
    "aliqua",
    "enim",
    "minim",
    "veniam",
    "quis",
    "nostrud",
    "exercitation",
    "ullamco",
    "laboris",
    "nisi",
    "aliquip",
    "commodo",
    "consequat",
    "duis",
    "aute",
    "irure",
    "reprehenderit",
    "voluptate",
    "velit",
    "esse",
    "cillum",
    "fugiat",
    "nulla",
    "pariatur",
    "excepteur",
    "sint",
    "occaecat",
    "cupidatat",
    "non",
    "proident",
    "sunt",
    "culpa",
    "qui",
    "officia",
    "deserunt",
    "mollit",
    "anim",
    "id",
    "est",
    "laborum",
    "news",
    "breaking",
    "headline",
    "report",
    "update",
    "analysis",
    "investigation",
    "exclusive",
    "development",
    "crisis",
    "scandal",
    "interview",
    "opinion",
    "editorial",
    "feature",
    "story",
    "coverage",
    "briefing",
  ],
  generateWords: function (count) {
    return Array.from({ length: count }, () => this.words[Math.floor(Math.random() * this.words.length)]).join(" ")
  },
  generateSentences: function (count) {
    return Array.from({ length: count }, () => {
      const wordCount = Math.floor(Math.random() * 10) + 5
      return this.generateWords(wordCount).charAt(0).toUpperCase() + this.generateWords(wordCount).slice(1) + "."
    }).join(" ")
  },
  generateParagraphs: function (count) {
    return Array.from({ length: count }, () => {
      const sentenceCount = Math.floor(Math.random() * 3) + 2
      return Array.from({ length: sentenceCount }, () => {
        const wordCount = Math.floor(Math.random() * 15) + 5
        return this.generateWords(wordCount).charAt(0).toUpperCase() + this.generateWords(wordCount).slice(1) + "."
      }).join(" ")
    }).join("\n\n")
  },
}

