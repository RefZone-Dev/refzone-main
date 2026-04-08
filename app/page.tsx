import { MarketingHeader } from "@/components/marketing/marketing-header"
import { MarketingFooter } from "@/components/marketing/marketing-footer"
import { MarketingHomePage } from "@/components/marketing/marketing-home"

export default function HomePage() {
  return (
    <div data-marketing="" style={{ fontFamily: 'var(--font-inter), Inter, system-ui, sans-serif' }}>
      <MarketingHeader />
      <MarketingHomePage />
      <MarketingFooter />
    </div>
  )
}
