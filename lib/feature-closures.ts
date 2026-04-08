import { createServiceClient } from "@/lib/supabase/service"
import type { FeatureKey, FeatureClosure } from "@/lib/feature-closures-types"

export type { FeatureKey, FeatureClosure } from "@/lib/feature-closures-types"
export { FEATURE_PATHS, FEATURE_NAMES } from "@/lib/feature-closures-types"

export async function checkFeatureClosure(featureKey: FeatureKey): Promise<FeatureClosure | null> {
  const supabase = createServiceClient()
  
  const { data, error } = await supabase
    .from('feature_closures')
    .select('*')
    .eq('feature_key', featureKey)
    .eq('is_closed', true)
    .single()
  
  if (error || !data) {
    return null
  }
  
  return data as FeatureClosure
}
