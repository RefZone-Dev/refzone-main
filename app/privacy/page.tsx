import Link from "next/link"
import { RefZoneLogo } from "@/components/refzone-logo"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export const metadata = {
  title: "Privacy Policy - RefZone",
  description: "RefZone Privacy Policy - How we collect, use, and protect your personal information.",
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <RefZoneLogo />
          <Button variant="outline" asChild className="bg-transparent cursor-pointer">
            <Link href="/"><ArrowLeft className="h-4 w-4 mr-2" />Back</Link>
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-foreground mb-2">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: February 2026</p>

        <div className="prose dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. Purpose-Driven Collection of Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              RefZone operates on a principle of purposeful data acquisition, ensuring that every piece of information collected—including your name, email address, telephone number, and age—is gathered for a specific and documented business reason. We collect this data to facilitate the core operational requirements of our sports officiating platform, verify user identity and eligibility, and maintain a secure service environment. By providing your information, you acknowledge that its collection is necessary for the ongoing development, maintenance, and commercial sustainability of the RefZone ecosystem.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. Trading and Disclosure of Personal Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              {"RefZone engages in the commercial exchange of data as a fundamental part of its business model. By using our services and providing your information, you acknowledge and agree that RefZone may sell or license your personal data—including your name, email, phone number, and age—to third-party commercial partners, marketing firms, or data aggregators. This \"trading in personal information\" is conducted for the commercial benefit of RefZone and to allow third parties to offer relevant products and services to our user base. We take reasonable steps to ensure that any third party receiving this data is bound by confidentiality obligations, although we cannot guarantee their absolute adherence to these terms once the data has been transferred."}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. Use of Information for Primary and Secondary Purposes</h2>
            <p className="text-muted-foreground leading-relaxed">
              The primary purpose for collecting your information is to facilitate the functional services of RefZone, such as managing match assignments and user accounts. However, we also use this data for secondary purposes, including targeted direct marketing, business analytics, and the generation of commercial revenue through data partnerships. This multifaceted use of data ensures that RefZone can remain a viable service provider. If you do not wish for your information to be used for secondary marketing purposes, you may exercise your right to opt-out at any time by contacting our Privacy Officer.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. Data Security and Storage</h2>
            <p className="text-muted-foreground leading-relaxed">
              We are committed to ensuring that your personal information is stored securely while it is in our possession. RefZone implements a variety of physical and electronic security measures, including encryption and strict access controls, to protect your data from misuse, interference, loss, or unauthorised access. We store your data on secure servers located within Australia or with trusted global cloud service providers. Despite these rigorous measures, no method of transmission over the internet or electronic storage is entirely secure, and you provide your information to us at your own risk.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Access, Correction, and Complaints</h2>
            <p className="text-muted-foreground leading-relaxed">
              Under the Privacy Act 1988 (Cth), you have the right to request access to the personal information we hold about you and to ask for it to be corrected if it is inaccurate or out of date. If you wish to access your data or believe that RefZone has breached the Australian Privacy Principles (APPs), you should submit a formal request or complaint to our designated contact point. We will investigate any complaints and provide a response within a reasonable timeframe, typically 30 days. If you are unsatisfied with our response, you may contact the Office of the Australian Information Commissioner (OAIC) for further review.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">6. Consent and Minors Under the Age of 16</h2>
            <p className="text-muted-foreground leading-relaxed">
              For the purposes of this policy, RefZone defines a minor as any individual under the age of 16. By providing your personal information, you provide your express and informed consent for us to collect, use, and disclose that information as described in this policy, including its sale to third parties. We do not knowingly collect or sell information from individuals under the age of 16 without verifiable parental or guardian consent. If we become aware that we have inadvertently collected data from a minor under 16 without such consent, we will take immediate steps to delete that information from our records to ensure compliance with Australian protection standards.
            </p>
          </section>

          <section className="border-t pt-6">
            <h2 className="text-xl font-semibold text-foreground mb-3">Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about this privacy policy or your personal data, please contact us at{" "}
              <a href="mailto:admin@refzone.com.au" className="text-primary hover:underline">admin@refzone.com.au</a>.
            </p>
          </section>
        </div>
      </main>
    </div>
  )
}
