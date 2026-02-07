import { createClient } from '@/lib/supabase/client'

export type ActivityType =
  | 'page_view'
  | 'quiz_start'
  | 'quiz_complete'
  | 'scenario_start'
  | 'scenario_complete'
  | 'decision_lab_use'
  | 'forum_post_create'
  | 'forum_post_view'
  | 'report_generate'
  | 'shop_purchase'
  | 'achievement_unlock'
  | 'login'
  | 'logout'
  | 'profile_update'
  | 'friend_request'
  | 'notification_read'

interface LogActivityParams {
  actionType: ActivityType
  actionDetails?: Record<string, any>
  durationSeconds?: number
}

let sessionId: string | null = null

// Generate or retrieve session ID
function getSessionId(): string {
  if (sessionId) return sessionId

  // Try to get from sessionStorage
  if (typeof window !== 'undefined') {
    const stored = sessionStorage.getItem('activity_session_id')
    if (stored) {
      sessionId = stored
      return stored
    }

    // Generate new session ID
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
    sessionStorage.setItem('activity_session_id', sessionId)
  } else {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
  }

  return sessionId
}

export async function logActivity({
  actionType,
  actionDetails = {},
  durationSeconds = 0,
}: LogActivityParams) {
  try {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return // Don't log if not authenticated

    const { error } = await supabase.from('user_activity_log').insert({
      user_id: user.id,
      action_type: actionType,
      action_details: actionDetails,
      session_id: getSessionId(),
      duration_seconds: durationSeconds,
      ip_address: null, // Could be captured server-side
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
    })

    if (error) {
      console.error('[v0] Failed to log activity:', error)
    }
  } catch (error) {
    console.error('[v0] Error logging activity:', error)
  }
}

// Helper to track page views
export function logPageView(pageName: string) {
  logActivity({
    actionType: 'page_view',
    actionDetails: { page: pageName },
  })
}

// Helper to track timed activities
export class ActivityTimer {
  private startTime: number
  private actionType: ActivityType
  private actionDetails: Record<string, any>

  constructor(actionType: ActivityType, actionDetails: Record<string, any> = {}) {
    this.startTime = Date.now()
    this.actionType = actionType
    this.actionDetails = actionDetails
  }

  end(additionalDetails: Record<string, any> = {}) {
    const duration = Math.round((Date.now() - this.startTime) / 1000)
    logActivity({
      actionType: this.actionType,
      actionDetails: { ...this.actionDetails, ...additionalDetails },
      durationSeconds: duration,
    })
  }
}
