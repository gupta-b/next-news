"use client"

import React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  // SortingState,
  getSortedRowModel,
} from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"


export function DataTable({
  columns,
  data,
  isLoading = false,
  hasMore = false,
  onLoadMore,
  searchPlaceholder = "Search...",
  onSearch,
}) {
  const [sorting, setSorting] = useState([])
  const [searchValue, setSearchValue] = useState("")
  const loaderRef = useRef(null)

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  })

  const handleSearch = useCallback(
    (e) => {
      const value = e.target.value
      setSearchValue(value)
      if (onSearch) {
        onSearch(value)
      }
    },
    [onSearch],
  )

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!onLoadMore || !hasMore) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading && hasMore) {
          onLoadMore()
        }
      },
      { threshold: 0.5 },
    )

    if (loaderRef.current) {
      observer.observe(loaderRef.current)
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current)
      }
    }
  }, [onLoadMore, isLoading, hasMore])

  return (
    <div className="space-y-4">
      {/* {onSearch && (
        <div className="flex items-center justify-between">
          <Input placeholder={searchPlaceholder} value={searchValue} onChange={handleSearch} className="max-w-sm" />
        </div>
      )} */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {isLoading ? "Loading..." : "No results."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {hasMore && (
        <div ref={loaderRef} className="flex justify-center py-4">
          {isLoading && (
            <Button disabled variant="outline">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading more...
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

