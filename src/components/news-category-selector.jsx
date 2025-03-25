"use client"

import { Check, Globe } from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Language names in their native language

export function NewsCategorySelector() {
  const { language, setLanguage, t } = useTranslation();
  const router = useRouter()
  const newsCategory = {
    home: { label: t("home"), href: "/news"},
    politics: { label: t("politics"), href: "/news/category/politics"},
    technology: { label: t("technology"), href: "/news/category/technology"},
    business: { label: t("business"), href: "/news/category/business"},
    sports: { label: t("sports"), href: "/news/category/sports"},
    trending: { label: t("trending"), href: "/news/category/trending"},
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
          <Globe className="h-4 w-4" />
          <span className="sr-only">{t("selectNewsCategory")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {(Object.keys(newsCategory)).map((lang) => (
          <DropdownMenuItem key={lang} onClick={() => router.push(newsCategory[lang].href)} className="flex items-center justify-between">
            <span>{newsCategory[lang].label}</span>
            {language === lang && <Check className="h-4 w-4 ml-2" /> /* need to work on this */}  
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

