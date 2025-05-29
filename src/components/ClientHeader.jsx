"use client"

import Link from "next/link"
import { useTranslation } from "@/hooks/use-translation"
import { Menu, Bell, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
// import { useSidebar } from "@/components/sidebar-provider"
import { NewsCategorySelector } from "@/components/news-category-selector"
import { LanguageSelector } from "@/components/language-selector"
import { SidebarTrigger } from "@/components/ui/sidebar"

import GoogleLogin from "./GoogleLogin";

export default function ClientHeader() {
  const { t } = useTranslation()
  // const { toggle } = useSidebar()

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center border-b bg-card px-4 lg:px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <SidebarTrigger />
      <div className="ml-auto flex items-center gap-2">
        <NewsCategorySelector />
        <LanguageSelector />
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>
        <nav className="flex items-center space-x-2">
          {/* <button onClick={() => signIn("google")}>G-Login</button> */}
          <GoogleLogin />
          <Link href="/auth/signup">
            <Button size="sm">Sign Up</Button>
          </Link>
        </nav>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
              <span className="sr-only">User menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

