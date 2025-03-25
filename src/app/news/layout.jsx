import React from "react"
import { TranslationProvider } from "@/hooks/use-translation"
import ClientHeader from "./ClientHeader"
import { ClientSidebar } from "./clientSidebar"

export const metadata = {
  title: "News App",
  description: "Latest news with infinite scrolling",
}

export default function NewsLayout({
  children,
}) {
  return (
    <TranslationProvider>
      <div className="flex h-screen overflow-hidden">
      {/* <ClientSidebar /> */}
      <div className="flex flex-1 flex-col overflow-hidden">
      <ClientHeader />
        <main className="flex-1 overflow-y-auto bg-muted/20 p-4 md:p-6">{children}</main>
      </div>
    </div>
    </TranslationProvider>
  )
}




