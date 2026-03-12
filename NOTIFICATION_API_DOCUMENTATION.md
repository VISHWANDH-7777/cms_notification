# MIT Connect – Notification System API Documentation

## Base URL
```
http://localhost:5000/api/notifications
```

## Endpoints

### 1. Get Notifications for a Role
**GET** `/api/notifications/:role`

Get all notifications for a specific role (student, faculty, finance, admin).

**Path Parameters:**
- `role` (string) - User role: `student`, `faculty`, `finance`, or `admin`

**Query Parameters:**
- `category` (string, optional) - Filter by category: `Academic`, `Finance`, `Administrative`, `System`, `Alerts`
- `priority` (string, optional) - Filter by priority: `Low`, `Medium`, `High`, `Critical`
- `status` (string, optional) - Filter by status: `unread`, `read`, `archived`
- `search` (string, optional) - Search in title and message

**Example Request:**
```bash
GET /api/notifications/student
GET /api/notifications/student?category=Academic&status=unread
GET /api/notifications/faculty?priority=High&search=meeting
```

**Response (200 OK):**
```json
{
  "success": true,
  "role": "student",
  "data": [
    {
      "id": 1,
      "title": "Assignment Posted",
      "message": "Assignment 3: Data Structures uploaded",
      "senderRole": "faculty",
      "receiverRole": "student",
      "module": "Academic",
      "priority": "Medium",
      "status": "unread",
      "createdAt": "2026-03-12T10:30:00Z",
      "actionId": "assignment_posted_1",
      "relatedData": {
        "courseId": "CS201",
        "courseName": "Data Structures"
      }
    }
  ],
  "count": 1,
  "unreadCount": 5
}
```

---

### 2. Get Unread Count
**GET** `/api/notifications/:role/unread`

Get the count of unread notifications for a role.

**Path Parameters:**
- `role` (string) - User role

**Example Request:**
```bash
GET /api/notifications/student/unread
```

**Response (200 OK):**
```json
{
  "success": true,
  "role": "student",
  "unreadCount": 5
}
```

---

### 3. Create Notification
**POST** `/api/notifications`

Create a new notification.

**Request Body:**
```json
{
  "title": "Assignment Posted",
  "message": "Assignment 3 uploaded for Data Structures",
  "senderRole": "faculty",
  "receiverRole": "student",
  "module": "Academic",
  "priority": "Medium",
  "actionId": "assignment_posted_1",
  "relatedData": {
    "courseId": "CS201",
    "courseName": "Data Structures",
    "dueDate": "2026-03-19"
  }
}
```

**Required Fields:**
- `title` (string, max 100 chars)
- `message` (string, max 500 chars)
- `senderRole` (string) - `student`, `faculty`, `finance`, `admin`
- `receiverRole` (string) - `student`, `faculty`, `finance`, `admin`, `ALL` (for broadcast)
- `module` (string) - `Academic`, `Finance`, `Administrative`, `System`, `Alerts`
- `priority` (string) - `Low`, `Medium`, `High`, `Critical`

**Optional Fields:**
- `actionId` (string) - Track notification triggers
- `relatedData` (object) - Additional context data

**Example Request:**
```bash
curl -X POST http://localhost:5000/api/notifications \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Fee Payment Reminder",
    "message": "Your fees are due by March 25",
    "senderRole": "finance",
    "receiverRole": "student",
    "module": "Finance",
    "priority": "High"
  }'
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Notification created",
  "data": {
    "id": 62,
    "title": "Fee Payment Reminder",
    "message": "Your fees are due by March 25",
    "senderRole": "finance",
    "receiverRole": "student",
    "module": "Finance",
    "priority": "High",
    "status": "unread",
    "createdAt": "2026-03-12T18:00:00Z",
    "actionId": null,
    "relatedData": {}
  }
}
```

---

### 4. Mark Notification as Read
**PUT** `/api/notifications/:id/read`

Mark a single notification as read.

**Path Parameters:**
- `id` (integer) - Notification ID

**Example Request:**
```bash
PUT /api/notifications/5/read
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Notification marked as read",
  "data": {
    "id": 5,
    "status": "read",
    ...
  }
}
```

---

### 5. Mark All as Read
**PUT** `/api/notifications/:role/read-all`

Mark all notifications as read for a specific role.

**Path Parameters:**
- `role` (string) - User role

**Example Request:**
```bash
PUT /api/notifications/student/read-all
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "All notifications marked as read",
  "count": 12
}
```

---

### 6. Delete Notification
**DELETE** `/api/notifications/:id`

Delete a single notification.

**Path Parameters:**
- `id` (integer) - Notification ID

**Example Request:**
```bash
DELETE /api/notifications/5
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Notification deleted",
  "data": {
    "id": 5,
    ...
  }
}
```

---

### 7. Clear All Notifications
**POST** `/api/notifications/:role/clear-all`

Delete all notifications for a role.

**Path Parameters:**
- `role` (string) - User role

**Example Request:**
```bash
POST /api/notifications/student/clear-all
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "All notifications cleared",
  "deletedCount": 12
}
```

---

## Notification Object Structure

```typescript
{
  id: number;                    // Unique identifier
  title: string;                 // Notification title
  message: string;               // Notification message
  senderRole: string;            // Who sent it
  receiverRole: string;          // Who receives it (can be 'ALL')
  module: string;                // Category/Module
  priority: string;              // Low, Medium, High, Critical
  status: string;                // unread, read, archived
  createdAt: string;             // ISO timestamp
  actionId?: string;             // For tracking triggers
  relatedData?: object;          // Additional context
}
```

---

## Cross-Module Notification Examples

### Student ↔ Faculty (Academic)
**Faculty → Student:**
```json
{
  "title": "Assignment Posted",
  "message": "New assignment uploaded for CS201",
  "senderRole": "faculty",
  "receiverRole": "student",
  "module": "Academic",
  "priority": "Medium"
}
```

**Student → Faculty:**
```json
{
  "title": "Assignment Submitted",
  "message": "Student submitted assignment 3",
  "senderRole": "student",
  "receiverRole": "faculty",
  "module": "Academic",
  "priority": "Medium"
}
```

### Student ↔ Finance (Finance)
**Finance → Student:**
```json
{
  "title": "Fee Payment Reminder",
  "message": "Fees due by March 25",
  "senderRole": "finance",
  "receiverRole": "student",
  "module": "Finance",
  "priority": "High"
}
```

**Student → Finance:**
```json
{
  "title": "Fee Payment Submitted",
  "message": "Student submitted payment",
  "senderRole": "student",
  "receiverRole": "finance",
  "module": "Finance",
  "priority": "Medium"
}
```

### Admin → All (Broadcast)
```json
{
  "title": "Campus Closure",
  "message": "Campus closed on March 13 due to weather",
  "senderRole": "admin",
  "receiverRole": "ALL",
  "module": "Alerts",
  "priority": "Critical"
}
```

---

## Frontend Component Integration

### NotificationBell Component
Displays unread count badge and polls for updates.

```jsx
import NotificationBell from './components/NotificationBell';

<NotificationBell 
  role="student"
  onBellClick={() => setIsOpen(!isOpen)}
/>
```

### NotificationDropdown Component
Shows preview of latest 5 notifications.

```jsx
import NotificationDropdown from './components/NotificationDropdown';

<NotificationDropdown 
  role="student"
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
/>
```

### NotificationCenter Component
Full-featured notification management page.

```jsx
import NotificationCenter from './components/NotificationCenter';

<NotificationCenter role="student" />
```

### CreateNotification Component
Form to create and send notifications.

```jsx
import CreateNotification from './components/CreateNotification';

<CreateNotification 
  senderRole="faculty"
  onNotificationCreated={handleCreated}
/>
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": "Missing required fields: title, message, senderRole..."
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "Notification not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Internal server error message"
}
```

---

## Usage Examples

### JavaScript/Fetch
```javascript
// Get notifications for student
const response = await fetch('/api/notifications/student?status=unread');
const data = await response.json();

// Create notification
const newNotif = await fetch('/api/notifications', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Assignment Due',
    message: 'Submit by tomorrow',
    senderRole: 'faculty',
    receiverRole: 'student',
    module: 'Academic',
    priority: 'High'
  })
});

// Mark as read
await fetch('/api/notifications/5/read', { method: 'PUT' });

// Delete notification
await fetch('/api/notifications/5', { method: 'DELETE' });
```

### React Hook Example
```javascript
const [notifications, setNotifications] = useState([]);

useEffect(() => {
  const fetchNotifications = async () => {
    const response = await fetch(`/api/notifications/${role}`);
    const data = await response.json();
    setNotifications(data.data);
  };

  fetchNotifications();
  const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
  return () => clearInterval(interval);
}, [role]);
```

---

## Features Implemented

✅ Cross-module notifications (Student ↔ Faculty ↔ Finance ↔ Admin)
✅ Real-time notification bell with unread count
✅ Notification dropdown preview
✅ Full notification center page
✅ Notification creation panel
✅ Category filtering (Academic, Finance, Administrative, System, Alerts)
✅ Priority levels (Low, Medium, High, Critical)
✅ Search and filter capabilities
✅ Mark as read / Mark all read
✅ Delete notifications
✅ Broadcast notifications to all roles
✅ Responsive UI design
✅ Animations and smooth transitions

---

## Testing Endpoints

Use the following curl commands to test:

```bash
# Get student notifications
curl http://localhost:5000/api/notifications/student

# Create a notification
curl -X POST http://localhost:5000/api/notifications \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","message":"Test","senderRole":"faculty","receiverRole":"student","module":"Academic","priority":"High"}'

# Mark as read
curl -X PUT http://localhost:5000/api/notifications/1/read

# Get unread count
curl http://localhost:5000/api/notifications/student/unread

# Delete notification
curl -X DELETE http://localhost:5000/api/notifications/1
```

---

## Notes

- The notification system uses in-memory storage (will reset on server restart)
- For production, implement proper database persistence
- Consider adding database indexing for role-based queries
- Implement authentication/authorization for security
- Add Socket.io for real-time updates in production
- Monitor notification database size for cleanup strategies
