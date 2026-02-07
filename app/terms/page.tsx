import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata = {
  title: "Terms and Conditions - RefZone",
  description: "Terms and Conditions for using RefZone",
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="container mx-auto max-w-3xl">
        <Link 
          href="/auth/sign-up" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Sign Up
        </Link>
        
        <Card className="border-2 shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl">Terms and Conditions</CardTitle>
            <p className="text-muted-foreground">Last updated: February 2026</p>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Introduction and Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing, browsing, or using the website located at refzone.com.au and any associated services, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. These terms constitute a legally binding agreement between you and RefZone. If you do not agree to these terms, you must immediately cease using the website. We reserve the right to review and change any of the Terms by updating this page at our sole discretion. Any changes to the Terms take immediate effect from the date of their publication. It is your responsibility to check this page periodically for updates, as your continued use of the platform constitutes an acceptance of the revised terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. User Registration and Account Securitye</h2>
              <p className="text-muted-foreground leading-relaxed">
                In order to access certain features of the platform, you may be required to register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate and complete. You are solely responsible for safeguarding your password and for any activities or actions under your account, whether or not you have authorised such activities. RefZone cannot and will not be liable for any loss or damage arising from your failure to comply with these security requirements. We reserve the right to suspend or terminate your account if any information provided proves to be inaccurate, fraudulent, or in violation of these Terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. Acceptable Use and Prohibited Conduct</h2>
              <p className="text-muted-foreground leading-relaxed">
                The Services provided by RefZone are intended for personal or approved commercial use related to officiating and sports management. You agree that you will not use the website for any purpose that is unlawful or prohibited by these Terms. You are prohibited from using the site to harass, abuse, or harm another person, or to send spam or unsolicited communications. Furthermore, you agree not to engage in any activity that interferes with or disrupts the Service, such as uploading viruses or malicious code, or attempting to circumvent any security features of the site. Competitive use of the site, including the scraping of data for the benefit of a competing business, is strictly prohibited without express written consent.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Fees, Payments, and GST</h2>
              <p className="text-muted-foreground leading-relaxed">
                Where the use of the Service requires payment of a fee, you agree to pay all fees and charges specified at the point of purchase. All prices listed on refzone.com.au are quoted in Australian Dollars (AUD) and are inclusive of Goods and Services Tax (GST) unless otherwise stated, in accordance with the Australian Taxation Office (ATO) guidelines. RefZone reserves the right to change its pricing structure at any time. Payment must be made through our authorised third-party payment processors, and you warrant that you have the legal right to use the payment method provided. Failure to pay any fees when due may result in the immediate suspension or termination of your access to the Services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Intellectual Property Rights</h2>
              <p className="text-muted-foreground leading-relaxed">
                The material on the Website, including but not limited to text, graphics, logos, icons, and software, is protected by copyright and trademark laws under both Australian and international treaties. Unless otherwise indicated, all intellectual property rights are owned by or licensed to RefZone. You are granted a limited, non-exclusive, and non-transferable license to access and use the platform for its intended purpose. You must not modify, copy, distribute, transmit, display, perform, reproduce, publish, license, or create derivative works from any information or software obtained from this website without prior written permission from the authorised representative of RefZone.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Limitation of Liability and Indemnity</h2>
              <p className="text-muted-foreground leading-relaxed">
                To the maximum extent permitted by law, RefZone, its directors, and employees shall not be liable for any indirect, incidental, special, or consequential damages resulting from the use or the inability to use the Service. This includes, but is not limited to, damages for loss of profits, data, or other intangibles, even if we have been advised of the possibility of such damages. You agree to indemnify and hold RefZone harmless from and against any claims, liabilities, damages, losses, and expenses, including legal fees, arising out of or in any way connected with your access to or use of the Website or your violation of these Terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. Australian Consumer Law and Refunds</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our services come with guarantees that cannot be excluded under the Australian Consumer Law (ACL). For major failures with the service, you are entitled to cancel your service contract with us and receive a refund for the unused portion, or to compensation for its reduced value. If a failure with the service does not amount to a major failure, you are entitled to have the failure rectified in a reasonable time. Our refund policy is governed by these statutory rights, and any requests for refunds must be submitted in writing to our support team for assessment.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">8. Governing Law and Jurisdiction</h2>
              <p className="text-muted-foreground leading-relaxed">
                These Terms and Conditions are governed by and construed in accordance with the laws of Australia. Any disputes relating to these terms shall be subject to the exclusive jurisdiction of the courts in the state where RefZone is headquartered. If any provision of these Terms is found to be invalid or unenforceable by a court of law, such invalidity or unenforceability will not affect the remainder of the Terms, which will continue in full force and effect.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
