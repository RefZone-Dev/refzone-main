# RefZone Analytics & User Management System

## Overview

This guide explains how to use the comprehensive analytics and user management system that tracks every user action on the RefZone platform.

## Features Implemented

### 1. Activity Tracking System

**Database Schema:**
- `user_activity_log` table tracks all user actions
- `analytics_summary` materialized view for aggregated stats
- Automatic tracking of: page views, quiz attempts, scenario completions, forum activity, and more

**Activity Types Tracked:**
- `page_view` - User navigates to a page
- `quiz_start` / `quiz_complete` - Quiz interactions
- `scenario_start` / `scenario_complete` - Scenario interactions
- `decision_lab_use` - Decision Lab usage
- `forum_post_create` / `forum_post_view` - Forum activity
- `report_generate` - Match report generation
- `shop_purchase` - Shop transactions
- `achievement_unlock` - Achievement progress
- `login` / `logout` - Authentication events
- `profile_update` - Profile changes
- `friend_request` - Social interactions
- `notification_read` - Notification engagement

### 2. Analytics Dashboard (`/admin/analytics`)

**Summary Metrics:**
- Total users (all time, today, this week, this month)
- Active user count and percentage
- Total tracked actions
- Most active users
- Peak usage times

**Visualizations:**
- User growth over time (line chart)
- Daily active users (line chart)
- Feature usage comparison (bar chart)
- Action type distribution (pie chart)
- Activity heatmap by day/hour
- User distribution by experience level

**Real-Time Activity Feed:**
- Latest 50 user actions across the platform
- Live updates every 30 seconds
- Filterable by action type

### 3. Enhanced User Management (`/admin/users`)

**Comprehensive User Table:**
- All user information in one view
- Columns: Name, Email, Phone, DOB/Age, Level, Points, Streak, Status, Join Date, Last Sign In
- Email and phone verification status indicators
- Admin badge for admin users
- Verified badge for verified users

**Advanced Filtering:**
- Search by name, email, or phone
- Filter by admin status (all/admins/regular users)
- Filter by verification status
- Filter by experience level
- Real-time client-side filtering

**Bulk Actions:**
- Select multiple users with checkboxes
- Select all users on current filter
- Actions: Send notifications, reset passwords, grant/revoke admin, export data, delete users
- Confirmation dialog for destructive actions

**Individual User Actions:**
- View detailed analytics (opens modal)
- Edit user information (opens edit modal)
- Send password reset email
- Delete user account
- All actions in dropdown menu

### 4. User Details Modal

**Overview Tab:**
- Profile information (email, phone, DOB, verification status)
- Statistics (points, streak, quizzes, scenarios, forum posts)
- Performance overview chart (scores over time)

**Activity Tab:**
- Recent activity feed (last 50 actions)
- Timestamp and details for each action
- Scrollable list

**Performance Tab:**
- Quiz performance by category (bar chart)
- Action distribution (pie chart)
- Success rates and averages

**Engagement Tab:**
- Total sessions count
- Average session duration
- Total actions count
- Engagement over time (line chart)

**Timeline Tab:**
- Complete activity history (last 200 actions)
- Chronological timeline view
- Full action details in JSON format

### 5. User Edit Modal

**Editable Fields:**
- Display name
- Email (view only, managed by Supabase Auth)
- Phone number
- Date of birth
- Experience level
- Total points
- Streak count
- Admin status toggle
- Verified status toggle

**Features:**
- Form validation
- Real-time updates
- Success/error notifications
- Auto-refresh parent table

### 6. API Endpoints

**Analytics APIs:**
- `GET /api/admin/analytics/summary` - Overall platform statistics
- `GET /api/admin/analytics/user-activity` - Activity log data with filters

**User Management APIs:**
- `GET /api/admin/users/[id]` - Get single user data
- `GET /api/admin/users/[id]/details` - Get comprehensive user analytics
- `POST /api/admin/users/[id]/edit` - Update user information
- `POST /api/admin/users/[id]/reset-password` - Send password reset email
- `DELETE /api/admin/users/[id]` - Delete user account
- `POST /api/admin/users/bulk-action` - Execute bulk operations

## How to Use Activity Tracking in Your Code

### Basic Activity Logging

```typescript
import { logActivity } from '@/lib/activity-logger'

// Log a simple action
logActivity({
  actionType: 'page_view',
  actionDetails: { page: 'dashboard' }
})
```

### Page View Tracking

```typescript
import { logPageView } from '@/lib/activity-logger'

// In a component
useEffect(() => {
  logPageView('Quiz Page')
}, [])
```

### Timed Activity Tracking

```typescript
import { ActivityTimer } from '@/lib/activity-logger'

// Start timing an activity
const timer = new ActivityTimer('quiz_complete', { quizId: '123' })

// ... user completes quiz ...

// End timer and log with additional details
timer.end({ score: 0.85, questionsAnswered: 10 })
```

### Example: Track Quiz Completion

```typescript
const handleQuizSubmit = async (answers: any[]) => {
  const timer = new ActivityTimer('quiz_complete', { quizId: quiz.id })
  
  // Submit quiz
  const result = await submitQuiz(answers)
  
  // Log with results
  timer.end({
    score: result.score,
    totalQuestions: quiz.questions.length,
    timeSpent: result.timeSpent,
  })
}
```

## Best Practices

1. **Log at Key Points:**
   - Page loads (use `logPageView`)
   - Feature usage (button clicks, form submissions)
   - Completions (quiz finish, scenario end)
   - Milestones (achievement unlock, level up)

2. **Include Relevant Details:**
   - IDs (quizId, scenarioId, postId)
   - Outcomes (score, success/failure, choices made)
   - Context (difficulty level, category)

3. **Use Timers for Duration:**
   - Use `ActivityTimer` for activities with measurable duration
   - Track time spent on quizzes, scenarios, reading content

4. **Don't Overlog:**
   - Log meaningful actions, not every mousemove
   - Group related micro-actions into one log entry
   - Consider performance impact

## Privacy Considerations

- Activity logging only works for authenticated users
- No personally identifiable data is logged beyond user_id
- IP addresses can be optionally captured server-side
- User agents are logged for analytics purposes
- Users should be informed about tracking in your privacy policy

## Database Maintenance

The `user_activity_log` table can grow large. Consider:

1. **Periodic Cleanup:**
   ```sql
   DELETE FROM user_activity_log 
   WHERE created_at < NOW() - INTERVAL '90 days';
   ```

2. **Archiving:**
   Move old data to an archive table for historical analysis

3. **Materialized View Refresh:**
   The `analytics_summary` view is automatically maintained by triggers

## Troubleshooting

**Activity not appearing in analytics:**
- Check browser console for errors
- Verify user is authenticated
- Check Supabase RLS policies
- Ensure activity type is valid

**Performance issues:**
- Index `user_activity_log` on `user_id` and `created_at`
- Consider pagination for large datasets
- Use the summary view for aggregated data

**Missing user details:**
- Ensure service role key is set (SUPABASE_SERVICE_ROLE_KEY)
- Check admin permissions
- Verify user exists in both auth and profiles

## Future Enhancements

Consider adding:
- Export analytics data to CSV/PDF
- Custom date range filters
- User cohort analysis
- Funnel tracking
- A/B test result tracking
- Automated reports via email
- Real-time dashboard with WebSockets
- User behavior segmentation
