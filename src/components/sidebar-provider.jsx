"use client"

import React from "react"

import { createContext, useContext, useEffect, useState } from "react"


const SidebarContext = createContext({
  isOpen: false,
  toggle: () => {},
  close: () => {},
})

export function SidebarProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false)

  // Close sidebar on mobile when route changes
  useEffect(() => {
    const handleRouteChange = () => {
      setIsOpen(false)
    }

    window.addEventListener("popstate", handleRouteChange)

    return () => {
      window.removeEventListener("popstate", handleRouteChange)
    }
  }, [])

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleOutsideClick = (event) => {
      console.log(isOpen)
      if (isOpen && window.innerWidth < 1024) {
        const sidebar = document.getElementById("sidebar")
        if (sidebar && !sidebar.contains(event.target)) {
          setIsOpen(false)
        }
      }
    }

    document.addEventListener("mousedown", handleOutsideClick)

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick)
    }
  }, [isOpen])

  return (
    <SidebarContext.Provider
      value={{
        isOpen,
        toggle: () => {console.log("click", isOpen); setIsOpen(!isOpen)},
        close: () => setIsOpen(false),
      }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

export const useSidebar = () => useContext(SidebarContext)

