import type { Metadata } from 'next'
import { WeeklyQuizClient } from './weekly-quiz-client'

export const metadata: Metadata = {
  title: 'Weekly Quiz — RefZone',
  description:
    'Test your Laws of the Game knowledge with RefZone\'s free weekly quiz. 15 questions, instant results, no sign-up required.',
}

export default function WeeklyQuizPage() {
  return <WeeklyQuizClient />
}
