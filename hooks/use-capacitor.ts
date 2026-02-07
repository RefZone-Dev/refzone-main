"use client"

import { useState, useEffect } from 'react'
import {
  isCapacitor,
  isIOS,
  isAndroid,
  isMobileWeb,
  isDesktop,
  isStandalone,
  getPlatform,
  onAppStateChange,
  type AppState,
} from '@/lib/capacitor'

interface CapacitorState {
  isNative: boolean
  isIOS: boolean
  isAndroid: boolean
  isMobileWeb: boolean
  isDesktop: boolean
  isStandalone: boolean
  platform: 'ios' | 'android' | 'web'
  appState: AppState
  isReady: boolean
}

/**
 * Hook for detecting Capacitor environment and platform
 */
export function useCapacitor(): CapacitorState {
  const [state, setState] = useState<CapacitorState>({
    isNative: false,
    isIOS: false,
    isAndroid: false,
    isMobileWeb: false,
    isDesktop: true,
    isStandalone: false,
    platform: 'web',
    appState: 'active',
    isReady: false,
  })

  useEffect(() => {
    // Detect environment on mount
    setState({
      isNative: isCapacitor(),
      isIOS: isIOS(),
      isAndroid: isAndroid(),
      isMobileWeb: isMobileWeb(),
      isDesktop: isDesktop(),
      isStandalone: isStandalone(),
      platform: getPlatform(),
      appState: 'active',
      isReady: true,
    })

    // Listen for app state changes
    const cleanup = onAppStateChange((appState) => {
      setState((prev) => ({ ...prev, appState }))
    })

    return cleanup
  }, [])

  return state
}

/**
 * Hook that returns true only when running in Capacitor native environment
 */
export function useIsNative(): boolean {
  const { isNative, isReady } = useCapacitor()
  return isReady && isNative
}

/**
 * Hook for app state (active/inactive/background)
 */
export function useAppState(): AppState {
  const { appState } = useCapacitor()
  return appState
}
