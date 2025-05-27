"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { PlusCircle, Pencil, Trash2, Mail, Phone } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// // Mock data type
// interface Contact {
//   id: string
//   name: string
//   email: string
//   phone: string
//   company: string
//   title: string
//   createdAt: string
// }

// Generate mock data
const generateMockContacts = (count, startIndex = 0) => {
  return Array.from({ length: count }).map((_, i) => ({
    id: `CNT${(startIndex + i + 1).toString().padStart(5, "0")}`,
    name: `Contact ${startIndex + i + 1}`,
    email: `contact${startIndex + i + 1}@example.com`,
    phone: `+1 ${Math.floor(Math.random() * 900 + 100)}-${Math.floor(
      Math.random() * 900 + 100,
    )}-${Math.floor(Math.random() * 9000 + 1000)}`,
    company: `Company ${Math.floor(Math.random() * 20) + 1}`,
    title: ["CEO", "CTO", "CFO", "Manager", "Developer", "Designer"][Math.floor(Math.random() * 6)],
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
  }))
}

export default function ContactsPage() {
  const router = useRouter()
  const [contacts, setContacts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  // Columns definition
  const columns = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => {
        const email = row.getValue("email")
        return (
          <div className="flex items-center">
            <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{email}</span>
          </div>
        )
      },
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => {
        const phone = row.getValue("phone")
        return (
          <div className="flex items-center">
            <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{phone}</span>
          </div>
        )
      },
    },
    {
      accessorKey: "company",
      header: "Company",
    },
    {
      accessorKey: "title",
      header: "Title",
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
        const contact = row.original
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
              <DropdownMenuItem onClick={() => router.push(`/dashboard/contacts/${contact.id}/edit`)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => {
                  // Handle delete
                  if (confirm(`Are you sure you want to delete ${contact.name}?`)) {
                    // Delete logic would go here
                    setContacts((prev) => prev.filter((c) => c.id !== contact.id))
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
    setContacts(generateMockContacts(20))
  }, [])

  // Handle load more
  const handleLoadMore = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      if (page < 5) {
        setContacts((prev) => [...prev, ...generateMockContacts(20, page * 20)])
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
      setContacts(generateMockContacts(20))
      setPage(1)
      setHasMore(true)
    } else {
      // Simulate search
      const filtered = generateMockContacts(100).filter(
        (contact) =>
          contact.name.toLowerCase().includes(value.toLowerCase()) ||
          contact.email.toLowerCase().includes(value.toLowerCase()) ||
          contact.company.toLowerCase().includes(value.toLowerCase()),
      )
      setContacts(filtered.slice(0, 20))
      setHasMore(filtered.length > 20)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Contacts</CardTitle>
        <Button onClick={() => router.push("/dashboard/contacts/new")}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Contact
        </Button>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={contacts}
          isLoading={isLoading}
          hasMore={hasMore}
          onLoadMore={handleLoadMore}
          searchPlaceholder="Search contacts..."
          onSearch={handleSearch}
        />
      </CardContent>
    </Card>
  )
}

