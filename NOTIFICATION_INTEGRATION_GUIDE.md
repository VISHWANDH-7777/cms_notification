# MIT Connect – Notification System Integration Guide

## Overview
This guide explains how to implement and use the cross-module notification system across all four dashboards: Student, Faculty, Finance, and Admin.

---

## 1. System Architecture

### Components
- **NotificationBell.jsx** - Bell icon with unread count badge
- **NotificationDropdown.jsx** - Dropdown showing latest 5 notifications
- **NotificationCenter.jsx** - Full notification management page
- **NotificationCard.jsx** - Individual notification card
- **CreateNotification.jsx** - Form to create notifications
- **PriorityBadge.jsx** - Visual priority indicator
- **NotificationsPage.jsx** - Route page for notifications

### Backend
- REST API on port 5000 (`/api/notifications/*`)
- In-memory database with 61 pre-seeded notifications
- Support for role-based filtering and cross-module communication

---

## 2. Integration Steps

### Step 1: Verify Components are in Place
All components should be in `src/components/`:
```
src/components/
├── NotificationBell.jsx
├── NotificationBell.css
├── NotificationDropdown.jsx
├── NotificationDropdown.css
├── NotificationCard.jsx
├── NotificationCard.css
├── NotificationCenter.jsx
├── NotificationCenter.css
├── CreateNotification.jsx
├── CreateNotification.css
├── PriorityBadge.jsx
├── PriorityBadge.css
```

### Step 2: Verify Routes
Check `src/App.jsx` has notification route:
```jsx
<Route
  path="/notifications"
  element={
    <ProtectedRoute>
      <NotificationsPage />
    </ProtectedRoute>
  }
/>
```

### Step 3: Update TopBar in Each Dashboard
The TopBar component is already updated to show:
- Notification bell with unread count
- Notification dropdown
- Settings button
- User profile

### Step 4: Backend API
The server.js has all notification endpoints:
- `GET /api/notifications/:role`
- `GET /api/notifications/:role/unread`
- `POST /api/notifications`
- `PUT /api/notifications/:id/read`
- `PUT /api/notifications/:role/read-all`
- `DELETE /api/notifications/:id`
- `POST /api/notifications/:role/clear-all`

---

## 3. Using Notifications in Each Role

### STUDENT DASHBOARD

#### Receiving Notifications
Students receive notifications from:
- **Faculty** - Assignment posts, marks, feedback, class cancellations
- **Admin** - Announcements, registration, placement alerts
- **Finance** - Fee reminders, payment confirmations

#### Sending Notifications
Students can send notifications to:
- **Faculty** - Assignment submissions, doubts, leave requests
- **Admin** - Leave applications, grievances, profile updates
- **Finance** - Fee payments, scholarship applications

#### Code Example:
```jsx
// In student dashboard
import NotificationBell from '../components/NotificationBell';
import NotificationDropdown from '../components/NotificationDropdown';

function StudentDashboard() {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const role = 'student';

  return (
    <>
      <NotificationBell 
        role={role}
        onBellClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
      />
      <NotificationDropdown
        role={role}
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />
    </>
  );
}
```

### FACULTY DASHBOARD

#### Receiving Notifications
Faculty receive notifications from:
- **Admin** - Faculty meetings, policy updates, course allocations
- **Student** - Assignment submissions, doubts, leave requests
- **Finance** - Salary alerts, expense approvals

#### Sending Notifications
Faculty can send notifications to:
- **Admin** - Grade submissions, leave requests, event proposals
- **Student** - Assignment posts, deadline reminders, feedback

#### Special Permission:
Faculty can use the **CreateNotification** form to:
```jsx
<CreateNotification 
  senderRole="faculty"
  onNotificationCreated={handleCreated}
/>
```

### FINANCE MANAGER DASHBOARD

#### Receiving Notifications
Finance receives notifications from:
- **Admin** - Budget approvals, fee structure updates
- **Student** - Fee payments, refund requests
- **Faculty** - Expense claims, reimbursement requests

#### Sending Notifications
Finance can send notifications to:
- **Admin** - Budget requests, financial reports
- **Student** - Fee reminders, payment confirmations
- **Faculty** - Salary credits, payslip notifications

#### Key Actions:
```javascript
// Send fee reminder to student
await fetch('/api/notifications', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Fee Payment Reminder',
    message: 'Your spring semester fees are due by March 25',
    senderRole: 'finance',
    receiverRole: 'student',
    module: 'Finance',
    priority: 'High'
  })
});

// Send salary notification to faculty
await fetch('/api/notifications', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Salary Credited',
    message: 'Your March 2026 salary has been credited',
    senderRole: 'finance',
    receiverRole: 'faculty',
    module: 'Finance',
    priority: 'Medium'
  })
});
```

### ADMIN DASHBOARD

#### Receiving Notifications
Admin receives notifications from:
- **Faculty** - Leave requests, grade submissions, event proposals
- **Student** - Applications, grievances
- **Finance** - Budget requests, financial reports

#### Sending Notifications
Admin can send to any role and use BROADCAST:
- **To Student** - Announcements, timetables, placement alerts
- **To Faculty** - Meetings, policies, course allocations
- **To Finance** - Fee structure updates, budget approvals
- **To ALL** - Emergency announcements, campus closures, maintenance alerts

#### Broadcast Example:
```javascript
// Send emergency announcement to all roles
await fetch('/api/notifications', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Emergency Announcement',
    message: 'Campus closed on March 13 due to severe weather',
    senderRole: 'admin',
    receiverRole: 'ALL',  // Broadcasts to everyone
    module: 'Alerts',
    priority: 'Critical'
  })
});
```

Admin uses CreateNotification form with full capabilities:
```jsx
<CreateNotification 
  senderRole="admin"
  onNotificationCreated={handleCreated}
/>
```

---

## 4. Notification Flow Examples

### Example 1: Faculty Posts Assignment
1. Faculty clicks "Post Assignment" button
2. Faculty form submits to POST /api/notifications
3. Notification created with senderRole='faculty', receiverRole='student'
4. Students see notification in bell
5. Students can view in dropdown or full Notification Center

### Example 2: Student Pays Fees
1. Student submits fee payment
2. System creates notification to Finance (senderRole='student')
3. Finance manager sees notification
4. Finance confirms payment
5. Notification sent back to Student (senderRole='finance')

### Example 3: Admin Broadcasts Campus Closure
1. Admin types emergency announcement
2. Sets receiverRole to 'ALL'
3. Notification appears in bell for all students, faculty, finance
4. All users notified of campus closure

---

## 5. Notification Center Features

### Accessing Notification Center
All roles can access: `http://localhost:5000/notifications?role=<role>`

### Features Available:
- **View All Notifications** - Full list with pagination
- **Filter by Category** - Academic, Finance, Administrative, System, Alerts
- **Filter by Priority** - Low, Medium, High, Critical
- **Filter by Status** - Unread, Read
- **Search** - Full-text search in titles and messages
- **Mark as Read** - Individual or bulk
- **Delete** - Individual or bulk clear all
- **View Details** - Modal with complete information

### UI Features:
- Unread count badge on bell
- Color-coded priority badges
- Smooth animations
- Responsive design (mobile-friendly)
- Real-time polling every 30 seconds
- Toast notifications for actions

---

## 6. Pre-Seeded Sample Notifications

The system includes 61 realistic notifications across all roles:

**Student receives (28 notifications):**
- 6 from Faculty (assignments, marks, feedback, class cancellations)
- 8 from Admin (registration, announcements, placement alerts)
- 5 from Finance (fee reminders, scholarships, payments)

**Faculty receives (12 notifications):**
- 5 from Admin (meetings, policies, course allocation)
- 5 from Finance (salary, reimbursement)
- 2 Student-initiated

**Finance receives (5 notifications):**
- 5 from various other roles

**Admin receives (5 notifications):**
- 5 from other roles

**Broadcast notifications (5):**
- Emergency announcements
- System maintenance alerts
- Campus closure notifications

---

## 7. Creating Custom Notifications

### For Faculty
```jsx
function PostAssignmentButton() {
  const handlePostAssignment = async (assignmentData) => {
    const response = await fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Assignment Posted',
        message: `${assignmentData.title} uploaded for ${assignmentData.course}`,
        senderRole: 'faculty',
        receiverRole: 'student',
        module: 'Academic',
        priority: 'Medium',
        actionId: `assignment_${assignmentData.id}`,
        relatedData: {
          courseId: assignmentData.courseId,
          dueDate: assignmentData.dueDate
        }
      })
    });
  };

  return <button onClick={handlePostAssignment}>Post Assignment</button>;
}
```

### For Admin (Broadcast)
```jsx
function BroadcastNotificationButton() {
  const handleBroadcast = async (message) => {
    await fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: message.title,
        message: message.content,
        senderRole: 'admin',
        receiverRole: 'ALL',  // Key: broadcasts to all users
        module: 'Alerts',
        priority: 'Critical'
      })
    });
  };

  return <button onClick={() => handleBroadcast(...)}>Broadcast</button>;
}
```

---

## 8. CSS Integration

All components use Tailwind-compatible CSS. The notification system is self-contained with:
- Component-scoped CSS files
- BEM naming convention
- Mobile responsive design
- Smooth animations
- Accessibility features

---

## 9. Testing the System

### Test with Curl
```bash
# Get student notifications
curl http://localhost:5000/api/notifications/student

# Get unread count
curl http://localhost:5000/api/notifications/student/unread

# Create test notification
curl -X POST http://localhost:5000/api/notifications \
  -H "Content-Type: application/json" \
  -d '{
    "title":"Test Notification",
    "message":"This is a test",
    "senderRole":"faculty",
    "receiverRole":"student",
    "module":"Academic",
    "priority":"Medium"
  }'

# Mark as read
curl -X PUT http://localhost:5000/api/notifications/1/read

# Clear all student notifications
curl -X POST http://localhost:5000/api/notifications/student/clear-all
```

### Test in Browser
1. Start the server: `npm run server`
2. Navigate to: `http://localhost:5000/notifications?role=student`
3. Test filtering, searching, and actions
4. Click notification bell in top bar
5. View dropdown with recent notifications

---

## 10. Future Enhancements

### Recommended Improvements:
1. **Database Persistence** - Replace in-memory with MongoDB/PostgreSQL
2. **Real-time Updates** - Implement Socket.io for instant notifications
3. **Email Integration** - Send email for critical notifications
4. **Notification Templates** - Reusable templates for common notifications
5. **Scheduling** - Send notifications at scheduled times
6. **Analytics** - Track notification engagement
7. **Push Notifications** - Mobile app support
8. **Notification Rules** - User-defined notification preferences
9. **Archive System** - Long-term notification retention
10. **Audit Logging** - Track who sent what to whom

---

## 11. Troubleshooting

### Notifications not showing
- Check server is running: `npm run server`
- Verify API endpoint: `http://localhost:5000/api/notifications/student`
- Check browser console for errors
- Ensure role is correct in session

### Bell not updating
- Polling interval is 30 seconds
- Check unread endpoint: `/api/notifications/student/unread`
- Clear browser cache and reload

### CreateNotification not visible
- Only Faculty and Admin can see this
- Check role in session: `getUserSession().role`

### Errors in console
- Check server logs for API errors
- Verify JSON format in POST requests
- Ensure all required fields are present

---

## 12. API Summary Quick Reference

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/notifications/:role` | Get all notifications |
| GET | `/notifications/:role/unread` | Get unread count |
| POST | `/notifications` | Create notification |
| PUT | `/notifications/:id/read` | Mark as read |
| PUT | `/notifications/:role/read-all` | Mark all read |
| DELETE | `/notifications/:id` | Delete notification |
| POST | `/notifications/:role/clear-all` | Clear all |

---

## 13. File Structure

```
cms/
├── server.js (updated with notification APIs)
├── src/
│   ├── App.jsx (updated with /notifications route)
│   ├── pages/
│   │   └── NotificationsPage.jsx
│   └── components/
│       ├── TopBar.jsx (updated with bell)
│       ├── NotificationBell.jsx
│       ├── NotificationBell.css
│       ├── NotificationDropdown.jsx
│       ├── NotificationDropdown.css
│       ├── NotificationCenter.jsx
│       ├── NotificationCenter.css
│       ├── NotificationCard.jsx
│       ├── NotificationCard.css
│       ├── CreateNotification.jsx
│       ├── CreateNotification.css
│       ├── PriorityBadge.jsx
│       └── PriorityBadge.css
├── backend/
│   ├── db/
│   │   └── notificationsDB.js (optional - for MongoDB)
│   └── routes/
│       └── notificationsRoutes.js (optional - for Express app)
└── NOTIFICATION_API_DOCUMENTATION.md
```

---

## 14. Implementation Checklist

- [x] Create notification components
- [x] Create notification styling
- [x] Implement backend APIs
- [x] Create notification page
- [x] Update TopBar with bell
- [x] Update App.jsx with route
- [x] Add pre-seeded data
- [x] Create API documentation
- [ ] Test across all roles
- [ ] Deploy to production
- [ ] Monitor performance
- [ ] Gather user feedback

---

**Last Updated:** March 12, 2026
**Version:** 1.0
**Status:** Ready for Integration

For support or questions, refer to NOTIFICATION_API_DOCUMENTATION.md or check the component source code.
