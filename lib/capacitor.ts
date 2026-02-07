/**
 * Capacitor Environment Detection & Utilities
 * 
 * This module provides utilities for detecting Capacitor environment,
 * handling platform-specific behaviors, and managing native integrations.
 */

// Platform detection
export function isCapacitor(): boolean {
  if (typeof window === 'undefined') return false
  return !!(window as any).Capacitor?.isNativePlatform?.()
}

export function isIOS(): boolean {
  if (typeof window === 'undefined') return false
  const capacitor = (window as any).Capacitor
  if (capacitor?.getPlatform) {
    return capacitor.getPlatform() === 'ios'
  }
  // Fallback for browser detection
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
}

export function isAndroid(): boolean {
  if (typeof window === 'undefined') return false
  const capacitor = (window as any).Capacitor
  if (capacitor?.getPlatform) {
    return capacitor.getPlatform() === 'android'
  }
  // Fallback for browser detection
  return /Android/.test(navigator.userAgent)
}

export function isMobileWeb(): boolean {
  if (typeof window === 'undefined') return false
  if (isCapacitor()) return false
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

export function isDesktop(): boolean {
  if (typeof window === 'undefined') return false
  return !isCapacitor() && !isMobileWeb()
}

export function getPlatform(): 'ios' | 'android' | 'web' {
  if (isCapacitor()) {
    return isIOS() ? 'ios' : 'android'
  }
  return 'web'
}

// Safe area insets for native apps
export function getSafeAreaInsets(): { top: number; bottom: number; left: number; right: number } {
  if (typeof window === 'undefined') {
    return { top: 0, bottom: 0, left: 0, right: 0 }
  }
  
  const style = getComputedStyle(document.documentElement)
  return {
    top: parseInt(style.getPropertyValue('--safe-area-inset-top') || '0', 10),
    bottom: parseInt(style.getPropertyValue('--safe-area-inset-bottom') || '0', 10),
    left: parseInt(style.getPropertyValue('--safe-area-inset-left') || '0', 10),
    right: parseInt(style.getPropertyValue('--safe-area-inset-right') || '0', 10),
  }
}

// Status bar management (for Capacitor)
export async function setStatusBarStyle(style: 'light' | 'dark'): Promise<void> {
  if (!isCapacitor()) return
  
  try {
    const { StatusBar, Style } = await import('@capacitor/status-bar')
    await StatusBar.setStyle({ style: style === 'light' ? Style.Light : Style.Dark })
  } catch {
    // StatusBar plugin not available
  }
}

// Keyboard handling for Capacitor
export async function hideKeyboard(): Promise<void> {
  if (!isCapacitor()) return
  
  try {
    const { Keyboard } = await import('@capacitor/keyboard')
    await Keyboard.hide()
  } catch {
    // Keyboard plugin not available
  }
}

// Deep linking utilities
export function parseDeepLink(url: string): { path: string; params: Record<string, string> } | null {
  try {
    const parsed = new URL(url)
    const params: Record<string, string> = {}
    parsed.searchParams.forEach((value, key) => {
      params[key] = value
    })
    return {
      path: parsed.pathname,
      params,
    }
  } catch {
    return null
  }
}

// Handle external links - open in browser instead of WebView
export function openExternalLink(url: string): void {
  if (isCapacitor()) {
    // Use Capacitor Browser plugin for external links
    import('@capacitor/browser').then(({ Browser }) => {
      Browser.open({ url })
    }).catch(() => {
      // Fallback
      window.open(url, '_blank')
    })
  } else {
    window.open(url, '_blank')
  }
}

// Check if running in standalone mode (PWA or native)
export function isStandalone(): boolean {
  if (typeof window === 'undefined') return false
  if (isCapacitor()) return true
  return window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true
}

// App state management
export type AppState = 'active' | 'inactive' | 'background'

export function onAppStateChange(callback: (state: AppState) => void): () => void {
  if (typeof window === 'undefined') return () => {}
  
  if (isCapacitor()) {
    // Use Capacitor App plugin for native state changes
    let cleanup: (() => void) | null = null
    
    import('@capacitor/app').then(({ App }) => {
      const listener = App.addListener('appStateChange', ({ isActive }) => {
        callback(isActive ? 'active' : 'background')
      })
      cleanup = () => listener.remove()
    }).catch(() => {
      // Fallback to visibilitychange
      const handler = () => {
        callback(document.visibilityState === 'visible' ? 'active' : 'background')
      }
      document.addEventListener('visibilitychange', handler)
      cleanup = () => document.removeEventListener('visibilitychange', handler)
    })
    
    return () => cleanup?.()
  } else {
    // Web fallback
    const handler = () => {
      callback(document.visibilityState === 'visible' ? 'active' : 'background')
    }
    document.addEventListener('visibilitychange', handler)
    return () => document.removeEventListener('visibilitychange', handler)
  }
}

// Network status utilities
export async function getNetworkStatus(): Promise<{ connected: boolean; connectionType: string }> {
  if (isCapacitor()) {
    try {
      const { Network } = await import('@capacitor/network')
      const status = await Network.getStatus()
      return {
        connected: status.connected,
        connectionType: status.connectionType,
      }
    } catch {
      // Fallback
    }
  }
  
  return {
    connected: typeof navigator !== 'undefined' ? navigator.onLine : true,
    connectionType: 'unknown',
  }
}

// Haptic feedback for native apps
export async function hapticFeedback(type: 'light' | 'medium' | 'heavy' = 'medium'): Promise<void> {
  if (!isCapacitor()) return
  
  try {
    const { Haptics, ImpactStyle } = await import('@capacitor/haptics')
    const styleMap = {
      light: ImpactStyle.Light,
      medium: ImpactStyle.Medium,
      heavy: ImpactStyle.Heavy,
    }
    await Haptics.impact({ style: styleMap[type] })
  } catch {
    // Haptics plugin not available
  }
}
