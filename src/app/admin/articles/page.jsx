"use client"

import { useState, useEffect, useReducer, useCallback } from "react"
import axios from "axios";
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


// Generate mock data
const articleReducer = (state, action) => {
  const pagination = action?.payload?.data?.pagination;
  switch (action.type) {
    case "START_LOADING":
      return {
        ...state,
        article: {
          ...state.article,
          isLoading: true
        }
      }
    case "GET_MORE_ARTICLES": 
      const prevArticle = state.article;
      if (prevArticle.page < pagination.page) {
        const newList = state.article.list.concat(action?.payload?.data?.articles)
        return {
          ...state,
          article: {
            ...pagination,
            isLoading: false,
            list: newList
  
          }
        }
      } else {
        return state;
      }
        
    case "GET_ARTICLE":
      return {
        ...state,
        article: {
          ...pagination,
          isLoading: false,
          list: action?.payload?.data?.articles
        }
      }
      
    default:
      return state;
  }
};;
const initialArticleObj = {
   "article": {
      isLoading: true,
      page: 0,
      total: 0,
      hasMore: false,
      list: []
    }
};
export default function ArticlesPage() {
  const router = useRouter()
  const [articleState, dispatch] = useReducer(articleReducer, initialArticleObj);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchNumberOfArticles = useCallback(
    async (refresh = false) => {
    try {
      const article = await axios.get('/api/articles');
      dispatch({type: "GET_ARTICLE", payload: article});
    } catch (error) {
      const axiosError = error;
      console.log('\x1b[36m%s\x1b[0m', axiosError);
    } finally {
      
    }
  }, []);

  const fetchMoreNumberOfARTICLEs = async (pageNumber) => {
    try {
      const article = await axios.get(`/api/articles?page=${pageNumber}`);
      dispatch({type: "GET_MORE_ARTICLES", payload: article});
    } catch (error) {
      const axiosError = error;
      console.log('\x1b[36m%s\x1b[0m', axiosError);
    } finally {
      
    }
  };
  
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
        const article = row.original
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
              <DropdownMenuItem onClick={() => router.push(`/dashboard/articles/${article.id}/edit`)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => {
                  // Handle delete
                  if (confirm(`Are you sure you want to delete ${article.name}?`)) {
                    // Delete logic would go here
                    // setContacts((prev) => prev.filter((c) => c.id !== article.id))
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
    fetchNumberOfArticles();
  }, [])

  // Handle load more
  const handleLoadMore = () => {
    console.log("start")
    dispatch({type: "START_LOADING"});
    // Simulate API call
    setTimeout(() => {
      fetchMoreNumberOfArticles(articleState.article.page + 1);
    }, 1000)
  }

  // Handle search
  const handleSearch = (value) => {
    setSearchTerm(value)
    if (value.trim() === "") {
      // setContacts(generateMockContacts(20))
      setPage(1)
    } else {
      // Simulate search
      const filtered = generateMockArticles(100).filter(
        (article) =>
          article.name.toLowerCase().includes(value.toLowerCase()) ||
          article.email.toLowerCase().includes(value.toLowerCase()) ||
          article.company.toLowerCase().includes(value.toLowerCase()),
      )
      // setContacts(filtered.slice(0, 20))
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Articles</CardTitle>
        <Button onClick={() => router.push("/admin/articles/new")}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Article
        </Button>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={articleState.article.list}
          isLoading={articleState.article.isLoading}
          hasMore={articleState.article.hasMore}
          onLoadMore={handleLoadMore}
          searchPlaceholder="Search articles..."
          onSearch={handleSearch}
        />
      </CardContent>
    </Card>
  )
}

