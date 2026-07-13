import { SiteNav } from '../components/SiteNav'
import { HimalayaHero } from '../components/HimalayaHero'
import { ServicesGrid } from '../components/ServicesGrid'
import { TrekMatcher } from '../components/TrekMatcher'
import { ProcessSteps } from '../components/ProcessSteps'
import { GuideSection } from '../components/GuideSection'
import { FeaturedTreks } from '../components/FeaturedTreks'
import { Testimonials } from '../components/Testimonials'
import { CtaBand } from '../components/CtaBand'
import { SiteFooter } from '../components/SiteFooter'
import { ChatDock } from '../components/ChatDock'

export function HomePage({ treks, loading }) {
  return (
    <div className="min-h-screen bg-base text-ink selection:bg-accent/20">
      <SiteNav variant="dark" />
      <HimalayaHero />
      <ServicesGrid />
      <TrekMatcher treks={treks} loading={loading} />
      <ProcessSteps />
      <GuideSection />
      <FeaturedTreks treks={treks} loading={loading} />
      <Testimonials />
      <CtaBand />
      <SiteFooter />
      <ChatDock />
    </div>
  )
}
