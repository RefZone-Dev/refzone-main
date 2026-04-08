import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service — RefZone',
  description:
    'RefZone Terms of Service. Read the terms and conditions governing your use of our referee training platform.',
}

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-9 pt-40 pb-20">
      <h1 className="text-4xl tracking-tight text-white">
        Terms of Service
      </h1>
      <p className="mt-2 text-sm text-white/20">
        Effective date: April 5, 2026
      </p>

      <div className="mt-12 space-y-10 text-white/45 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-white [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-white [&_p]:mt-2 [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_ol]:mt-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-1">
        {/* ---------------------------------------------------------------- */}
        {/* 1. Acceptance of Terms */}
        {/* ---------------------------------------------------------------- */}
        <section>
          <h2>1. Acceptance of Terms</h2>
          <p>
            These Terms of Service (&quot;Terms&quot;) constitute a legally
            binding agreement between you (&quot;User,&quot; &quot;you,&quot;
            or &quot;your&quot;) and RefZone (&quot;RefZone,&quot;
            &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), governing your
            access to and use of the RefZone platform, website located at
            refzone.com.au, and any related services (collectively, the
            &quot;Service&quot;).
          </p>
          <p>
            By creating an account, accessing, or using the Service in any
            manner, you acknowledge that you have read, understood, and agree
            to be bound by these Terms and our{' '}
            <a href="/privacy" className="text-purple-400 hover:text-purple-300">
              Privacy Policy
            </a>
            . If you are using the Service on behalf of a referee association,
            club, or other organisation, you represent and warrant that you
            have the authority to bind that organisation to these Terms, and
            &quot;you&quot; and &quot;your&quot; will refer to that
            organisation.
          </p>
          <p>
            If you do not agree to these Terms, you must not access or use the
            Service. Continued use of the Service after any modifications to
            these Terms constitutes acceptance of the revised Terms.
          </p>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* 2. Description of Service */}
        {/* ---------------------------------------------------------------- */}
        <section>
          <h2>2. Description of Service</h2>
          <p>
            RefZone is an advanced football (soccer) referee training
            platform designed to help referees at all levels improve their
            knowledge and decision-making skills. The Service includes, but is
            not limited to, the following features:
          </p>
          <ul>
            <li>
              <strong>Game Scenarios:</strong> Algorithm-generated and curated match
              situations that test your ability to apply the Laws of the Game
              to realistic in-game incidents
            </li>
            <li>
              <strong>Quizzes:</strong> Structured knowledge tests covering
              all 17 Laws of the Game as defined by the International Football
              Association Board (IFAB), with instant feedback and explanations
            </li>
            <li>
              <strong>Decision Lab:</strong> A specialised conversational
              training assistant that allows you to discuss specific scenarios,
              ask questions about the Laws of the Game, and receive detailed
              analysis and explanations
            </li>
            <li>
              <strong>Analytics Dashboard:</strong> Personalised performance
              tracking showing your accuracy rates, strengths and weaknesses
              across law categories, progress over time, and comparison metrics
            </li>
            <li>
              <strong>Streaks:</strong> Daily streak tracking designed to
              encourage consistent training habits
            </li>
            <li>
              <strong>Community Features:</strong> Discussion forums,
              knowledge sharing, and collaborative learning features for the
              referee community
            </li>
          </ul>
          <p>
            We reserve the right to modify, enhance, or discontinue any
            feature of the Service at any time, with or without notice, subject
            to the provisions in Section 14 of these Terms.
          </p>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* 3. Account Registration */}
        {/* ---------------------------------------------------------------- */}
        <section>
          <h2>3. Account Registration</h2>
          <h3>3.1 Account Creation</h3>
          <p>
            To use the Service, you must create an account by providing
            accurate, current, and complete information. Account
            authentication is managed through our third-party authentication
            provider (currently Clerk). You may register using an email address
            and password, or through supported single sign-on providers (e.g.,
            Google).
          </p>
          <h3>3.2 Account Security</h3>
          <p>
            You are solely responsible for maintaining the confidentiality of
            your account credentials and for all activities that occur under
            your account. You agree to immediately notify RefZone at{' '}
            <a href="mailto:admin@refzone.com.au" className="text-purple-400 hover:text-purple-300">
              admin@refzone.com.au
            </a>{' '}
            if you become aware of any unauthorised use of your account or any
            other breach of security.
          </p>
          <h3>3.3 Age Requirements</h3>
          <p>
            You must be at least 13 years of age to create an account and use
            the Service. If you are between 13 and 16, you represent that you
            have obtained parental or guardian consent to use the Service. If
            you are under 18, you represent that you have reviewed these Terms
            with a parent or guardian who has agreed to them on your behalf. By
            using the Service, you represent and warrant that you meet these
            eligibility requirements.
          </p>
          <h3>3.4 One Account per Person</h3>
          <p>
            Each individual may maintain only one account. Creating multiple
            accounts for any purpose &mdash; including to circumvent
            suspensions, artificially inflate statistics, or gain any unfair
            advantage &mdash; is a violation of these Terms and may result in
            termination of all associated accounts.
          </p>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* 4. Acceptable Use Policy */}
        {/* ---------------------------------------------------------------- */}
        <section>
          <h2>4. Acceptable Use Policy</h2>
          <p>
            You agree to use the Service only for lawful purposes and in
            compliance with these Terms. You agree not to:
          </p>
          <ul>
            <li>
              <strong>Cheat or manipulate results:</strong> Use any automated
              tools, scripts, browser extensions, or external aids to answer
              quizzes or scenarios, or artificially inflate your scores
            </li>
            <li>
              <strong>Share answers:</strong> Distribute, publish, or share
              specific quiz answers, scenario solutions, or answer keys in any
              form (including screenshots, text, or verbal communication) that
              would undermine the integrity of the training experience for
              other users
            </li>
            <li>
              <strong>Abuse platform features:</strong> Use the Decision Lab or
              any automated feature for purposes unrelated to referee training
              and education, including attempting to generate content that is
              harmful, offensive, discriminatory, or unrelated to football
              refereeing
            </li>
            <li>
              <strong>Bot or scrape:</strong> Use bots, scrapers, crawlers, or
              any automated means to access, collect data from, or interact
              with the Service, including scraping quiz content, scenario text,
              or user data
            </li>
            <li>
              <strong>Harass or abuse other users:</strong> Engage in
              harassment, bullying, intimidation, or abusive behaviour toward
              other users through community features, comments, or any other
              communication channel on the platform
            </li>
            <li>
              <strong>Impersonate:</strong> Impersonate another person,
              referee, or entity, or falsely claim verified referee status or
              affiliation with a referee association
            </li>
            <li>
              <strong>Circumvent security:</strong> Attempt to gain
              unauthorised access to, interfere with, damage, or disrupt any
              part of the Service, its servers, or any network connected to the
              Service
            </li>
            <li>
              <strong>Reverse engineer:</strong> Decompile, reverse engineer,
              disassemble, or otherwise attempt to derive the source code or
              underlying algorithms of the Service, including our models and
              quiz generation systems
            </li>
            <li>
              <strong>Commercial exploitation:</strong> Resell, redistribute,
              or sublicense the Service or any content thereof without our
              express written consent
            </li>
            <li>
              <strong>Violate laws:</strong> Violate any applicable local,
              state, national, or international law or regulation
            </li>
          </ul>
          <p>
            We reserve the right to investigate and take appropriate action
            against anyone who, in our sole discretion, violates this
            Acceptable Use Policy, including without limitation removing
            content, resetting scores, suspending or terminating
            the offender&apos;s account, and reporting the offender to law
            enforcement authorities where appropriate.
          </p>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* 5. Generated Content Disclaimer */}
        {/* ---------------------------------------------------------------- */}
        <section>
          <h2>5. Generated Content Disclaimer</h2>
          <h3>5.1 Nature of Generated Content</h3>
          <p>
            The Decision Lab feature and certain other components of the
            Service use advanced algorithms and language models to generate
            training content, feedback, and explanations. Generated content is
            provided for educational and training purposes only and should not
            be treated as authoritative legal or regulatory guidance.
          </p>
          <h3>5.2 Not a Substitute for Official Sources</h3>
          <p>
            While we strive for accuracy, algorithmically generated responses may
            occasionally contain errors, omissions, or outdated information.
            You should always defer to the official IFAB Laws of the Game (as
            published by the International Football Association Board) and the
            guidance of your local referee association or governing body as the
            authoritative sources on the Laws of the Game.
          </p>
          <h3>5.3 Educational Purpose Only</h3>
          <p>
            RefZone is a training and education tool. The feedback, analysis,
            and explanations provided through the Service &mdash; whether
            algorithmically generated or otherwise &mdash; are intended to help you develop
            your understanding and decision-making skills. They do not
            constitute professional advice, legal guidance, or official
            interpretations of the Laws of the Game.
          </p>
          <h3>5.4 No Guarantee of Accuracy</h3>
          <p>
            We do not guarantee the accuracy, completeness, or reliability of
            any generated content. RefZone shall not be held liable for any
            decisions you make, on or off the field of play, based on content
            provided through the Service. You acknowledge that this technology
            has inherent limitations and that you use generated content at
            your own discretion.
          </p>
          <h3>5.5 Content Review</h3>
          <p>
            We make reasonable efforts to review and validate the accuracy of
            our quiz and scenario content against the current Laws of the Game.
            However, given the volume of content and the evolving nature of
            football law interpretations, we cannot guarantee that every piece
            of content is free from error at all times.
          </p>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* 6. Intellectual Property */}
        {/* ---------------------------------------------------------------- */}
        <section>
          <h2>6. Intellectual Property</h2>
          <h3>6.1 RefZone IP</h3>
          <p>
            The Service, including all software, code, design, text, graphics,
            logos, icons, images, audio clips, quiz content, scenario content,
            generated material, data compilations, and the arrangement
            thereof (collectively, &quot;RefZone Content&quot;), is the
            exclusive property of RefZone or its licensors and is protected by
            copyright, trademark, and other intellectual property laws under
            Australian and international law. The RefZone name, logo, and all
            related names, logos, product and service names, designs, and
            slogans are trademarks of RefZone. You may not use such marks
            without our prior written permission.
          </p>
          <h3>6.2 License to Use the Service</h3>
          <p>
            Subject to your compliance with these Terms, RefZone grants you a
            limited, non-exclusive, non-transferable, non-sublicensable,
            revocable licence to access and use the Service solely for your
            personal referee training and education purposes. This licence does
            not include the right to modify, copy, distribute, sell, lease, or
            create derivative works of the Service or any RefZone Content.
          </p>
          <h3>6.3 Quiz and Scenario Content</h3>
          <p>
            All quiz questions, scenario descriptions, answer explanations, and
            associated educational content are proprietary to RefZone. You may
            not reproduce, distribute, publicly display, or create derivative
            works based on quiz or scenario content without our express written
            permission. This includes, but is not limited to, sharing
            screenshots of quiz content, copying scenario text, or compiling
            answer databases.
          </p>
          <h3>6.4 Feedback</h3>
          <p>
            If you provide RefZone with any suggestions, ideas, enhancement
            requests, feedback, or recommendations regarding the Service
            (&quot;Feedback&quot;), you grant RefZone a perpetual, irrevocable,
            worldwide, royalty-free, fully paid-up, non-exclusive licence to
            use, reproduce, modify, distribute, and otherwise exploit such
            Feedback for any purpose without restriction or obligation to you.
          </p>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* 7. User Content and Data */}
        {/* ---------------------------------------------------------------- */}
        <section>
          <h2>7. User Content and Data</h2>
          <h3>7.1 Forum Posts and Community Content</h3>
          <p>
            &quot;User Content&quot; means any content you create, upload,
            submit, or transmit through the Service, including but not limited
            to forum posts, comments, discussion contributions, and profile
            information you choose to make public. You retain ownership of your
            User Content.
          </p>
          <h3>7.2 Licence to RefZone</h3>
          <p>
            By submitting User Content to the Service, you grant RefZone a
            worldwide, non-exclusive, royalty-free licence to use, reproduce,
            process, store, and display your User Content solely to the extent
            necessary to provide, maintain, and improve the Service. For
            community content (forum posts, comments), this licence allows us
            to display your content to other users of the platform. This
            licence terminates when you delete your User Content or your
            account, except for content that has been shared in community
            features (which may be retained in anonymised form to preserve
            discussion integrity).
          </p>
          <h3>7.3 Profile and Performance Data</h3>
          <p>
            Your performance data (quiz scores, scenario results, analytics,
            streaks and training progress) is associated with your account and used to
            provide the Service. Certain performance data, such as your
            display name and level, may be visible to other users. You can
            control the visibility of certain profile elements through your
            account settings.
          </p>
          <h3>7.4 Content Responsibility</h3>
          <p>
            You are solely responsible for your User Content and the
            consequences of posting it through the Service. You represent and
            warrant that: (a) you own or have the necessary rights to your User
            Content; (b) your User Content does not infringe, violate, or
            misappropriate any third-party rights; and (c) your User Content
            complies with these Terms and all applicable laws.
          </p>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* 8. Gamification */}
        {/* ---------------------------------------------------------------- */}
        <section>
          <h2>8. Streaks and Progress</h2>
          <h3>8.1 No Prize or Compensation</h3>
          <p>
            Streaks and other progress tracking elements have no
            monetary value and do not entitle you to any prize, compensation,
            or benefit outside the Service, unless explicitly stated in a
            separate promotion or competition governed by its own terms and
            conditions.
          </p>
          <h3>8.2 Fair Play</h3>
          <p>
            Any attempt to manipulate progress through cheating,
            exploiting bugs, creating multiple accounts, or any other unfair
            means will result in resetting of progress and potential account
            termination. RefZone reserves the right to adjust tracking
            systems or reset progress at any time to maintain the integrity
            of the platform.
          </p>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* 9. Privacy */}
        {/* ---------------------------------------------------------------- */}
        <section>
          <h2>9. Privacy</h2>
          <p>
            Your privacy is important to us. Our collection, use, and
            disclosure of your personal information is governed by our{' '}
            <a href="/privacy" className="text-purple-400 hover:text-purple-300">
              Privacy Policy
            </a>
            , which is incorporated into these Terms by reference. By using the
            Service, you consent to the collection and use of your information
            as described in our Privacy Policy.
          </p>
          <p>
            RefZone complies with the Australian Privacy Act 1988 (Cth) and
            the Australian Privacy Principles (APPs). For information about how
            we collect, store, use, and disclose your personal information,
            including your performance data and Decision Lab interaction data, please
            review our Privacy Policy.
          </p>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* 10. Service Availability */}
        {/* ---------------------------------------------------------------- */}
        <section>
          <h2>10. Service Availability</h2>
          <h3>10.1 Availability</h3>
          <p>
            RefZone strives to maintain high availability of the Service.
            However, we do not guarantee uninterrupted or error-free operation.
            The Service may be temporarily unavailable due to maintenance,
            updates, server issues, or circumstances beyond our control.
          </p>
          <h3>10.2 Scheduled Maintenance</h3>
          <p>
            We may perform scheduled maintenance that could temporarily affect
            the availability of the Service. Where practicable, we will provide
            advance notice of scheduled maintenance through our website or
            social media channels.
          </p>
          <h3>10.3 Force Majeure</h3>
          <p>
            RefZone shall not be liable for any failure or delay in the
            performance of the Service due to causes beyond our reasonable
            control, including but not limited to acts of God, natural
            disasters, war, terrorism, labour disputes, government actions,
            power failures, internet or telecommunications outages, or
            third-party service provider failures.
          </p>
          <h3>10.4 Data Loss</h3>
          <p>
            While we take reasonable precautions to back up your data, we
            cannot guarantee that no data loss will occur. You acknowledge that
            RefZone is not liable for any loss of performance data, quiz
            history, Decision Lab conversations, or other data stored on the
            platform, whether caused by system failures, bugs, or any other
            reason.
          </p>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* 11. Limitation of Liability */}
        {/* ---------------------------------------------------------------- */}
        <section>
          <h2>11. Limitation of Liability</h2>
          <h3>11.1 Disclaimer of Warranties</h3>
          <p>
            THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS
            AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS,
            IMPLIED, STATUTORY, OR OTHERWISE. TO THE FULLEST EXTENT PERMITTED
            BY APPLICABLE LAW (INCLUDING THE AUSTRALIAN CONSUMER LAW), REFZONE
            DISCLAIMS ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO IMPLIED
            WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE,
            AND NON-INFRINGEMENT. REFZONE DOES NOT WARRANT THAT THE SERVICE
            WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE, THAT DEFECTS WILL BE
            CORRECTED, OR THAT ANY GENERATED CONTENT IS ACCURATE, COMPLETE,
            OR RELIABLE.
          </p>
          <h3>11.2 Limitation of Liability</h3>
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT
            SHALL REFZONE, ITS AFFILIATES, DIRECTORS, OFFICERS, EMPLOYEES,
            AGENTS, SUPPLIERS, OR LICENSORS BE LIABLE FOR ANY INDIRECT,
            INCIDENTAL, SPECIAL, CONSEQUENTIAL, PUNITIVE, OR EXEMPLARY
            DAMAGES, INCLUDING BUT NOT LIMITED TO DAMAGES FOR LOSS OF PROFITS,
            GOODWILL, USE, DATA, OR OTHER INTANGIBLE LOSSES, ARISING OUT OF OR
            IN CONNECTION WITH: (A) YOUR USE OF OR INABILITY TO USE THE
            SERVICE; (B) ANY DECISIONS YOU MAKE ON OR OFF THE FIELD OF PLAY
            BASED ON CONTENT PROVIDED THROUGH THE SERVICE; (C) ANY ERRORS OR
            INACCURACIES IN GENERATED CONTENT; (D) ANY UNAUTHORISED ACCESS
            TO OR ALTERATION OF YOUR DATA; OR (E) ANY OTHER MATTER RELATING TO
            THE SERVICE.
          </p>
          <h3>11.3 Cap on Liability</h3>
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, THE TOTAL
            AGGREGATE LIABILITY OF REFZONE FOR ALL CLAIMS ARISING OUT OF OR
            RELATING TO THESE TERMS OR THE SERVICE SHALL NOT EXCEED ONE
            HUNDRED AUSTRALIAN DOLLARS (AUD $100.00).
          </p>
          <h3>11.4 Australian Consumer Law</h3>
          <p>
            Nothing in these Terms is intended to exclude, restrict, or modify
            any consumer guarantee, right, or remedy conferred by the
            Australian Consumer Law (Schedule 2 of the Competition and
            Consumer Act 2010) or any other applicable law that cannot be
            excluded, restricted, or modified by agreement. If the Australian
            Consumer Law applies to you, our liability for breach of a
            consumer guarantee is limited to the re-supply of the services or
            the payment of the cost of having the services re-supplied.
          </p>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* 12. Indemnification */}
        {/* ---------------------------------------------------------------- */}
        <section>
          <h2>12. Indemnification</h2>
          <p>
            To the maximum extent permitted by applicable law, you agree to
            indemnify, defend, and hold harmless RefZone, its affiliates, and
            their respective directors, officers, employees, agents, and
            licensors (collectively, the &quot;Indemnified Parties&quot;) from
            and against any and all claims, demands, actions, liabilities,
            losses, damages, judgments, settlements, costs, and expenses
            (including reasonable legal fees) arising out of or relating to:
          </p>
          <ol>
            <li>Your use of the Service or any activity under your account</li>
            <li>Your User Content, including any forum posts or comments</li>
            <li>Your violation of these Terms</li>
            <li>
              Your violation of any applicable law or regulation, including
              data protection laws
            </li>
            <li>
              Any decisions you make on or off the field of play based on
              content provided through the Service
            </li>
            <li>
              Any infringement or misappropriation of any third-party rights
            </li>
            <li>
              Any claim by a third party related to your use of the Service
            </li>
          </ol>
          <p>
            RefZone reserves the right, at your expense, to assume the
            exclusive defence and control of any matter for which you are
            required to indemnify us, and you agree to cooperate with our
            defence of such claims.
          </p>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* 13. Termination */}
        {/* ---------------------------------------------------------------- */}
        <section>
          <h2>13. Termination</h2>
          <h3>13.1 Termination by You</h3>
          <p>
            You may terminate your account at any time by using the account
            deletion feature within the Service or by contacting us at{' '}
            <a href="mailto:admin@refzone.com.au" className="text-purple-400 hover:text-purple-300">
              admin@refzone.com.au
            </a>
            . Upon termination, your right to use the Service will cease
            immediately.
          </p>
          <h3>13.2 Termination by RefZone</h3>
          <p>
            We may suspend or terminate your account and access to the Service
            at any time, with or without cause, and with or without notice.
            Reasons for termination may include, but are not limited to:
            violation of these Terms (including the Acceptable Use Policy),
            cheating or manipulation of scores, harassment of other
            users, extended periods of inactivity (12 months or more), requests
            by law enforcement, or discontinuation of the Service.
          </p>
          <h3>13.3 Effect of Termination</h3>
          <p>
            Upon termination of your account: (a) all licences granted to you
            under these Terms will immediately terminate; (b) you must cease
            all use of the Service; (c) your performance data, quiz history,
            Decision Lab conversations, and profile information will be deleted
            in accordance with our Privacy Policy (generally within 30 days);
            (d) any streaks or other training progress will be permanently
            lost.
          </p>
          <h3>13.4 Survival</h3>
          <p>
            The following sections shall survive termination of these Terms:
            Sections 5 (Generated Content Disclaimer), 6 (Intellectual
            Property), 11 (Limitation of Liability), 12 (Indemnification), 15
            (Governing Law), and any other provisions that by their nature
            should survive termination.
          </p>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* 14. Modifications to Terms */}
        {/* ---------------------------------------------------------------- */}
        <section>
          <h2>14. Modifications to Terms</h2>
          <p>
            RefZone reserves the right to modify these Terms at any time. We
            will provide notice of material changes by posting the updated
            Terms on our website with a new &quot;Effective date&quot; and, for
            material changes, by sending an email notification to the address
            associated with your account at least 14 days before the changes
            take effect.
          </p>
          <p>
            Non-material changes (such as clarifications or corrections) may
            take effect immediately upon posting. Your continued use of the
            Service following the effective date of any modifications
            constitutes your acceptance of the revised Terms. If you do not
            agree to the modified Terms, you must stop using the Service and
            delete your account.
          </p>
          <p>
            Previous versions of these Terms are available upon request by
            contacting{' '}
            <a href="mailto:admin@refzone.com.au" className="text-purple-400 hover:text-purple-300">
              admin@refzone.com.au
            </a>
            .
          </p>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* 15. Governing Law */}
        {/* ---------------------------------------------------------------- */}
        <section>
          <h2>15. Governing Law</h2>
          <h3>15.1 Applicable Law</h3>
          <p>
            These Terms and any dispute arising out of or related to these
            Terms or the Service shall be governed by and construed in
            accordance with the laws of the State of New South Wales,
            Australia, without regard to its conflict of law provisions.
          </p>
          <h3>15.2 Jurisdiction</h3>
          <p>
            You agree to submit to the exclusive jurisdiction of the courts of
            New South Wales, Australia, and the Federal Court of Australia, for
            the resolution of any dispute arising out of or relating to these
            Terms or the Service. You waive any objection to the exercise of
            jurisdiction by such courts and to venue in such courts.
          </p>
          <h3>15.3 Dispute Resolution</h3>
          <p>
            Before initiating any formal legal proceedings, you agree to first
            attempt to resolve any dispute informally by contacting us at{' '}
            <a href="mailto:admin@refzone.com.au" className="text-purple-400 hover:text-purple-300">
              admin@refzone.com.au
            </a>
            . We will attempt to resolve any dispute through good-faith
            negotiation within 30 days. If the dispute cannot be resolved
            informally, either party may then proceed with formal legal action
            in the courts described in Section 15.2.
          </p>
          <h3>15.4 Severability</h3>
          <p>
            If any provision of these Terms is found to be invalid,
            unenforceable, or illegal by a court of competent jurisdiction,
            the remaining provisions of these Terms shall remain in full force
            and effect. The invalid or unenforceable provision shall be
            modified to the minimum extent necessary to make it valid and
            enforceable while preserving the intent of the original provision.
          </p>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* 16. Contact Us */}
        {/* ---------------------------------------------------------------- */}
        <section>
          <h2>16. Contact Us</h2>
          <p>
            If you have any questions, concerns, or feedback regarding these
            Terms of Service, please contact us:
          </p>
          <ul className="!list-none !pl-0">
            <li>
              <strong>Email:</strong>{' '}
              <a
                href="mailto:admin@refzone.com.au"
                className="text-purple-400 hover:text-purple-300"
              >
                admin@refzone.com.au
              </a>
            </li>
            <li>
              <strong>Platform:</strong> RefZone
            </li>
            <li>
              <strong>Website:</strong>{' '}
              <a
                href="https://refzone.com.au"
                className="text-purple-400 hover:text-purple-300"
              >
                refzone.com.au
              </a>
            </li>
            <li>
              <strong>Jurisdiction:</strong> New South Wales, Australia
            </li>
          </ul>
          <p>
            We will make reasonable efforts to respond to all inquiries within
            five (5) business days.
          </p>
        </section>
      </div>
    </main>
  )
}
