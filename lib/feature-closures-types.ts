export type FeatureKey = 'quizzes' | 'scenarios' | 'forum' | 'decision_lab' | 'reports' | 'profile'

export interface FeatureClosure {
  id: string
  feature_key: FeatureKey
  is_closed: boolean
  message: string | null
  recommendation_text: string | null
  recommendation_url: string | null
  recommendation_feature_key: string | null
  closed_by: string | null
  closed_at: string | null
  created_at: string
  updated_at: string
}

export const FEATURE_PATHS: Record<FeatureKey, string> = {
  'quizzes': '/quizzes',
  'scenarios': '/scenarios',
  'forum': '/forum',
  'decision_lab': '/decision-lab',
  'reports': '/reports',
  'profile': '/profile'
}

export const FEATURE_NAMES: Record<FeatureKey, string> = {
  'quizzes': 'Quizzes',
  'scenarios': 'Scenarios',
  'forum': 'Forum',
  'decision_lab': 'Decision Lab',
  'reports': 'Reports',
  'profile': 'Profile'
}
