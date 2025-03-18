"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { PlusCircle, Pencil, Trash2, Eye } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Mock data type
// interface Post {
//   id: string
//   title: string
//   excerpt: string
//   author: string
//   status: "published" | "draft" | "archived"
//   category: string
//   views: number
//   createdAt: string
// }

// Generate mock data
const generateMockPosts = (count, startIndex = 0) => {
  const categories = ["Technology", "Business", "Health", "Entertainment", "Sports"]
  const statuses = ["published", "draft", "archived"]

  return Array.from({ length: count }).map((_, i) => ({
    id: `POST${(startIndex + i + 1).toString().padStart(5, "0")}`,
    title: `Post Title ${startIndex + i + 1}`,
    excerpt: `This is a short excerpt for post ${startIndex + i + 1}. It gives a brief overview of what the post is about.`,
    author: `Author ${Math.floor(Math.random() * 10) + 1}`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    category: categories[Math.floor(Math.random() * categories.length)],
    views: Math.floor(Math.random() * 10000),
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
  }))
}

export default function PostsPage() {
  const router = useRouter()
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  // Columns definition
  const columns = [
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "author",
      header: "Author",
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => {
        const category = row.getValue("category")
        return <Badge variant="outline">{category}</Badge>
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status")
        return (
          <Badge
            className={status === "published" ? "bg-green-500" : status === "draft" ? "bg-yellow-500" : "bg-gray-500"}
          >
            {status}
          </Badge>
        )
      },
    },
    {
      accessorKey: "views",
      header: "Views",
      cell: ({ row }) => {
        const views = row.getValue("views")
        return (
          <div className="flex items-center">
            <Eye className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{views.toLocaleString()}</span>
          </div>
        )
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"))
        return <span>{date.toLocaleDateString()}</span>
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const post = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <circle cx="12" cy="12" r="1" />
                  <circle cx="12" cy="5" r="1" />
                  <circle cx="12" cy="19" r="1" />
                </svg>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => router.push(`/dashboard/posts/${post.id}/edit`)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push(`/dashboard/posts/${post.id}`)}>
                <Eye className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => {
                  // Handle delete
                  if (confirm(`Are you sure you want to delete "${post.title}"?`)) {
                    // Delete logic would go here
                    setPosts((prev) => prev.filter((p) => p.id !== post.id))
                  }
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  // Load initial data
  useEffect(() => {
    setPosts(generateMockPosts(20))
  }, [])

  // Handle load more
  const handleLoadMore = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      if (page < 5) {
        setPosts((prev) => [...prev, ...generateMockPosts(20, page * 20)])
        setPage((prev) => prev + 1)
      } else {
        setHasMore(false)
      }
      setIsLoading(false)
    }, 1000)
  }

  // Handle search
  const handleSearch = (value) => {
    setSearchTerm(value)
    if (value.trim() === "") {
      setPosts(generateMockPosts(20))
      setPage(1)
      setHasMore(true)
    } else {
      // Simulate search
      const filtered = generateMockPosts(100).filter(
        (post) =>
          post.title.toLowerCase().includes(value.toLowerCase()) ||
          post.author.toLowerCase().includes(value.toLowerCase()) ||
          post.category.toLowerCase().includes(value.toLowerCase()),
      )
      setPosts(filtered.slice(0, 20))
      setHasMore(filtered.length > 20)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Posts</CardTitle>
        <Button onClick={() => router.push("/dashboard/posts/new")}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Post
        </Button>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={posts}
          isLoading={isLoading}
          hasMore={hasMore}
          onLoadMore={handleLoadMore}
          searchPlaceholder="Search posts..."
          onSearch={handleSearch}
        />
      </CardContent>
    </Card>
  )
}

