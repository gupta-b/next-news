import React from "react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Header } from "@/components/admin-header"
import { SidebarProvider } from "@/components/ui/sidebar"

export default function DashboardLayout({
  children,
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarProvider>
        <AdminSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto bg-muted/20 p-4 md:p-6">{children}</main>
        </div>
      </SidebarProvider>
    </div>
  )
}

