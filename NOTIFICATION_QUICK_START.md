# 🚀 Quick Start Guide – MIT Connect Notification System

## 5-Minute Setup

### Step 1: Start the Server
```bash
npm run server
```
The API will be available at `http://localhost:5000`

### Step 2: Access NotificationsPage
Navigate to:
```
http://localhost:5000/notifications?role=student
```

Supported roles: `student`, `faculty`, `finance`, `admin`

### Step 3: View Sample Notifications
- Click the **notification bell** icon in the top-right corner
- View dropdown with latest 5 notifications
- Click **"View All Notifications"** for full center

### Step 4: Test Functionality
- **Filter**: Use category, priority, status dropdowns
- **Search**: Find notifications by text
- **Mark Read**: Click individual "Mark as Read"
- **Delete**: Remove notifications
- **Create** (Faculty/Admin only): Click "Create Notification" button

---

## 📝 Create Your First Notification

### As Faculty:
1. Navigate to Notifications page
2. Click **"Create Notification"** button
3. Fill in:
   - Title: "Assignment Posted"
   - Message: "New assignment uploaded"
   - Recipient: "Student"
   - Category: "Academic"
   - Priority: "Medium"
4. Click **"Create Notification"**

### Via API (curl):
```bash
curl -X POST http://localhost:5000/api/notifications \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Assignment Posted",
    "message": "Assignment 3 uploaded for CS201",
    "senderRole": "faculty",
    "receiverRole": "student",
    "module": "Academic",
    "priority": "Medium"
  }'
```

---

## 🔍 Endpoints Quick Reference

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/notifications/student` | Get all student notifications |
| GET | `/api/notifications/student/unread` | Get unread count |
| POST | `/api/notifications` | Create notification |
| PUT | `/api/notifications/1/read` | Mark as read |
| PUT | `/api/notifications/student/read-all` | Mark all read |
| DELETE | `/api/notifications/1` | Delete notification |

See **NOTIFICATION_API_DOCUMENTATION.md** for full details.

---

## 📊 Sample Data Included

The system comes with **61 realistic notifications** across all roles, so you can test immediately without creating data.

---

## 🎯 Key Features

✅ **Notification Bell** - Animated badge with unread count  
✅ **Dropdown Preview** - Show latest 5 notifications  
✅ **Full Center** - Complete notification management  
✅ **Cross-Module** - Faculty → Student, Admin → All, etc.  
✅ **Filtering** - Category, priority, status, search  
✅ **Bulk Actions** - Mark all read, clear all  
✅ **Responsive** - Works on mobile, tablet, desktop  
✅ **Real-time** - Automatic polling for updates  

---

## 💻 For Developers

### Import Components
```jsx
import NotificationBell from './components/NotificationBell';
import NotificationDropdown from './components/NotificationDropdown';
import NotificationCenter from './components/NotificationCenter';

// Already integrated in TopBar!
```

### Create Notifications Programmatically
```javascript
const createNotification = async (data) => {
  const response = await fetch('/api/notifications', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return await response.json();
};

// Use it
createNotification({
  title: 'Test',
  message: 'Test message',
  senderRole: 'faculty',
  receiverRole: 'student',
  module: 'Academic',
  priority: 'High'
});
```

---

## 📚 Documentation

- **NOTIFICATION_API_DOCUMENTATION.md** - API reference
- **NOTIFICATION_INTEGRATION_GUIDE.md** - Integration steps
- **NOTIFICATION_ACTION_BUTTONS.md** - Ready-to-use button code
- **NOTIFICATION_IMPLEMENTATION_SUMMARY.md** - Complete overview

---

## 🆘 Troubleshooting

**Q: No notifications showing?**  
A: Make sure server is running (`npm run server`) and correct role is in URL

**Q: Bell not updating?**  
A: Polling happens every 30 seconds. Wait or refresh.

**Q: Can't create notifications?**  
A: Only Faculty and Admin can create. Check your role.

**Q: API returns error?**  
A: Check console logs. Ensure required fields are present in POST body.

---

## 🎨 Try These

1. **Student Dashboard Test**
   - URL: `http://localhost:5000/notifications?role=student`
   - View sample notifications
   - Filter by "Finance" category
   - Search "fee"

2. **Faculty Dashboard Test**
   - URL: `http://localhost:5000/notifications?role=faculty`
   - Click "Create Notification"
   - Send to "Student"
   - Watch bell update

3. **Admin Broadcast Test**
   - URL: `http://localhost:5000/notifications?role=admin`
   - Click "Create Notification"
   - Set Recipient to "ALL"
   - Set Priority to "Critical"
   - Create announcement

---

## 🎓 What You'll Learn

By exploring this system, you'll understand:
- ✅ Building multi-role notification systems
- ✅ Real-time UI updates with polling
- ✅ Cross-module communication patterns
- ✅ RESTful API design
- ✅ React component composition
- ✅ Responsive UI design
- ✅ Role-based access control

---

## 📝 Next Steps

1. **Explore** the Notification Center
2. **Read** the documentation files
3. **Test** creating notifications
4. **Integrate** action buttons into dashboards
5. **Deploy** to production

---

## 🎉 You're Ready!

Everything is set up and ready to use. Start by viewing notifications or creating your first one!

**For detailed help, see the documentation files in the project root.**

---

*MIT Connect Notification System v1.0.0*  
*Production Ready* ✅
