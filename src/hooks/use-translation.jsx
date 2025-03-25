"use client"

import React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { translations } from "@/lib/translations"

// type TranslationContextType = {
//   language: Language
//   setLanguage: (lang: Language) => void
//   t: (key: keyof typeof translations.en) => string
// }

const TranslationContext = createContext(undefined)

export function TranslationProvider({ children }) {
  // Default to English, but try to get from localStorage if available
  const [language, setLanguage] = useState("en")

  // Load saved language preference on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language")
    if (savedLanguage && Object.keys(translations).includes(savedLanguage)) {
      setLanguage(savedLanguage)
    } else {
      // Try to detect browser language
      const browserLang = navigator.language.split("-")[0]
      if (Object.keys(translations).includes(browserLang)) {
        setLanguage(browserLang)
      }
    }
  }, [])

  // Save language preference when it changes
  useEffect(() => {
    localStorage.setItem("language", language)
  }, [language])

  // Translation function
  const t = (key) => {
    return translations[language][key] || translations.en[key] || key
  }

  return <TranslationContext.Provider value={{ language, setLanguage, t }}>{children}</TranslationContext.Provider>
}

export function useTranslation() {
  const context = useContext(TranslationContext)
  if (context === undefined) {
    throw new Error("useTranslation must be used within a TranslationProvider")
  }
  return context
}

