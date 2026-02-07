import { MetadataRoute } from 'next'
import { createServiceClient } from '@/lib/supabase/service'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.refzone.com.au'
  const supabase = createServiceClient()

  // Fetch dynamic content for sitemap
  const [
    { data: quizzes },
    { data: scenarios },
    { data: forumPosts },
  ] = await Promise.all([
    supabase
      .from('quizzes')
      .select('id, updated_at')
      .eq('is_active', true)
      .order('updated_at', { ascending: false }),
    supabase
      .from('scenarios')
      .select('id, updated_at')
      .eq('is_active', true)
      .order('updated_at', { ascending: false }),
    supabase
      .from('forum_posts')
      .select('id, updated_at')
      .eq('is_deleted', false)
      .order('updated_at', { ascending: false })
      .limit(500),
  ])

  // Static routes with priority and change frequency
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/auth/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/auth/sign-up`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/quizzes`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/scenarios`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/decision-lab`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/forum`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/leaderboard`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  // Dynamic quiz routes
  const quizRoutes: MetadataRoute.Sitemap =
    quizzes?.map((quiz) => ({
      url: `${baseUrl}/quizzes/${quiz.id}`,
      lastModified: new Date(quiz.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })) || []

  // Dynamic scenario routes
  const scenarioRoutes: MetadataRoute.Sitemap =
    scenarios?.map((scenario) => ({
      url: `${baseUrl}/scenarios/${scenario.id}`,
      lastModified: new Date(scenario.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })) || []

  // Dynamic forum post routes
  const forumRoutes: MetadataRoute.Sitemap =
    forumPosts?.map((post) => ({
      url: `${baseUrl}/forum/${post.id}`,
      lastModified: new Date(post.updated_at),
      changeFrequency: 'daily' as const,
      priority: 0.6,
    })) || []

  return [...staticRoutes, ...quizRoutes, ...scenarioRoutes, ...forumRoutes]
}
