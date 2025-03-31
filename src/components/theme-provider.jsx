"use client"

import * as React from "react"

// type Theme = "light" | "dark" | "system"

// type ThemeProviderProps = {
//   children: React.ReactNode
//   attribute?: string
//   defaultTheme?: Theme
//   enableSystem?: boolean
//   disableTransitionOnChange?: boolean
// }

// type UseTheme = {
//   theme: Theme
//   setTheme: (theme: Theme) => void
// }

const ThemeContext = React.createContext({
  theme: "system",
  setTheme: () => {},
})

const ThemeProvider = ({
  children,
  attribute = "class",
  defaultTheme = "system",
  enableSystem = true,
  disableTransitionOnChange = false,
}) => {
  const [theme, setTheme] = React.useState(() => {
    if (typeof window === "undefined") {
      return defaultTheme
    }
    const storedTheme = window.localStorage.getItem("theme")
    return storedTheme || defaultTheme
  })

  React.useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    const root = window.document.documentElement

    if (theme === "system") {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      root.classList.remove(isDark ? "light" : "dark")
    } else if (theme) {
      root.classList.remove(theme === "dark" ? "light" : "dark")
      root.classList.add(theme)
    }

    if (attribute === "class") {
      window.localStorage.setItem("theme", theme)
    }
  }, [theme, attribute])

  const value = React.useMemo(
    () => ({
      theme,
      setTheme: (theme) => {
        setTheme(theme)
      },
    }),
    [theme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

function useTheme() {
  return React.useContext(ThemeContext)
}

export { ThemeProvider, useTheme }

