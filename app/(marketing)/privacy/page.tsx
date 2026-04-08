import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — RefZone',
  description:
    'RefZone Privacy Policy. Learn how we collect, use, and protect your personal information on our referee training platform.',
}

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-9 pt-40 pb-20">
      <h1 className="text-4xl tracking-tight text-white">
        Privacy Policy
      </h1>
      <p className="mt-2 text-sm text-white/20">
        Effective date: April 5, 2026
      </p>
      <p className="mt-6 text-white/45">
        RefZone (&quot;RefZone,&quot; &quot;we,&quot; &quot;us,&quot; or
        &quot;our&quot;) operates the website{' '}
        <a
          href="https://refzone.com.au"
          className="text-purple-400 hover:text-purple-300"
        >
          refzone.com.au
        </a>{' '}
        and the RefZone platform (collectively, the &quot;Service&quot;). RefZone
        is an advanced football referee training platform based in Australia.
        This Privacy Policy explains how we collect, use, disclose, and
        safeguard your information when you visit our website and use our
        Service. It also describes the choices available to you regarding your
        personal data and how you can contact us about our privacy practices.
      </p>
      <p className="mt-4 text-white/45">
        By accessing or using the Service, you agree to the collection and use
        of information in accordance with this Privacy Policy. If you do not
        agree with the terms of this Privacy Policy, please do not access the
        Service.
      </p>
      <p className="mt-4 text-white/45">
        RefZone is committed to complying with the Australian Privacy Act 1988
        (Cth) and the Australian Privacy Principles (APPs). Where applicable,
        we also comply with other relevant privacy legislation, including the
        Children&apos;s Online Privacy Protection Act (COPPA) for users in the
        United States.
      </p>

      <div className="mt-12 space-y-10">
        {/* ------------------------------------------------------------ */}
        {/* 1. INFORMATION WE COLLECT */}
        {/* ------------------------------------------------------------ */}
        <section>
          <h2 className="text-xl font-semibold text-white">
            1. Information We Collect
          </h2>
          <p className="mt-2 text-white/45">
            We collect several types of information depending on how you
            interact with our Service. This includes information you provide
            directly to us, information we collect automatically, and
            information generated through your use of our training features.
          </p>

          <h3 className="mt-6 text-lg font-medium text-white">
            1.1 Account Information
          </h3>
          <p className="mt-2 text-white/45">
            When you create an account on RefZone, we collect information
            through our authentication provider, Clerk. This may include:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-6 text-white/45">
            <li>Your name (first and last name)</li>
            <li>Email address</li>
            <li>
              Authentication credentials (managed securely by Clerk; RefZone
              does not store your passwords directly)
            </li>
            <li>Profile photograph (if you choose to upload one)</li>
            <li>Username or display name</li>
            <li>
              Social login identifiers (if you register via Google or another
              supported single sign-on provider)
            </li>
          </ul>

          <h3 className="mt-6 text-lg font-medium text-white">
            1.2 Usage Data
          </h3>
          <p className="mt-2 text-white/45">
            We automatically collect certain information when you access or use
            the Service, including:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-6 text-white/45">
            <li>IP address</li>
            <li>Browser type and version</li>
            <li>Operating system and device type</li>
            <li>
              Pages visited, time spent on pages, and navigation paths within
              the Service
            </li>
            <li>Referring URL and exit pages</li>
            <li>Date and time of access</li>
            <li>Feature usage patterns (e.g., which training modules you use most)</li>
          </ul>

          <h3 className="mt-6 text-lg font-medium text-white">
            1.3 Quiz and Scenario Performance Data
          </h3>
          <p className="mt-2 text-white/45">
            As a referee training platform, we collect detailed performance data
            to provide you with personalised feedback and track your progress.
            This includes:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-6 text-white/45">
            <li>
              Quiz answers, scores, and completion times for all quiz modules
            </li>
            <li>
              Scenario responses, including the decisions you make and the
              reasoning you provide
            </li>
            <li>
              Decision Lab conversation history (your interactions with the
              training assistant)
            </li>
            <li>
              Accuracy rates, streaks, and performance trends over time
            </li>
            <li>
              Streak data, training progress, and scenario completion history
            </li>
            <li>
              Verified status information
            </li>
            <li>
              Time-based analytics (e.g., average response time per question,
              training frequency, and session duration)
            </li>
            <li>
              Law of the Game category strengths and weaknesses as determined
              by your performance
            </li>
          </ul>

          <h3 className="mt-6 text-lg font-medium text-white">
            1.4 Community and User-Generated Content
          </h3>
          <p className="mt-2 text-white/45">
            If you participate in community features on RefZone, we may collect:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-6 text-white/45">
            <li>Forum posts, comments, and discussion contributions</li>
            <li>Profile information you choose to make public</li>
            <li>Reactions or votes on other users&apos; content</li>
          </ul>
        </section>

        {/* ------------------------------------------------------------ */}
        {/* 2. HOW WE USE YOUR INFORMATION */}
        {/* ------------------------------------------------------------ */}
        <section>
          <h2 className="text-xl font-semibold text-white">
            2. How We Use Your Information
          </h2>
          <p className="mt-2 text-white/45">
            We use the information we collect for the following purposes:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-6 text-white/45">
            <li>
              <strong>Providing and maintaining the Service:</strong> To operate
              the platform, deliver quizzes and scenarios, run the Decision Lab
              training assistant, calculate your performance analytics, and provide
              customer support.
            </li>
            <li>
              <strong>Account management:</strong> To create and manage your
              account through Clerk, authenticate your identity, and
              communicate with you about your account status.
            </li>
            <li>
              <strong>Personalised training and analytics:</strong> To analyse
              your quiz and scenario performance, identify your strengths and
              weaknesses across the Laws of the Game, generate personalised
              training recommendations, and display your progress on your
              analytics dashboard.
            </li>
            <li>
              <strong>Training feedback:</strong> To provide algorithmically generated
              feedback and explanations through the Decision Lab feature,
              helping you understand the correct application of the Laws of the
              Game to specific match situations.
            </li>
            <li>
              <strong>Streak tracking:</strong> To track daily streaks and
              training consistency.
            </li>
            <li>
              <strong>Improving the Service:</strong> To understand how users
              interact with the platform, identify trends in training
              effectiveness, diagnose technical issues, and develop new
              features and content.
            </li>
            <li>
              <strong>Aggregate analytics:</strong> To generate anonymised,
              aggregate statistics about platform usage, question difficulty,
              and community performance trends. These aggregate statistics do
              not identify individual users.
            </li>
            <li>
              <strong>Communications:</strong> To send you transactional emails
              (e.g., account confirmations, security alerts, training
              reminders), and, where you have opted in, product updates and
              feature announcements.
            </li>
            <li>
              <strong>Security and fraud prevention:</strong> To detect,
              prevent, and address technical issues, cheating, abuse, and
              violations of our Terms of Service.
            </li>
            <li>
              <strong>Legal compliance:</strong> To comply with applicable laws,
              regulations, legal processes, or enforceable governmental
              requests.
            </li>
          </ul>
          <p className="mt-4 text-white/45">
            We do not sell your personal information to third parties. We do not
            use your performance data for advertising purposes. Your individual
            quiz answers and Decision Lab conversations are never shared with
            other users unless you explicitly choose to share them.
          </p>
        </section>

        {/* ------------------------------------------------------------ */}
        {/* 3. DATA PROCESSOR ROLE */}
        {/* ------------------------------------------------------------ */}
        <section>
          <h2 className="text-xl font-semibold text-white">
            3. Data Controller Role
          </h2>
          <p className="mt-2 text-white/45">
            RefZone acts as the data controller for all personal information
            collected through the Service. This means we determine the purposes
            and means of processing your personal data, including:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-6 text-white/45">
            <li>
              <strong>Account information:</strong> We control the collection
              and processing of your registration details, profile data, and
              authentication credentials.
            </li>
            <li>
              <strong>Performance data:</strong> We control the collection and
              processing of your quiz scores, scenario responses, Decision Lab
              interactions, and all associated training analytics.
            </li>
            <li>
              <strong>Usage data:</strong> We control the collection and
              processing of technical and behavioural data generated through
              your use of the platform.
            </li>
          </ul>
          <p className="mt-4 text-white/45">
            As the data controller, RefZone is responsible for ensuring that
            your personal data is processed lawfully, fairly, and transparently
            in accordance with the Australian Privacy Act 1988 and the
            Australian Privacy Principles (APPs).
          </p>
          <p className="mt-4 text-white/45">
            We engage third-party service providers (detailed in Section 5) who
            process data on our behalf as data processors. These providers act
            solely on our instructions and are contractually bound to protect
            your data.
          </p>
        </section>

        {/* ------------------------------------------------------------ */}
        {/* 4. LEGAL BASIS FOR PROCESSING */}
        {/* ------------------------------------------------------------ */}
        <section>
          <h2 className="text-xl font-semibold text-white">
            4. Legal Basis for Processing
          </h2>
          <p className="mt-2 text-white/45">
            RefZone processes your personal information in accordance with the
            Australian Privacy Act 1988 (Cth) and the thirteen Australian
            Privacy Principles (APPs). Our legal bases for collecting and
            processing your personal information include:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-6 text-white/45">
            <li>
              <strong>
                Consent (APP 3 &mdash; Collection of solicited personal
                information):
              </strong>{' '}
              By creating an account and using the Service, you consent to the
              collection and processing of your personal information as
              described in this Privacy Policy. You may withdraw your consent
              at any time by deleting your account, although this may affect
              your ability to use the Service.
            </li>
            <li>
              <strong>
                Contractual necessity (APP 6 &mdash; Use or disclosure):
              </strong>{' '}
              We process your account information and performance data as
              necessary to provide the Service to you in accordance with our
              Terms of Service. This includes delivering quizzes, scenarios,
              training feedback, and analytics features.
            </li>
            <li>
              <strong>
                Legitimate purpose (APP 6.2(a) &mdash; Related secondary
                purpose):
              </strong>{' '}
              We may use your personal information for purposes related to the
              primary purpose of collection where you would reasonably expect
              us to do so. For example, using your performance data to improve
              the quality of our training feedback, or using aggregate usage
              data to enhance platform features.
            </li>
            <li>
              <strong>
                Legal obligation (APP 6.2(b) &mdash; Required or authorised by
                law):
              </strong>{' '}
              We may process your data where required by Australian law,
              regulation, or a court or tribunal order. This includes
              responding to lawful requests from government agencies or law
              enforcement.
            </li>
          </ul>
          <p className="mt-4 text-white/45">
            We only collect personal information that is reasonably necessary
            for, or directly related to, our functions and activities as a
            referee training platform (APP 3.2). We collect personal
            information by lawful and fair means, and only with your knowledge
            or consent (APP 3.5).
          </p>
          <p className="mt-4 text-white/45">
            We do not collect sensitive information (as defined under the
            Privacy Act 1988) unless it is reasonably necessary for our
            functions and you have provided explicit consent.
          </p>
        </section>

        {/* ------------------------------------------------------------ */}
        {/* 5. DATA SHARING AND THIRD PARTIES */}
        {/* ------------------------------------------------------------ */}
        <section>
          <h2 className="text-xl font-semibold text-white">
            5. Data Sharing and Third Parties
          </h2>
          <p className="mt-2 text-white/45">
            We share personal data only in the following circumstances and with
            the following categories of recipients:
          </p>

          <h3 className="mt-6 text-lg font-medium text-white">
            5.1 Service Providers (Sub-processors)
          </h3>
          <p className="mt-2 text-white/45">
            We engage trusted third-party service providers who process data on
            our behalf to help us operate and improve the Service. These
            providers are contractually obligated to handle your data securely
            and only for the purposes we specify. Our key sub-processors
            include:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-6 text-white/45">
            <li>
              <strong>Clerk</strong> &mdash; Authentication and user
              management. Clerk processes your login credentials, email
              address, and profile information to authenticate you, manage your
              sessions, and secure your account. Clerk&apos;s handling of your
              data is governed by the{' '}
              <a
                href="https://clerk.com/legal/privacy"
                className="text-purple-400 hover:text-purple-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                Clerk Privacy Policy
              </a>
              .
            </li>
            <li>
              <strong>Supabase</strong> &mdash; Database and backend
              infrastructure. Supabase hosts our PostgreSQL database, which
              stores your account information, quiz and scenario performance
              data, Decision Lab conversation history, and all associated
              training analytics. Supabase&apos;s handling
              of your data is governed by the{' '}
              <a
                href="https://supabase.com/privacy"
                className="text-purple-400 hover:text-purple-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                Supabase Privacy Policy
              </a>
              .
            </li>
            <li>
              <strong>OpenAI</strong> &mdash; Language model
              services. OpenAI powers the Decision Lab feature, providing
              algorithmically generated feedback and explanations for referee training
              scenarios. When you use the Decision Lab, your questions and
              scenario context are sent to OpenAI&apos;s API to generate
              responses. OpenAI does not use data submitted via its API to
              train its models. OpenAI&apos;s handling of your data is governed
              by the{' '}
              <a
                href="https://openai.com/policies/privacy-policy"
                className="text-purple-400 hover:text-purple-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                OpenAI Privacy Policy
              </a>
              .
            </li>
            <li>
              <strong>Vercel</strong> &mdash; Hosting and deployment
              infrastructure. Vercel hosts the RefZone web application,
              handling HTTP requests and serving the platform to your browser.
              Vercel may process your IP address and request metadata as part
              of delivering the Service. Vercel&apos;s handling of your data is
              governed by the{' '}
              <a
                href="https://vercel.com/legal/privacy-policy"
                className="text-purple-400 hover:text-purple-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                Vercel Privacy Policy
              </a>
              .
            </li>
          </ul>

          <h3 className="mt-6 text-lg font-medium text-white">
            5.2 Legal Requirements
          </h3>
          <p className="mt-2 text-white/45">
            We may disclose your information if required to do so by Australian
            law or in the good-faith belief that such action is necessary to:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-6 text-white/45">
            <li>
              Comply with a legal obligation, court order, or lawful
              government request under Australian jurisdiction
            </li>
            <li>Protect and defend the rights or property of RefZone</li>
            <li>
              Prevent or investigate possible wrongdoing in connection with the
              Service
            </li>
            <li>
              Protect the personal safety of users of the Service or the public
            </li>
            <li>
              Respond to requests from Australian law enforcement agencies or
              regulatory bodies, including the Office of the Australian
              Information Commissioner (OAIC)
            </li>
          </ul>

          <h3 className="mt-6 text-lg font-medium text-white">
            5.3 Business Transfers
          </h3>
          <p className="mt-2 text-white/45">
            If RefZone is involved in a merger, acquisition, asset sale, or
            similar business transaction, your personal data may be transferred
            as part of that transaction. We will provide notice before your
            personal data is transferred and becomes subject to a different
            privacy policy.
          </p>

          <h3 className="mt-6 text-lg font-medium text-white">
            5.4 Aggregate and De-identified Data
          </h3>
          <p className="mt-2 text-white/45">
            We may share aggregate, de-identified data that cannot reasonably
            be used to identify you. For example, we may publish statistics
            about the average accuracy rates across all users for certain types
            of scenarios, or share anonymised training effectiveness data with
            football associations. This data does not constitute personal
            information under the Privacy Act 1988.
          </p>

          <h3 className="mt-6 text-lg font-medium text-white">
            5.5 With Your Consent
          </h3>
          <p className="mt-2 text-white/45">
            We may share your personal information for other purposes with your
            explicit consent.
          </p>
        </section>

        {/* ------------------------------------------------------------ */}
        {/* 6. DATA RETENTION */}
        {/* ------------------------------------------------------------ */}
        <section>
          <h2 className="text-xl font-semibold text-white">
            6. Data Retention
          </h2>
          <p className="mt-2 text-white/45">
            We retain your personal data only for as long as necessary to
            fulfil the purposes for which it was collected and as described in
            this Privacy Policy, in accordance with APP 11.2 (destruction or
            de-identification of personal information).
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-6 text-white/45">
            <li>
              <strong>Account data:</strong> We retain your account
              information (name, email, profile) for as long as your account is
              active. If you delete your account, we will delete or anonymise
              your personal data within 30 days, except where we are required
              to retain it for legal, accounting, or audit purposes.
            </li>
            <li>
              <strong>Performance data:</strong> Your quiz scores, scenario
              responses, Decision Lab conversations, streaks, and
              analytics data are retained for as long as your account is
              active. This data is essential to providing the training and
              progress tracking features of the Service. Upon account deletion,
              this data is permanently deleted within 30 days.
            </li>
            <li>
              <strong>Community content:</strong> Forum posts and comments you
              have made may be retained in anonymised form after account
              deletion to preserve the integrity of community discussions.
              Your personal identifiers will be removed or replaced with a
              generic placeholder.
            </li>
            <li>
              <strong>Usage logs:</strong> Aggregated usage data and server
              logs are retained for up to 12 months for analytics and security
              purposes, after which they are deleted or anonymised.
            </li>
            <li>
              <strong>Backup data:</strong> Deleted data may persist in
              encrypted backup systems for up to 90 days after deletion from
              our active systems, after which it is permanently removed.
            </li>
          </ul>
        </section>

        {/* ------------------------------------------------------------ */}
        {/* 7. DATA SECURITY */}
        {/* ------------------------------------------------------------ */}
        <section>
          <h2 className="text-xl font-semibold text-white">
            7. Data Security
          </h2>
          <p className="mt-2 text-white/45">
            We take the security of your data seriously and implement
            industry-standard technical and organisational measures to protect
            your personal information against unauthorised access, alteration,
            disclosure, or destruction, in accordance with APP 11.1 (security
            of personal information). These measures include:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-6 text-white/45">
            <li>
              Encryption of data in transit using TLS (Transport Layer
              Security) for all communications between your browser and our
              servers
            </li>
            <li>
              Encryption of data at rest in our databases and storage systems
              via Supabase&apos;s built-in encryption capabilities
            </li>
            <li>
              Secure authentication managed by Clerk, including support for
              multi-factor authentication (MFA), session management, and
              brute-force protection
            </li>
            <li>
              Row-level security policies in our Supabase database ensuring
              users can only access their own data
            </li>
            <li>
              Regular security assessments and dependency vulnerability
              scanning of our application codebase
            </li>
            <li>
              Access controls limiting personnel access to production systems
              and personal data on a need-to-know basis
            </li>
            <li>
              Automated backups with encrypted storage to ensure data
              availability and disaster recovery
            </li>
            <li>
              Secure API key management and environment variable handling for
              all third-party service integrations
            </li>
          </ul>
          <p className="mt-4 text-white/45">
            While we strive to use commercially acceptable means to protect
            your personal data, no method of electronic transmission or storage
            is 100% secure. We cannot guarantee absolute security, but we are
            committed to promptly addressing any security incidents and
            notifying affected parties in accordance with the Notifiable Data
            Breaches (NDB) scheme under Part IIIC of the Privacy Act 1988.
          </p>
          <p className="mt-4 text-white/45">
            In the event of an eligible data breach that is likely to result in
            serious harm to any individuals whose personal information is
            involved, we will notify the affected individuals and the Office of
            the Australian Information Commissioner (OAIC) as soon as
            practicable, as required by the NDB scheme.
          </p>
        </section>

        {/* ------------------------------------------------------------ */}
        {/* 8. INTERNATIONAL DATA TRANSFERS */}
        {/* ------------------------------------------------------------ */}
        <section>
          <h2 className="text-xl font-semibold text-white">
            8. International Data Transfers
          </h2>
          <p className="mt-2 text-white/45">
            RefZone is based in Australia; however, your information may be
            transferred to and processed in countries other than Australia. Our
            third-party service providers operate infrastructure in various
            jurisdictions, including the United States. Specifically:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-6 text-white/45">
            <li>
              <strong>Clerk</strong> processes authentication data on servers
              located in the United States.
            </li>
            <li>
              <strong>Supabase</strong> may host database infrastructure in
              various regions, which may include locations outside Australia.
            </li>
            <li>
              <strong>OpenAI</strong> processes inference requests on
              servers located in the United States.
            </li>
            <li>
              <strong>Vercel</strong> serves the application from edge
              locations globally, including locations outside Australia.
            </li>
          </ul>
          <p className="mt-4 text-white/45">
            In accordance with APP 8 (cross-border disclosure of personal
            information), before disclosing your personal information to an
            overseas recipient, we take reasonable steps to ensure that the
            overseas recipient does not breach the Australian Privacy Principles
            in relation to your information. We achieve this through:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-6 text-white/45">
            <li>
              Selecting service providers that maintain robust privacy and
              security practices, including SOC 2 compliance and equivalent
              certifications
            </li>
            <li>
              Entering into contractual agreements with our service providers
              that require them to protect your personal information in
              accordance with standards substantially similar to the Australian
              Privacy Principles
            </li>
            <li>
              Conducting due diligence on the data protection laws and
              practices of the jurisdictions in which our service providers
              operate
            </li>
          </ul>
          <p className="mt-4 text-white/45">
            By using the Service, you acknowledge and consent to the transfer
            of your personal information to countries outside Australia as
            described above. If you have concerns about international data
            transfers, please contact us at{' '}
            <a
              href="mailto:admin@refzone.com.au"
              className="text-purple-400 hover:text-purple-300"
            >
              admin@refzone.com.au
            </a>{' '}
            before creating an account.
          </p>
        </section>

        {/* ------------------------------------------------------------ */}
        {/* 9. YOUR RIGHTS */}
        {/* ------------------------------------------------------------ */}
        <section>
          <h2 className="text-xl font-semibold text-white">
            9. Your Rights
          </h2>
          <p className="mt-2 text-white/45">
            Under the Australian Privacy Act 1988 and the Australian Privacy
            Principles, you have several rights regarding your personal
            information. We are committed to helping you exercise those rights.
          </p>

          <h3 className="mt-6 text-lg font-medium text-white">
            9.1 Right of Access (APP 12)
          </h3>
          <p className="mt-2 text-white/45">
            You have the right to request access to the personal information we
            hold about you. Upon request, we will provide you with a copy of
            your personal information in a commonly used electronic format. You
            can also access much of your personal information directly through
            the Service, including your profile data, performance analytics,
            quiz history, and Decision Lab conversation logs.
          </p>

          <h3 className="mt-6 text-lg font-medium text-white">
            9.2 Right to Correction (APP 13)
          </h3>
          <p className="mt-2 text-white/45">
            You have the right to request that we correct any personal
            information we hold about you that is inaccurate, out of date,
            incomplete, irrelevant, or misleading. You can update your profile
            information directly through your account settings. For other
            corrections, please contact us and we will take reasonable steps to
            correct the information.
          </p>

          <h3 className="mt-6 text-lg font-medium text-white">
            9.3 Right to Deletion
          </h3>
          <p className="mt-2 text-white/45">
            You may request deletion of your personal information by deleting
            your account through the Service or by contacting us. Upon
            receiving a valid deletion request, we will delete or de-identify
            your personal information within 30 days, except where we are
            required to retain it to comply with legal obligations (e.g., tax
            or record-keeping requirements) or to establish, exercise, or
            defend legal claims.
          </p>

          <h3 className="mt-6 text-lg font-medium text-white">
            9.4 Right to Complain (APP 1)
          </h3>
          <p className="mt-2 text-white/45">
            If you believe we have breached the Australian Privacy Principles
            or handled your personal information improperly, you have the right
            to lodge a complaint with us. We will investigate your complaint
            and respond within 30 days. If you are not satisfied with our
            response, you may escalate your complaint to the Office of the
            Australian Information Commissioner (OAIC):
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-6 text-white/45">
            <li>
              <strong>Website:</strong>{' '}
              <a
                href="https://www.oaic.gov.au"
                className="text-purple-400 hover:text-purple-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                www.oaic.gov.au
              </a>
            </li>
            <li>
              <strong>Phone:</strong> 1300 363 992
            </li>
            <li>
              <strong>Email:</strong>{' '}
              <a
                href="mailto:enquiries@oaic.gov.au"
                className="text-purple-400 hover:text-purple-300"
              >
                enquiries@oaic.gov.au
              </a>
            </li>
          </ul>

          <h3 className="mt-6 text-lg font-medium text-white">
            9.5 Exercising Your Rights
          </h3>
          <p className="mt-2 text-white/45">
            To exercise any of the rights described above, please contact us at{' '}
            <a
              href="mailto:admin@refzone.com.au"
              className="text-purple-400 hover:text-purple-300"
            >
              admin@refzone.com.au
            </a>{' '}
            with the subject line &quot;Privacy Request.&quot; We will respond
            to your request within 30 days. We may need to verify your identity
            before processing your request to protect your privacy and security.
          </p>
          <p className="mt-4 text-white/45">
            We will not charge you for making a request or for providing access
            to your personal information, unless the request is manifestly
            unfounded or excessive (in which case we may charge a reasonable
            fee or refuse the request, providing reasons for doing so).
          </p>
        </section>

        {/* ------------------------------------------------------------ */}
        {/* 10. CHILDREN'S PRIVACY */}
        {/* ------------------------------------------------------------ */}
        <section>
          <h2 className="text-xl font-semibold text-white">
            10. Children&apos;s Privacy
          </h2>
          <p className="mt-2 text-white/45">
            RefZone is designed to be used by referees and aspiring referees of
            all experience levels. However, we are committed to protecting the
            privacy of children and complying with applicable laws regarding
            minors&apos; data.
          </p>

          <h3 className="mt-6 text-lg font-medium text-white">
            10.1 Age Requirements
          </h3>
          <p className="mt-2 text-white/45">
            Users must be at least 13 years of age to create an account on
            RefZone. Users between the ages of 13 and 16 must have verifiable
            parental or guardian consent before creating an account and using
            the Service. By creating an account, you represent and warrant that
            you meet these age requirements or have obtained the necessary
            parental consent.
          </p>

          <h3 className="mt-6 text-lg font-medium text-white">
            10.2 COPPA Compliance
          </h3>
          <p className="mt-2 text-white/45">
            For users located in the United States, RefZone complies with the
            Children&apos;s Online Privacy Protection Act (COPPA). We do not
            knowingly collect personal information from children under the age
            of 13 without verifiable parental consent. If we become aware that
            we have collected personal information from a child under 13
            without proper consent, we will take steps to delete that
            information promptly.
          </p>

          <h3 className="mt-6 text-lg font-medium text-white">
            10.3 Parental Rights
          </h3>
          <p className="mt-2 text-white/45">
            Parents and guardians may contact us at{' '}
            <a
              href="mailto:admin@refzone.com.au"
              className="text-purple-400 hover:text-purple-300"
            >
              admin@refzone.com.au
            </a>{' '}
            to:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-6 text-white/45">
            <li>
              Review the personal information we have collected from their
              child
            </li>
            <li>
              Request deletion of their child&apos;s personal information and
              account
            </li>
            <li>
              Refuse further collection or use of their child&apos;s personal
              information
            </li>
            <li>
              Withdraw previously given consent for their child&apos;s use of
              the Service
            </li>
          </ul>
          <p className="mt-4 text-white/45">
            We will respond to parental requests within 30 days and will take
            reasonable steps to verify the identity and authority of the
            requesting parent or guardian.
          </p>
        </section>

        {/* ------------------------------------------------------------ */}
        {/* 11. COOKIES AND TRACKING */}
        {/* ------------------------------------------------------------ */}
        <section>
          <h2 className="text-xl font-semibold text-white">
            11. Cookies and Tracking
          </h2>
          <p className="mt-2 text-white/45">
            We use cookies and similar technologies to support the
            functionality of the Service and enhance your experience.
          </p>

          <h3 className="mt-6 text-lg font-medium text-white">
            11.1 Essential Cookies
          </h3>
          <p className="mt-2 text-white/45">
            RefZone uses only essential cookies that are strictly necessary for
            the Service to function. These include:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-6 text-white/45">
            <li>
              <strong>Clerk authentication cookies:</strong> Session cookies
              used to authenticate your identity, maintain your logged-in
              state, and manage secure sessions. These cookies are set and
              managed by our authentication provider, Clerk, and are essential
              to accessing your account.
            </li>
            <li>
              <strong>Security tokens:</strong> CSRF (Cross-Site Request
              Forgery) tokens and other security cookies that protect against
              common web attacks and ensure the integrity of your interactions
              with the Service.
            </li>
            <li>
              <strong>Preference cookies:</strong> Cookies that store your
              essential preferences, such as theme settings (light/dark mode),
              to ensure the Service displays correctly.
            </li>
          </ul>

          <h3 className="mt-6 text-lg font-medium text-white">
            11.2 Analytics
          </h3>
          <p className="mt-2 text-white/45">
            We may use lightweight, privacy-respecting analytics to understand
            how users interact with the platform. Any analytics data collected
            is aggregated and does not track individual users across websites.
            We do not use third-party advertising cookies or cross-site
            tracking technologies.
          </p>

          <h3 className="mt-6 text-lg font-medium text-white">
            11.3 Managing Cookies
          </h3>
          <p className="mt-2 text-white/45">
            Most web browsers allow you to control cookies through their
            settings. You can set your browser to refuse cookies or to alert
            you when a cookie is being set. Please note that disabling
            essential cookies will prevent you from logging in to your account
            and using the Service. Since RefZone uses only essential cookies,
            there are no optional cookies to opt out of.
          </p>

          <h3 className="mt-6 text-lg font-medium text-white">
            11.4 Do Not Track
          </h3>
          <p className="mt-2 text-white/45">
            RefZone does not track users across third-party websites and
            therefore does not respond to Do Not Track (DNT) signals. Our use
            of cookies is limited to the essential cookies described above,
            which operate solely within the RefZone platform.
          </p>
        </section>

        {/* ------------------------------------------------------------ */}
        {/* 12. CHANGES TO THIS POLICY */}
        {/* ------------------------------------------------------------ */}
        <section>
          <h2 className="text-xl font-semibold text-white">
            12. Changes to This Policy
          </h2>
          <p className="mt-2 text-white/45">
            We may update this Privacy Policy from time to time to reflect
            changes in our practices, the Service, or applicable laws. When we
            make material changes to this Privacy Policy, we will:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-6 text-white/45">
            <li>
              Update the &quot;Effective date&quot; at the top of this page
            </li>
            <li>
              Provide a prominent notice on our website or within the Service
              (such as a banner or in-app notification)
            </li>
            <li>
              Send an email notification to registered users for significant
              changes that affect how we handle personal data
            </li>
          </ul>
          <p className="mt-4 text-white/45">
            We encourage you to review this Privacy Policy periodically to
            stay informed about how we protect your information. Your continued
            use of the Service after any changes to this Privacy Policy
            constitutes your acceptance of those changes.
          </p>
          <p className="mt-4 text-white/45">
            Previous versions of this Privacy Policy are available upon request
            by contacting us at{' '}
            <a
              href="mailto:admin@refzone.com.au"
              className="text-purple-400 hover:text-purple-300"
            >
              admin@refzone.com.au
            </a>
            .
          </p>
        </section>

        {/* ------------------------------------------------------------ */}
        {/* 13. CONTACT US */}
        {/* ------------------------------------------------------------ */}
        <section>
          <h2 className="text-xl font-semibold text-white">
            13. Contact Us
          </h2>
          <p className="mt-2 text-white/45">
            If you have any questions, concerns, or requests regarding this
            Privacy Policy or our data practices, please contact us:
          </p>
          <ul className="mt-4 space-y-2 text-white/45">
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
              <strong>Jurisdiction:</strong> Australia
            </li>
          </ul>
          <p className="mt-4 text-white/45">
            For privacy-related inquiries, please include the subject line
            &quot;Privacy Inquiry&quot; in your email. We will endeavour to
            respond to all legitimate requests within 30 days.
          </p>
          <p className="mt-4 text-white/45">
            If you are not satisfied with our response to your privacy
            concern, you may contact the Office of the Australian Information
            Commissioner (OAIC) at{' '}
            <a
              href="https://www.oaic.gov.au"
              className="text-purple-400 hover:text-purple-300"
              target="_blank"
              rel="noopener noreferrer"
            >
              www.oaic.gov.au
            </a>{' '}
            or by calling 1300 363 992.
          </p>
        </section>
      </div>
    </main>
  )
}
