export function StructuredData() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.refzone.com.au'

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'RefZone',
    url: siteUrl,
    logo: `${siteUrl}/placeholder-logo.png`,
    description: 'Advanced football referee training platform with quizzes, scenarios, and expert analysis.',
    sameAs: [
      // Add social media links when available
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Support',
      availableLanguage: 'English',
    },
  }

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'RefZone',
    url: siteUrl,
    description: 'Master the Laws of the Game with algorithm-driven scenarios, quizzes, and expert analysis.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/forum?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  const educationalOrganizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'RefZone',
    url: siteUrl,
    description: 'Professional referee training platform offering comprehensive education in football officiating.',
    educationalCredentialAwarded: 'Referee Training Certification',
    offers: {
      '@type': 'Offer',
      category: 'Education',
      itemOffered: {
        '@type': 'Course',
        name: 'Football Referee Training',
        description: 'Comprehensive training covering all 17 Laws of the Game',
        provider: {
          '@type': 'Organization',
          name: 'RefZone',
        },
      },
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(educationalOrganizationSchema) }}
      />
    </>
  )
}
