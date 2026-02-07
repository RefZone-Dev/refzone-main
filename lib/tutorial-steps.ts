// Tutorial step definitions - simplified dashboard-only tour
export type TutorialStepType =
  | "welcome"
  | "scenarios"
  | "quizzes"
  | "match-reports"
  | "decision-lab"
  | "daily-progress"
  | "scenario-streak"
  | "forum-section"
  | "insights-section"
  | "achievements-section"
  | "leaderboard"
  | "settings"
  | "complete"

export interface TutorialStep {
  id: TutorialStepType
  step: number
  title: string
  description: string
  page: string
  targetSelector?: string
  mobileTargetSelector?: string
  position?: "center" | "top" | "bottom" | "above-navbar"
  scrollTo?: boolean
}

export const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: "welcome",
    step: 1,
    title: "Welcome to RefZone!",
    description:
      "Let's take a quick tour of the app to help you get started. You can click around and explore at any time!",
    page: "/dashboard",
    position: "center",
  },
  {
    id: "scenarios",
    step: 2,
    title: "Practice Scenarios",
    description:
      "Test your decision-making with real match situations. Each correct answer builds your streak and earns points!",
    page: "/dashboard",
    targetSelector: "[data-tutorial='scenarios']",
    scrollTo: true,
  },
  {
    id: "quizzes",
    step: 3,
    title: "Knowledge Quizzes",
    description:
      "Master the Laws of the Game with comprehensive quizzes. Multiple difficulty levels and detailed explanations!",
    page: "/dashboard",
    targetSelector: "[data-tutorial='quizzes']",
    scrollTo: true,
  },
  {
    id: "match-reports",
    step: 4,
    title: "Match Report Builder",
    description:
      "Create professional match reports with AI assistance. Perfect for documenting send-offs and incidents!",
    page: "/dashboard",
    targetSelector: "[data-tutorial='match-reports']",
    scrollTo: true,
  },
  {
    id: "decision-lab",
    step: 5,
    title: "AI DecisionLab",
    description:
      "Get AI-powered analysis of complex match situations. Describe any scenario and get expert guidance based on the Laws of the Game!",
    page: "/dashboard",
    targetSelector: "[data-tutorial='decision-lab']",
    scrollTo: true,
  },
  {
    id: "daily-progress",
    step: 6,
    title: "Today's Progress",
    description:
      "Track your daily training goals here. Set targets for scenarios and quizzes, and watch your progress throughout the day!",
    page: "/dashboard",
    targetSelector: "[data-tutorial='daily-progress']",
    scrollTo: true,
  },
  {
    id: "scenario-streak",
    step: 7,
    title: "Scenario Streak",
    description:
      "Track how many scenarios you've answered correctly in a row! Build your streak by getting consecutive correct answers.",
    page: "/dashboard",
    targetSelector: "[data-tutorial='scenario-streak']",
    scrollTo: true,
  },
  {
    id: "forum-section",
    step: 8,
    title: "Community Forum",
    description:
      "Connect with other referees, ask questions, share experiences, and learn from the community. Check out the latest discussions right here on your dashboard!",
    page: "/dashboard",
    targetSelector: "[data-tutorial='forum-section']",
    scrollTo: true,
  },
  {
    id: "insights-section",
    step: 9,
    title: "Insights & Recommendations",
    description:
      "Get personalized insights based on your performance. See your strengths and areas to improve, helping you focus your training!",
    page: "/dashboard",
    targetSelector: "[data-tutorial='insights-section']",
    scrollTo: true,
  },
  {
    id: "leaderboard",
    step: 10,
    title: "Leaderboard",
    description:
      "Compete with referees worldwide! Access the Leaderboard from the Social tab to see how you rank against others.",
    page: "/dashboard",
    targetSelector: "[data-tutorial='leaderboard-link']",
    mobileTargetSelector: "[data-tutorial='social-nav']",
    position: "above-navbar",
  },
  {
    id: "settings",
    step: 11,
    title: "Settings",
    description:
      "Manage your account, username, notifications, and appearance preferences in the Settings section.",
    page: "/dashboard",
    targetSelector: "[data-tutorial='settings-link']",
    mobileTargetSelector: "[data-tutorial='settings-nav']",
    position: "above-navbar",
  },
  {
    id: "complete",
    step: 12,
    title: "You're All Set!",
    description:
      "You've completed the tour! Now let's set your daily training goal to start your referee training journey.",
    page: "/dashboard",
    position: "center",
  },
]

export function getStepByNumber(step: number): TutorialStep | undefined {
  return TUTORIAL_STEPS.find((s) => s.step === step)
}

export function getStepsForPage(page: string): TutorialStep[] {
  return TUTORIAL_STEPS.filter((s) => s.page === page || s.page.startsWith(page))
}

export function getTotalSteps(): number {
  return TUTORIAL_STEPS.length
}
