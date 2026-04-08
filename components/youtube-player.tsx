"use client"

import { useEffect, useRef, useCallback, useState } from "react"

declare global {
  interface Window {
    YT: typeof YT
    onYouTubeIframeAPIReady: (() => void) | undefined
  }
}

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

let apiLoaded = false
let apiReady = false
const readyCallbacks: (() => void)[] = []

function loadYouTubeAPI(callback: () => void) {
  if (apiReady) {
    callback()
    return
  }

  readyCallbacks.push(callback)

  if (!apiLoaded) {
    apiLoaded = true
    const tag = document.createElement("script")
    tag.src = "https://www.youtube.com/iframe_api"
    document.head.appendChild(tag)

    window.onYouTubeIframeAPIReady = () => {
      apiReady = true
      readyCallbacks.forEach((cb) => cb())
      readyCallbacks.length = 0
    }
  }
}

interface YouTubePlayerProps {
  url: string
  className?: string
}

export function YouTubePlayer({ url, className }: YouTubePlayerProps) {
  const videoId = extractYouTubeId(url)
  const containerRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<YT.Player | null>(null)
  const playCountRef = useRef(0)

  const onPlayerStateChange = useCallback((event: YT.OnStateChangeEvent) => {
    // When video ends, alternate speed and replay
    if (event.data === YT.PlayerState.ENDED) {
      playCountRef.current += 1
      const nextRate = playCountRef.current % 2 === 1 ? 0.5 : 1
      event.target.setPlaybackRate(nextRate)
      event.target.seekTo(0, true)
      event.target.playVideo()
    }
  }, [])

  useEffect(() => {
    if (!videoId || !containerRef.current) return

    // Clear any existing content from previous mounts
    const container = containerRef.current
    container.innerHTML = ""

    const playerDiv = document.createElement("div")
    container.appendChild(playerDiv)

    let player: YT.Player | null = null
    let destroyed = false

    loadYouTubeAPI(() => {
      if (destroyed || !container.isConnected) return

      player = new window.YT.Player(playerDiv, {
        videoId,
        width: "100%",
        height: "100%",
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          iv_load_policy: 3,
          fs: 0,
          disablekb: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: (event: YT.PlayerEvent) => {
            event.target.setPlaybackRate(1)
            // Prevent iframe from receiving focus
            const iframe = container.querySelector("iframe")
            if (iframe) {
              iframe.setAttribute("tabindex", "-1")
              iframe.style.pointerEvents = "none"
            }
          },
          onStateChange: onPlayerStateChange,
        },
      })
      playerRef.current = player
    })

    return () => {
      destroyed = true
      if (playerRef.current) {
        playerRef.current.destroy()
        playerRef.current = null
      }
      container.innerHTML = ""
      playCountRef.current = 0
    }
  }, [videoId, onPlayerStateChange])

  if (!videoId) {
    return (
      <div className={`flex items-center justify-center aspect-video bg-muted rounded-lg ${className || ""}`}>
        <p className="text-sm text-muted-foreground">Invalid YouTube URL</p>
      </div>
    )
  }

  const [showTip, setShowTip] = useState(true)

  useEffect(() => {
    if (!showTip) return
    const timer = setTimeout(() => setShowTip(false), 4000)
    return () => clearTimeout(timer)
  }, [showTip])

  return (
    <div className={`relative w-full aspect-video ${className || ""}`}>
      <div ref={containerRef} className="w-full h-full" />
      <div className="absolute inset-0 z-10" />
      {showTip && (
        <div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-black/80 text-white text-sm px-4 py-2 rounded-full backdrop-blur-sm cursor-pointer transition-opacity"
          onClick={() => setShowTip(false)}
        >
          Pinch to zoom in on the video
        </div>
      )}
    </div>
  )
}

export { extractYouTubeId }
