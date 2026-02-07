"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ShieldAlert } from "lucide-react"

interface AgeRestrictionBannerProps {
  feature: string
}

export function AgeRestrictionBanner({ feature }: AgeRestrictionBannerProps) {
  return (
    <Card className="border-2 border-amber-500/30 bg-amber-50 dark:bg-amber-950/20">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center gap-4 py-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
            <ShieldAlert className="h-7 w-7 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Age Restriction</h3>
            <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
              {`Access to ${feature} is restricted for users under 16 in compliance with Australian law, including the Online Safety Amendment (Social Media Minimum Age) Act 2024. This feature will become available when you turn 16.`}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
