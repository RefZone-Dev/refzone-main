import { MarketingHeader } from '@/components/marketing/marketing-header'
import { MarketingFooter } from '@/components/marketing/marketing-footer'

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div data-marketing="" style={{ fontFamily: 'var(--font-inter), Inter, system-ui, sans-serif' }}>
      <MarketingHeader />
      {children}
      <MarketingFooter />
    </div>
  )
}
