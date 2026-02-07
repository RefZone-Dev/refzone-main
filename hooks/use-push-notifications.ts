"use client"

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { isCapacitor, parseDeepLink } from '@/lib/capacitor'
import {
  isPushSupported,
  requestNotificationPermission,
  getNotificationPermission,
  registerForPushNotifications,
  setupPushNotificationListeners,
  type NotificationData,
} from '@/lib/push-notifications'

interface UsePushNotificationsOptions {
  onNotificationReceived?: (notification: NotificationData) => void
  onNotificationTapped?: (notification: NotificationData & { actionId?: string }) => void
  autoRegister?: boolean
}

interface PushNotificationState {
  isSupported: boolean
  permission: 'granted' | 'denied' | 'default'
  isRegistered: boolean
  isLoading: boolean
  error: string | null
}

export function usePushNotifications(options: UsePushNotificationsOptions = {}) {
  const { onNotificationReceived, onNotificationTapped, autoRegister = false } = options
  const router = useRouter()
  
  const [state, setState] = useState<PushNotificationState>({
    isSupported: false,
    permission: 'default',
    isRegistered: false,
    isLoading: false,
    error: null,
  })

  // Check initial state
  useEffect(() => {
    const checkState = async () => {
      const supported = isPushSupported()
      const permission = await getNotificationPermission()
      
      setState(prev => ({
        ...prev,
        isSupported: supported,
        permission,
      }))
      
      // Auto-register if enabled and permission already granted
      if (autoRegister && supported && permission === 'granted') {
        registerToken()
      }
    }
    
    checkState()
  }, [autoRegister])

  // Setup notification listeners
  useEffect(() => {
    const defaultTapHandler = (notification: NotificationData & { actionId?: string }) => {
      // Handle deep links from notification data
      if (notification.data?.link) {
        const parsed = parseDeepLink(notification.data.link)
        if (parsed) {
          router.push(parsed.path)
        }
      } else if (notification.data?.screen) {
        // Direct screen navigation
        router.push(notification.data.screen)
      }
    }

    const cleanup = setupPushNotificationListeners({
      onNotificationReceived: onNotificationReceived || undefined,
      onNotificationTapped: onNotificationTapped || defaultTapHandler,
    })

    return cleanup
  }, [router, onNotificationReceived, onNotificationTapped])

  // Register for push notifications
  const registerToken = useCallback(async () => {
    if (!isCapacitor()) {
      // Web doesn't need token registration for now
      return { success: true }
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const token = await registerForPushNotifications()
      
      if (!token) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Failed to get push token',
        }))
        return { success: false, error: 'Failed to get push token' }
      }

      // Send token to server
      const response = await fetch('/api/push/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: token.value,
          platform: token.platform,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to register token with server')
      }

      setState(prev => ({
        ...prev,
        isLoading: false,
        isRegistered: true,
        permission: 'granted',
      }))

      return { success: true, token }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: message,
      }))
      return { success: false, error: message }
    }
  }, [])

  // Request permission and register
  const requestPermissionAndRegister = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const permission = await requestNotificationPermission()
      
      setState(prev => ({ ...prev, permission }))

      if (permission !== 'granted') {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Notification permission denied',
        }))
        return { success: false, error: 'Permission denied' }
      }

      // Permission granted, register token
      return registerToken()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: message,
      }))
      return { success: false, error: message }
    }
  }, [registerToken])

  // Unregister push token
  const unregister = useCallback(async (token: string) => {
    try {
      const response = await fetch('/api/push/register', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })

      if (!response.ok) {
        throw new Error('Failed to unregister token')
      }

      setState(prev => ({ ...prev, isRegistered: false }))
      return { success: true }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      return { success: false, error: message }
    }
  }, [])

  return {
    ...state,
    requestPermissionAndRegister,
    registerToken,
    unregister,
  }
}
