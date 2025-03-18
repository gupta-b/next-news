"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { PlusCircle, Pencil, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"



// Generate mock data
const generateMockUsers = (count, startIndex = 0) => {
  return Array.from({ length: count }).map((_, i) => ({
    id: `USR${(startIndex + i + 1).toString().padStart(5, "0")}`,
    name: `User ${startIndex + i + 1}`,
    email: `user${startIndex + i + 1}@example.com`,
    role: ["Admin", "Editor", "Viewer"][Math.floor(Math.random() * 3)],
    status: Math.random() > 0.2 ? "active" : "inactive",
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
  }))
}

export default function UsersPage() {
  const router = useRouter()
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  // Columns definition
  const columns = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "role",
      header: "Role",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status")
        return (
          <div className="flex items-center">
            <span className={`mr-2 h-2 w-2 rounded-full ${status === "active" ? "bg-green-500" : "bg-red-500"}`} />
            <span className="capitalize">{status}</span>
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
        const user = row.original
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
              <DropdownMenuItem onClick={() => router.push(`/dashboard/users/${user.id}/edit`)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => {
                  // Handle delete
                  if (confirm(`Are you sure you want to delete ${user.name}?`)) {
                    // Delete logic would go here
                    setUsers((prev) => prev.filter((u) => u.id !== user.id))
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
    setUsers(generateMockUsers(20))
  }, [])

  // Handle load more
  const handleLoadMore = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      if (page < 5) {
        setUsers((prev) => [...prev, ...generateMockUsers(20, page * 20)])
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
      setUsers(generateMockUsers(20))
      setPage(1)
      setHasMore(true)
    } else {
      // Simulate search
      const filtered = generateMockUsers(100).filter(
        (user) =>
          user.name.toLowerCase().includes(value.toLowerCase()) ||
          user.email.toLowerCase().includes(value.toLowerCase()) ||
          user.id.toLowerCase().includes(value.toLowerCase()),
      )
      setUsers(filtered.slice(0, 20))
      setHasMore(filtered.length > 20)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Users</CardTitle>
        <Button onClick={() => router.push("/dashboard/users/new")}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={users}
          isLoading={isLoading}
          hasMore={hasMore}
          onLoadMore={handleLoadMore}
          searchPlaceholder="Search users..."
          onSearch={handleSearch}
        />
      </CardContent>
    </Card>
  )
}

