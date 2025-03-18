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

// // Mock data type
// interface Role {
//   id: string
//   name: string
//   description: string
//   permissions: string[]
//   usersCount: number
//   createdAt: string
// }

// Generate mock data
const generateMockRoles = () => {
  return [
    {
      id: "ROLE00001",
      name: "Admin",
      description: "Full access to all resources",
      permissions: ["create", "read", "update", "delete"],
      usersCount: 5,
      createdAt: new Date(Date.now() - 10000000000).toISOString(),
    },
    {
      id: "ROLE00002",
      name: "Editor",
      description: "Can edit content but not delete",
      permissions: ["create", "read", "update"],
      usersCount: 12,
      createdAt: new Date(Date.now() - 8000000000).toISOString(),
    },
    {
      id: "ROLE00003",
      name: "Viewer",
      description: "Read-only access",
      permissions: ["read"],
      usersCount: 28,
      createdAt: new Date(Date.now() - 6000000000).toISOString(),
    },
    {
      id: "ROLE00004",
      name: "Moderator",
      description: "Can moderate user content",
      permissions: ["read", "update"],
      usersCount: 8,
      createdAt: new Date(Date.now() - 4000000000).toISOString(),
    },
    {
      id: "ROLE00005",
      name: "Guest",
      description: "Limited access to public resources",
      permissions: ["read"],
      usersCount: 45,
      createdAt: new Date(Date.now() - 2000000000).toISOString(),
    },
  ]
}

export default function RolesPage() {
  const router = useRouter()
  const [roles, setRoles] = useState([])
  const [isLoading, setIsLoading] = useState(true)

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
      accessorKey: "description",
      header: "Description",
    },
    {
      accessorKey: "permissions",
      header: "Permissions",
      cell: ({ row }) => {
        const permissions = row.getValue("permissions")
        return (
          <div className="flex flex-wrap gap-1">
            {permissions.map((permission) => (
              <span
                key={permission}
                className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
              >
                {permission}
              </span>
            ))}
          </div>
        )
      },
    },
    {
      accessorKey: "usersCount",
      header: "Users",
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
        const role = row.original
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
              <DropdownMenuItem onClick={() => router.push(`/dashboard/roles/${role.id}/edit`)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => {
                  // Handle delete
                  if (confirm(`Are you sure you want to delete ${role.name} role?`)) {
                    // Delete logic would go here
                    setRoles((prev) => prev.filter((r) => r.id !== role.id))
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
    // Simulate API call
    setTimeout(() => {
      setRoles(generateMockRoles())
      setIsLoading(false)
    }, 1000)
  }, [])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Roles</CardTitle>
        <Button onClick={() => router.push("/dashboard/roles/new")}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Role
        </Button>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={roles} isLoading={isLoading} />
      </CardContent>
    </Card>
  )
}

