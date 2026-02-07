# SEO Implementation Guide

## Overview
This application implements comprehensive SEO best practices including dynamic sitemaps, robots.txt, structured data, and optimized metadata.

## Files Added

### 1. Dynamic Sitemap (`app/sitemap.ts`)
- Automatically generates XML sitemap with all static and dynamic routes
- Includes quizzes, scenarios, and forum posts from the database
- Updates with change frequency and priority information
- Accessible at `/sitemap.xml`

### 2. Robots.txt (`app/robots.ts`)
- Configures search engine crawling rules
- Blocks private routes (admin, dashboard, api)
- Allows public content indexing
- References sitemap location
- Accessible at `/robots.txt`

### 3. Structured Data (`components/structured-data.tsx`)
- JSON-LD schema for Organization
- JSON-LD schema for Website with search functionality
- JSON-LD schema for Educational Organization
- Improves rich snippets in search results

### 4. Open Graph Image (`app/opengraph-image.tsx`)
- Dynamically generates social media preview image
- 1200x630px optimal size for all platforms
- Branded with RefZone colors and key stats
- Accessible at `/og-image.jpg`

### 5. SEO Utilities (`lib/seo-utils.ts`)
- Helper functions for consistent metadata generation
- Breadcrumb schema generator
- Quiz schema generator for educational content
- Article schema generator for forum posts

### 6. Enhanced Root Layout
- Comprehensive metadata configuration
- Open Graph and Twitter Card support
- Canonical URLs
- Keywords and structured metadata
- Site verification tags

## Usage in Pages

### Adding Metadata to a Page
```typescript
import { generateMetadata } from '@/lib/seo-utils'

export const metadata = generateMetadata({
  title: 'Your Page Title',
  description: 'Your page description',
  path: '/your-path',
})
```

### Adding Breadcrumbs
```typescript
import { generateBreadcrumbSchema } from '@/lib/seo-utils'

export default function Page() {
  const breadcrumbs = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Quizzes', url: '/quizzes' },
    { name: 'Current Quiz', url: '/quizzes/123' },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      {/* Your page content */}
    </>
  )
}
```

### Adding Quiz Schema
```typescript
import { generateQuizSchema } from '@/lib/seo-utils'

const quizSchema = generateQuizSchema({
  title: 'Law 1: The Field of Play',
  description: 'Test your knowledge of field regulations',
  category: 'Laws of the Game',
  questionCount: 20,
})
```

## Environment Variables

Add to your `.env.local`:
```
NEXT_PUBLIC_SITE_URL=https://www.refzone.com.au
NEXT_PUBLIC_GOOGLE_VERIFICATION=your-google-verification-code
```

## Google Search Console Setup

1. Visit [Google Search Console](https://search.google.com/search-console)
2. Add your property (www.refzone.com.au)
3. Verify ownership using the verification code
4. Submit your sitemap: `https://www.refzone.com.au/sitemap.xml`

## Monitoring

### Check Sitemap
- Visit: `https://www.refzone.com.au/sitemap.xml`
- Should list all public routes with priorities and update frequencies

### Check Robots.txt
- Visit: `https://www.refzone.com.au/robots.txt`
- Should show crawl rules and sitemap reference

### Check Structured Data
- Use [Google Rich Results Test](https://search.google.com/test/rich-results)
- Paste your URL to validate structured data
- Should show Organization, Website, and Educational Organization schemas

### Check Meta Tags
- View page source
- Verify Open Graph tags are present
- Check canonical URLs are correct

## Performance Tips

1. **Dynamic Sitemap**: Updates automatically when content changes
2. **Image Optimization**: All images should use Next.js Image component
3. **Structured Data**: Add page-specific schemas for quiz/scenario pages
4. **Internal Linking**: Use Next.js Link for all internal navigation
5. **Loading Speed**: Ensure pages load under 3 seconds

## Next Steps

1. Add social media links to Organization schema
2. Create individual OG images for popular pages
3. Add FAQ schema to appropriate pages
4. Implement breadcrumb navigation UI
5. Add article schema to forum posts
6. Submit to Bing Webmaster Tools
