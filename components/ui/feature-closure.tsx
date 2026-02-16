import Link from "next/link"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { FeatureClosure as FeatureClosureType } from "@/lib/feature-closures"
import { FEATURE_NAMES, FEATURE_PATHS } from "@/lib/feature-closures"

interface FeatureClosureProps {
  closure: FeatureClosureType
}

export function FeatureClosure({ closure }: FeatureClosureProps) {
  const getRecommendationUrl = () => {
    if (closure.recommendation_url) {
      return closure.recommendation_url
    }
    if (closure.recommendation_feature_key && closure.recommendation_feature_key in FEATURE_PATHS) {
      return FEATURE_PATHS[closure.recommendation_feature_key as keyof typeof FEATURE_PATHS]
    }
    return '/dashboard'
  }

  const getRecommendationText = () => {
    if (closure.recommendation_text) {
      return closure.recommendation_text
    }
    if (closure.recommendation_feature_key && closure.recommendation_feature_key in FEATURE_NAMES) {
      return `Try ${FEATURE_NAMES[closure.recommendation_feature_key as keyof typeof FEATURE_NAMES]}`
    }
    return 'Go to Dashboard'
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh] p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="h-8 w-8 text-orange-500" />
            <CardTitle className="text-2xl">Feature Temporarily Unavailable</CardTitle>
          </div>
          <CardDescription className="text-base">
            This feature is currently closed for maintenance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {closure.message && (
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-foreground">{closure.message}</p>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild className="flex-1">
              <Link href={getRecommendationUrl()}>
                {getRecommendationText()}
              </Link>
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <Link href="/dashboard">
                Back to Dashboard
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
