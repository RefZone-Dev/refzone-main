export function PageLoader({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6">
        {/* Rolling soccer ball */}
        <div className="relative w-56 h-20 flex items-center justify-center">
          <div className="soccer-ball" />
        </div>

        {/* Loading text with animated dots */}
        <div className="flex items-center gap-1.5">
          <span className="text-lg font-medium text-foreground">{message}</span>
          <span className="flex gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:0ms]" />
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:150ms]" />
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:300ms]" />
          </span>
        </div>

        {/* Subtle progress bar */}
        <div className="h-1 w-48 overflow-hidden rounded-full bg-muted">
          <div className="h-full w-1/3 rounded-full bg-primary animate-[shimmer_1.5s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  )
}

// Simpler inline loader for components
export function InlineLoader({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
      <div className="relative w-56 h-20 flex items-center justify-center">
        <div className="soccer-ball" />
      </div>
      <p className="text-muted-foreground">{message}</p>
    </div>
  )
}
