"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { createClient } from "@/lib/supabase/client"

type ShopItem = {
  id: string
  name: string
  description: string
  category: string
  price: number
  rarity: string
  preview_data: Record<string, unknown>
}

type UserCustomization = {
  active_badge_id: string | null
  active_title_id: string | null
  active_theme_id: string | null
  active_card_design_id: string | null
  active_celebration_id: string | null
  active_whistle_id: string | null
  active_showcase_id: string | null
}

type CustomizationContextType = {
  customization: UserCustomization | null
  equippedItems: {
    badge: ShopItem | null
    title: ShopItem | null
    theme: ShopItem | null
    card_design: ShopItem | null
    celebration: ShopItem | null
    whistle_sound: ShopItem | null
    showcase_layout: ShopItem | null
  }
  loading: boolean
  refreshCustomization: () => Promise<void>
}

const CustomizationContext = createContext<CustomizationContextType>({
  customization: null,
  equippedItems: {
    badge: null,
    title: null,
    theme: null,
    card_design: null,
    celebration: null,
    whistle_sound: null,
    showcase_layout: null,
  },
  loading: true,
  refreshCustomization: async () => {},
})

export function useCustomization() {
  return useContext(CustomizationContext)
}

export function CustomizationProvider({ children }: { children: ReactNode }) {
  const [customization, setCustomization] = useState<UserCustomization | null>(null)
  const [equippedItems, setEquippedItems] = useState<CustomizationContextType["equippedItems"]>({
    badge: null,
    title: null,
    theme: null,
    card_design: null,
    celebration: null,
    whistle_sound: null,
    showcase_layout: null,
  })
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  async function loadCustomization() {
    if (typeof window === "undefined" || !mounted) {
      setLoading(false)
      return
    }

    try {
      const supabase = createClient()

      let user = null
      try {
        const { data: { session } } = await supabase.auth.getSession()
        user = session?.user || null
      } catch (authFetchError) {
        setLoading(false)
        return
      }

      if (!user) {
        setLoading(false)
        return
      }

      const { data: customData } = await supabase
        .from("user_customization")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle()

      if (customData) {
        setCustomization(customData)

        const itemIds = [
          customData.active_badge_id,
          customData.active_title_id,
          customData.active_theme_id,
          customData.active_card_design_id,
          customData.active_celebration_id,
          customData.active_whistle_id,
          customData.active_showcase_id,
        ].filter(Boolean)

        if (itemIds.length > 0) {
          const { data: items } = await supabase.from("shop_items").select("*").in("id", itemIds)

          if (items) {
            const itemMap = new Map(items.map((item) => [item.id, item]))
            setEquippedItems({
              badge: itemMap.get(customData.active_badge_id) || null,
              title: itemMap.get(customData.active_title_id) || null,
              theme: itemMap.get(customData.active_theme_id) || null,
              card_design: itemMap.get(customData.active_card_design_id) || null,
              celebration: itemMap.get(customData.active_celebration_id) || null,
              whistle_sound: itemMap.get(customData.active_whistle_id) || null,
              showcase_layout: itemMap.get(customData.active_showcase_id) || null,
            })
          }
        }
      }
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (equippedItems.theme) {
      const themeData = equippedItems.theme.preview_data
      if (themeData) {
        const root = document.documentElement

        const isValidCssValue = (value: unknown): value is string => {
          return typeof value === "string" && value.trim().length > 0
        }

        if (isValidCssValue(themeData.primary)) {
          root.style.setProperty("--theme-primary", themeData.primary)
          root.style.setProperty("--primary", themeData.primary)
        }
        if (isValidCssValue(themeData.secondary)) {
          root.style.setProperty("--theme-secondary", themeData.secondary)
          root.style.setProperty("--secondary", themeData.secondary)
        }
        if (isValidCssValue(themeData.accent)) {
          root.style.setProperty("--theme-accent", themeData.accent)
          root.style.setProperty("--accent", themeData.accent)
        }
        if (isValidCssValue(themeData.background)) {
          root.style.setProperty("--theme-background", themeData.background)
        }

        root.setAttribute("data-custom-theme", equippedItems.theme.name.toLowerCase().replace(/\s+/g, "-"))
      }
    } else {
      const root = document.documentElement
      root.style.removeProperty("--theme-primary")
      root.style.removeProperty("--theme-secondary")
      root.style.removeProperty("--theme-accent")
      root.style.removeProperty("--theme-background")
      root.style.removeProperty("--primary")
      root.style.removeProperty("--secondary")
      root.style.removeProperty("--accent")
      root.removeAttribute("data-custom-theme")
    }
  }, [equippedItems.theme])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const timer = setTimeout(() => {
      loadCustomization()
    }, 50)

    let subscription: { unsubscribe: () => void } | null = null

    try {
      const supabase = createClient()
      const { data } = supabase.auth.onAuthStateChange(() => {
        loadCustomization()
      })
      subscription = data.subscription
    } catch (error) {
      // Silently handle subscription errors
    }

    return () => {
      clearTimeout(timer)
      subscription?.unsubscribe()
    }
  }, [mounted])

  return (
    <CustomizationContext.Provider
      value={{
        customization,
        equippedItems,
        loading,
        refreshCustomization: loadCustomization,
      }}
    >
      {children}
    </CustomizationContext.Provider>
  )
}
