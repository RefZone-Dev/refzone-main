/**
 * Push Notification Utilities for Capacitor
 * 
 * Handles push token registration, notification permissions,
 * and notification delivery for iOS and Android.
 */

import { isCapacitor, isIOS, isAndroid } from './capacitor'

export interface PushNotificationToken {
  value: string
  platform: 'ios' | 'android' | 'web'
}

export interface NotificationData {
  title: string
  body: string
  data?: Record<string, string>
}

// Check if push notifications are supported
export function isPushSupported(): boolean {
  if (isCapacitor()) {
    return true // Both iOS and Android support push via Capacitor
  }
  // Web push support check
  return typeof window !== 'undefined' && 'Notification' in window && 'serviceWorker' in navigator
}

// Request notification permission
export async function requestNotificationPermission(): Promise<'granted' | 'denied' | 'default'> {
  if (isCapacitor()) {
    try {
      const { PushNotifications } = await import('@capacitor/push-notifications')
      const result = await PushNotifications.requestPermissions()
      
      if (result.receive === 'granted') {
        return 'granted'
      }
      return result.receive === 'denied' ? 'denied' : 'default'
    } catch (error) {
      console.error('[v0] Failed to request push permissions:', error)
      return 'denied'
    }
  }
  
  // Web fallback
  if (typeof window !== 'undefined' && 'Notification' in window) {
    const permission = await Notification.requestPermission()
    return permission
  }
  
  return 'denied'
}

// Get current notification permission status
export async function getNotificationPermission(): Promise<'granted' | 'denied' | 'default'> {
  if (isCapacitor()) {
    try {
      const { PushNotifications } = await import('@capacitor/push-notifications')
      const result = await PushNotifications.checkPermissions()
      
      if (result.receive === 'granted') {
        return 'granted'
      }
      return result.receive === 'denied' ? 'denied' : 'default'
    } catch {
      return 'denied'
    }
  }
  
  // Web fallback
  if (typeof window !== 'undefined' && 'Notification' in window) {
    return Notification.permission
  }
  
  return 'denied'
}

// Register for push notifications and get token
export async function registerForPushNotifications(): Promise<PushNotificationToken | null> {
  if (!isCapacitor()) {
    // Web push registration would go here
    // For now, we don't support web push
    return null
  }
  
  try {
    const { PushNotifications } = await import('@capacitor/push-notifications')
    
    // Request permission first
    const permission = await requestNotificationPermission()
    if (permission !== 'granted') {
      console.log('[v0] Push notification permission not granted')
      return null
    }
    
    // Register with native push services
    await PushNotifications.register()
    
    // Wait for registration to complete and get token
    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        resolve(null)
      }, 10000) // 10 second timeout
      
      PushNotifications.addListener('registration', (token) => {
        clearTimeout(timeout)
        resolve({
          value: token.value,
          platform: isIOS() ? 'ios' : 'android',
        })
      })
      
      PushNotifications.addListener('registrationError', (error) => {
        clearTimeout(timeout)
        console.error('[v0] Push registration error:', error)
        resolve(null)
      })
    })
  } catch (error) {
    console.error('[v0] Failed to register for push notifications:', error)
    return null
  }
}

// Setup push notification listeners
export function setupPushNotificationListeners(handlers: {
  onNotificationReceived?: (notification: NotificationData) => void
  onNotificationTapped?: (notification: NotificationData & { actionId?: string }) => void
}): () => void {
  if (!isCapacitor()) {
    return () => {}
  }
  
  const cleanupFunctions: (() => void)[] = []
  
  import('@capacitor/push-notifications').then(({ PushNotifications }) => {
    // Handle notification received while app is open
    if (handlers.onNotificationReceived) {
      const listener = PushNotifications.addListener(
        'pushNotificationReceived',
        (notification) => {
          handlers.onNotificationReceived?.({
            title: notification.title || '',
            body: notification.body || '',
            data: notification.data,
          })
        }
      )
      cleanupFunctions.push(() => listener.remove())
    }
    
    // Handle notification tap
    if (handlers.onNotificationTapped) {
      const listener = PushNotifications.addListener(
        'pushNotificationActionPerformed',
        (action) => {
          handlers.onNotificationTapped?.({
            title: action.notification.title || '',
            body: action.notification.body || '',
            data: action.notification.data,
            actionId: action.actionId,
          })
        }
      )
      cleanupFunctions.push(() => listener.remove())
    }
  }).catch((error) => {
    console.error('[v0] Failed to setup push notification listeners:', error)
  })
  
  return () => {
    cleanupFunctions.forEach((cleanup) => cleanup())
  }
}

// Local notification utilities (for testing/fallback)
export async function scheduleLocalNotification(notification: {
  id: number
  title: string
  body: string
  scheduleAt?: Date
  data?: Record<string, string>
}): Promise<void> {
  if (!isCapacitor()) {
    // Web notification fallback
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      if (notification.scheduleAt) {
        const delay = notification.scheduleAt.getTime() - Date.now()
        if (delay > 0) {
          setTimeout(() => {
            new Notification(notification.title, { body: notification.body })
          }, delay)
        }
      } else {
        new Notification(notification.title, { body: notification.body })
      }
    }
    return
  }
  
  try {
    const { LocalNotifications } = await import('@capacitor/local-notifications')
    
    await LocalNotifications.schedule({
      notifications: [
        {
          id: notification.id,
          title: notification.title,
          body: notification.body,
          schedule: notification.scheduleAt ? { at: notification.scheduleAt } : undefined,
          extra: notification.data,
        },
      ],
    })
  } catch (error) {
    console.error('[v0] Failed to schedule local notification:', error)
  }
}

// Cancel a scheduled local notification
export async function cancelLocalNotification(id: number): Promise<void> {
  if (!isCapacitor()) return
  
  try {
    const { LocalNotifications } = await import('@capacitor/local-notifications')
    await LocalNotifications.cancel({ notifications: [{ id }] })
  } catch (error) {
    console.error('[v0] Failed to cancel local notification:', error)
  }
}

// Get all pending local notifications
export async function getPendingNotifications(): Promise<{ id: number; title: string; body: string }[]> {
  if (!isCapacitor()) return []
  
  try {
    const { LocalNotifications } = await import('@capacitor/local-notifications')
    const result = await LocalNotifications.getPending()
    return result.notifications.map((n) => ({
      id: n.id,
      title: n.title || '',
      body: n.body || '',
    }))
  } catch {
    return []
  }
}

// Badge management (iOS)
export async function setBadgeCount(count: number): Promise<void> {
  if (!isCapacitor() || !isIOS()) return
  
  try {
    const { Badge } = await import('@capawesome/capacitor-badge')
    await Badge.set({ count })
  } catch {
    // Badge plugin not available
  }
}

export async function clearBadge(): Promise<void> {
  if (!isCapacitor() || !isIOS()) return
  
  try {
    const { Badge } = await import('@capawesome/capacitor-badge')
    await Badge.clear()
  } catch {
    // Badge plugin not available
  }
}
