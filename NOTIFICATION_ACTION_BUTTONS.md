# Notification Action Buttons – Implementation Guide

This document provides ready-to-use code snippets for adding notification-triggering buttons to each role's dashboard.

---

## STUDENT DASHBOARD

### 1. Submit Assignment Button
```jsx
import { useState } from 'react';

function SubmitAssignmentButton({ courseId, assignmentId, facultyId }) {
  const [loading, setLoading] = useState(false);

  const handleSubmitAssignment = async (files) => {
    setLoading(true);
    try {
      // Upload assignment files...
      
      // Send notification to faculty
      const notificationResponse = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Assignment Submitted',
          message: `Student submitted assignment for ${courseId}`,
          senderRole: 'student',
          receiverRole: 'faculty',
          module: 'Academic',
          priority: 'Medium',
          actionId: `student_submission_${assignmentId}`,
          relatedData: {
            studentId: 'STU001',
            assignmentId: assignmentId,
            courseId: courseId,
            submittedAt: new Date().toISOString()
          }
        })
      });

      if (notificationResponse.ok) {
        alert('Assignment submitted successfully!');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to submit assignment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={() => handleSubmitAssignment([...])}
      disabled={loading}
    >
      {loading ? 'Submitting...' : 'Submit Assignment'}
    </button>
  );
}

export default SubmitAssignmentButton;
```

### 2. Ask Doubt Button
```jsx
function AskDoubtButton({ courseId, topic }) {
  const handleAskDoubt = async (doubtMessage) => {
    try {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Doubt Request',
          message: `Student requested clarification on: ${doubtMessage}`,
          senderRole: 'student',
          receiverRole: 'faculty',
          module: 'Academic',
          priority: 'Medium',
          actionId: `doubt_${Date.now()}`,
          relatedData: {
            courseId,
            topic: doubtMessage,
            studentId: 'STU001'
          }
        })
      });

      alert('Your doubt has been sent to faculty');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <button onClick={() => {
      const message = prompt('Describe your doubt:');
      if (message) handleAskDoubt(message);
    }}>
      Ask Doubt
    </button>
  );
}

export default AskDoubtButton;
```

### 3. Request Leave Button
```jsx
function RequestLeaveButton() {
  const handleRequestLeave = async (startDate, endDate, reason) => {
    try {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Leave Request',
          message: `Student applied for leave from ${startDate} to ${endDate}`,
          senderRole: 'student',
          receiverRole: 'faculty',
          module: 'Academic',
          priority: 'Medium',
          actionId: `leave_${Date.now()}`,
          relatedData: {
            studentId: 'STU001',
            startDate,
            endDate,
            reason,
            numberOfDays: Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24))
          }
        })
      });

      alert('Leave request submitted');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <button onClick={() => {
      const start = prompt('Start date (YYYY-MM-DD):');
      const end = prompt('End date (YYYY-MM-DD):');
      const reason = prompt('Reason:');
      if (start && end && reason) handleRequestLeave(start, end, reason);
    }}>
      Request Leave
    </button>
  );
}

export default RequestLeaveButton;
```

### 4. Submit Grievance Button
```jsx
function SubmitGrievanceButton() {
  const handleSubmitGrievance = async (subject, description) => {
    try {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Grievance Submission',
          message: subject,
          senderRole: 'student',
          receiverRole: 'admin',
          module: 'Administrative',
          priority: 'High',
          actionId: `grievance_${Date.now()}`,
          relatedData: {
            studentId: 'STU001',
            subject,
            description,
            submitDate: new Date().toISOString()
          }
        })
      });

      alert('Grievance submitted to administration');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <button onClick={() => {
      const subject = prompt('Grievance subject:');
      const description = prompt('Description:');
      if (subject && description) handleSubmitGrievance(subject, description);
    }}>
      Submit Grievance
    </button>
  );
}

export default SubmitGrievanceButton;
```

### 5. Pay Fees Button
```jsx
function PayFeesButton({ semesterCode, amount }) {
  const handlePayFees = async (paymentMethod, transactionId) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Fee Payment Submitted',
          message: `Payment of ₹${amount} submitted for ${semesterCode}`,
          senderRole: 'student',
          receiverRole: 'finance',
          module: 'Finance',
          priority: 'Medium',
          actionId: `payment_${transactionId}`,
          relatedData: {
            studentId: 'STU001',
            amount,
            semesterCode,
            paymentMethod,
            transactionId,
            paymentDate: new Date().toISOString()
          }
        })
      });

      alert('Payment processed successfully');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <button onClick={() => {
      const method = prompt('Payment method (Credit Card/Online):');
      const txId = `TXN${Date.now()}`;
      if (method) handlePayFees(method, txId);
    }}>
      Pay Fees (₹{amount})
    </button>
  );
}

export default PayFeesButton;
```

### 6. Apply Scholarship Button
```jsx
function ApplyScholarshipButton() {
  const handleApplyScholarship = async (scholarshipType, cgpa) => {
    try {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Scholarship Application',
          message: `Student applied for ${scholarshipType} scholarship`,
          senderRole: 'student',
          receiverRole: 'finance',
          module: 'Finance',
          priority: 'Medium',
          actionId: `scholarship_${Date.now()}`,
          relatedData: {
            studentId: 'STU001',
            scholarshipType,
            cgpa,
            applicationDate: new Date().toISOString()
          }
        })
      });

      alert('Scholarship application submitted');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <button onClick={() => {
      const type = prompt('Scholarship type (Merit/Need-based):');
      const cgpa = prompt('Your CGPA:');
      if (type && cgpa) handleApplyScholarship(type, cgpa);
    }}>
      Apply for Scholarship
    </button>
  );
}

export default ApplyScholarshipButton;
```

---

## FACULTY DASHBOARD

### 1. Post Assignment Button
```jsx
function PostAssignmentButton({ courseId, courseName }) {
  const handlePostAssignment = async (assignmentTitle, dueDate, description) => {
    try {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Assignment Posted',
          message: `${assignmentTitle} uploaded for ${courseName}`,
          senderRole: 'faculty',
          receiverRole: 'student',
          module: 'Academic',
          priority: 'Medium',
          actionId: `assignment_${Date.now()}`,
          relatedData: {
            courseId,
            courseName,
            assignmentTitle,
            dueDate,
            description,
            postedDate: new Date().toISOString()
          }
        })
      });

      alert('Assignment posted to students');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <button onClick={() => {
      const title = prompt('Assignment title:');
      const due = prompt('Due date (YYYY-MM-DD):');
      const desc = prompt('Description:');
      if (title && due && desc) handlePostAssignment(title, due, desc);
    }}>
      Post Assignment
    </button>
  );
}

export default PostAssignmentButton;
```

### 2. Release Marks Button
```jsx
function ReleaseMarksButton({ courseId, courseName, examName }) {
  const handleReleaseMarks = async () => {
    try {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Internal Marks Released',
          message: `${examName} marks for ${courseName} have been released. Check your grades.`,
          senderRole: 'faculty',
          receiverRole: 'student',
          module: 'Academic',
          priority: 'Medium',
          actionId: `marks_released_${Date.now()}`,
          relatedData: {
            courseId,
            courseName,
            examName,
            releaseDate: new Date().toISOString(),
            studentsAffected: 68
          }
        })
      });

      alert('Marks released to students');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <button onClick={handleReleaseMarks}>
      Release Marks - {courseName}
    </button>
  );
}

export default ReleaseMarksButton;
```

### 3. Cancel Class Button
```jsx
function CancelClassButton({ courseId, courseName, scheduledTime }) {
  const handleCancelClass = async (reason) => {
    try {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Class Cancellation',
          message: `${courseName} class scheduled for today is cancelled due to ${reason}.`,
          senderRole: 'faculty',
          receiverRole: 'student',
          module: 'Academic',
          priority: 'High',
          actionId: `class_cancelled_${Date.now()}`,
          relatedData: {
            courseId,
            courseName,
            scheduledTime,
            cancellationReason: reason,
            cancelledAt: new Date().toISOString()
          }
        })
      });

      alert('Class cancellation notified to students');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <button onClick={() => {
      const reason = prompt('Reason for cancellation:');
      if (reason) handleCancelClass(reason);
    }}>
      Cancel Class
    </button>
  );
}

export default CancelClassButton;
```

### 4. Submit Grades Button
```jsx
function SubmitGradesButton({ courseId, examName, studentCount }) {
  const handleSubmitGrades = async () => {
    try {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Grade Submission',
          message: `Grades submitted for ${examName}`,
          senderRole: 'faculty',
          receiverRole: 'admin',
          module: 'Academic',
          priority: 'Medium',
          actionId: `grade_submission_${Date.now()}`,
          relatedData: {
            courseId,
            examName,
            gradesSubmitted: studentCount,
            submissionDate: new Date().toISOString()
          }
        })
      });

      alert('Grades submitted to administration');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <button onClick={handleSubmitGrades}>
      Submit Grades ({studentCount} students)
    </button>
  );
}

export default SubmitGradesButton;
```

### 5. Submit Leave Request Button
```jsx
function SubmitLeaveRequestButton() {
  const handleSubmitLeaveRequest = async (startDate, endDate, reason) => {
    try {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Faculty Leave Request',
          message: `Leave request for ${startDate} to ${endDate}`,
          senderRole: 'faculty',
          receiverRole: 'admin',
          module: 'Administrative',
          priority: 'Medium',
          actionId: `faculty_leave_${Date.now()}`,
          relatedData: {
            facultyId: 'FAC001',
            startDate,
            endDate,
            reason,
            numberOfDays: Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)),
            replacementFaculty: 'Dr. Priya Singh'
          }
        })
      });

      alert('Leave request submitted');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <button onClick={() => {
      const start = prompt('Start date:');
      const end = prompt('End date:');
      const reason = prompt('Reason:');
      if (start && end && reason) handleSubmitLeaveRequest(start, end, reason);
    }}>
      Submit Leave Request
    </button>
  );
}

export default SubmitLeaveRequestButton;
```

---

## FINANCE MANAGER DASHBOARD

### 1. Send Fee Reminder Button
```jsx
function SendFeeReminderButton({ studentId, amount, dueDate }) {
  const handleSendReminder = async () => {
    try {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Fee Payment Reminder',
          message: `Your semester fees of ₹${amount} are due by ${dueDate}. Pay now to avoid penalty.`,
          senderRole: 'finance',
          receiverRole: 'student',
          module: 'Finance',
          priority: 'High',
          actionId: `fee_reminder_${studentId}`,
          relatedData: {
            studentId,
            amount,
            dueDate,
            semesterCode: 'SP2026',
            reminderSentAt: new Date().toISOString()
          }
        })
      });

      alert('Fee reminder sent to student');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <button onClick={handleSendReminder}>
      Send Fee Reminder (₹{amount})
    </button>
  );
}

export default SendFeeReminderButton;
```

### 2. Approve Scholarship Button
```jsx
function ApproveScholarshipButton({ studentId, scholarshipAmount }) {
  const handleApproveScholarship = async () => {
    try {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Scholarship Approval',
          message: `Your scholarship of ₹${scholarshipAmount} has been approved`,
          senderRole: 'finance',
          receiverRole: 'student',
          module: 'Finance',
          priority: 'Medium',
          actionId: `scholarship_approved_${studentId}`,
          relatedData: {
            studentId,
            scholarshipAmount,
            approvalDate: new Date().toISOString(),
            validFrom: '2026-03-01',
            validTo: '2026-12-31'
          }
        })
      });

      alert('Scholarship approved and notified');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <button onClick={handleApproveScholarship}>
      Approve Scholarship
    </button>
  );
}

export default ApproveScholarshipButton;
```

### 3. Process Refund Button
```jsx
function ProcessRefundButton({ studentId, refundAmount, reason }) {
  const handleProcessRefund = async () => {
    try {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Refund Processed',
          message: `Your refund of ₹${refundAmount} has been processed. Check your account within 5 working days.`,
          senderRole: 'finance',
          receiverRole: 'student',
          module: 'Finance',
          priority: 'Medium',
          actionId: `refund_${Date.now()}`,
          relatedData: {
            studentId,
            refundAmount,
            reason,
            processedDate: new Date().toISOString(),
            expectedInAccountBy: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
          }
        })
      });

      alert('Refund processed and notified');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <button onClick={handleProcessRefund}>
      Process Refund (₹{refundAmount})
    </button>
  );
}

export default ProcessRefundButton;
```

### 4. Confirm Payment Button
```jsx
function ConfirmPaymentButton({ studentId, amount, transactionId }) {
  const handleConfirmPayment = async () => {
    try {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Payment Confirmation',
          message: `Your payment of ₹${amount} has been successfully processed. Receipt sent to your email.`,
          senderRole: 'finance',
          receiverRole: 'student',
          module: 'Finance',
          priority: 'Medium',
          actionId: `payment_confirmation_${transactionId}`,
          relatedData: {
            studentId,
            amount,
            transactionId,
            paymentDate: new Date().toISOString(),
            receiptSent: true
          }
        })
      });

      alert('Payment confirmed and notified');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <button onClick={handleConfirmPayment}>
      Confirm Payment
    </button>
  );
}

export default ConfirmPaymentButton;
```

---

## ADMIN DASHBOARD

### 1. Broadcast Announcement Button
```jsx
function BroadcastAnnouncementButton() {
  const handleBroadcast = async (title, message, priority) => {
    try {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          message,
          senderRole: 'admin',
          receiverRole: 'ALL',  // Broadcast to everyone
          module: priority === 'Critical' ? 'Alerts' : 'System',
          priority,
          actionId: `broadcast_${Date.now()}`,
          relatedData: {
            broadcastDate: new Date().toISOString(),
            targetRoles: ['student', 'faculty', 'finance']
          }
        })
      });

      alert('Announcement broadcasted to all users');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <button onClick={() => {
      const title = prompt('Announcement title:');
      const message = prompt('Message:');
      const priority = prompt('Priority (Low/Medium/High/Critical):');
      if (title && message && priority) handleBroadcast(title, message, priority);
    }}>
      Broadcast Announcement
    </button>
  );
}

export default BroadcastAnnouncementButton;
```

### 2. Emergency Announcement Button
```jsx
function EmergencyAnnouncementButton() {
  const handleEmergency = async (reason, date) => {
    try {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Emergency Announcement',
          message: `Campus closure: ${reason}`,
          senderRole: 'admin',
          receiverRole: 'ALL',
          module: 'Alerts',
          priority: 'Critical',
          actionId: `emergency_${Date.now()}`,
          relatedData: {
            reason,
            affectedDate: date,
            announcedAt: new Date().toISOString()
          }
        })
      });

      alert('Emergency announcement sent to all users');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <button onClick={() => {
      const reason = prompt('Reason for closure:');
      const date = prompt('Date (YYYY-MM-DD):');
      if (reason && date) handleEmergency(reason, date);
    }}>
      Send Emergency Announcement
    </button>
  );
}

export default EmergencyAnnouncementButton;
```

### 3. Release Exam Timetable Button
```jsx
function ReleaseExamTimetableButton({ semesterCode, examStartDate }) {
  const handleReleaseTimetable = async () => {
    try {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Exam Timetable Released',
          message: `Final exam timetable for ${semesterCode} is now available. Check your schedule.`,
          senderRole: 'admin',
          receiverRole: 'student',
          module: 'Administrative',
          priority: 'High',
          actionId: `exam_timetable_${Date.now()}`,
          relatedData: {
            semesterCode,
            examStartDate,
            releaseDate: new Date().toISOString()
          }
        })
      });

      alert('Exam timetable released to students');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <button onClick={handleReleaseTimetable}>
      Release Exam Timetable
    </button>
  );
}

export default ReleaseExamTimetableButton;
```

### 4. Send Placement Alert Button
```jsx
function SendPlacementAlertButton() {
  const handleSendPlacementAlert = async (company, registrationDeadline) => {
    try {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Placement Campaign Alert',
          message: `${company} is recruiting! Register before ${registrationDeadline} for campus interview.`,
          senderRole: 'admin',
          receiverRole: 'student',
          module: 'Administrative',
          priority: 'High',
          actionId: `placement_${Date.now()}`,
          relatedData: {
            company,
            registrationDeadline,
            alertSentAt: new Date().toISOString()
          }
        })
      });

      alert('Placement alert sent to students');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <button onClick={() => {
      const company = prompt('Company name:');
      const deadline = prompt('Registration deadline:');
      if (company && deadline) handleSendPlacementAlert(company, deadline);
    }}>
      Send Placement Alert
    </button>
  );
}

export default SendPlacementAlertButton;
```

### 5. Schedule Faculty Meeting Button
```jsx
function ScheduleFacultyMeetingButton() {
  const handleScheduleMeeting = async (meetingDate, location, agenda) => {
    try {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Faculty Meeting Scheduled',
          message: `Meeting scheduled for ${meetingDate} at ${location}. Attendance mandatory.`,
          senderRole: 'admin',
          receiverRole: 'faculty',
          module: 'Administrative',
          priority: 'High',
          actionId: `meeting_${Date.now()}`,
          relatedData: {
            meetingDate,
            location,
            agenda,
            scheduledAt: new Date().toISOString()
          }
        })
      });

      alert('Meeting scheduled and notified to faculty');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <button onClick={() => {
      const date = prompt('Meeting date and time:');
      const location = prompt('Location:');
      const agenda = prompt('Agenda:');
      if (date && location && agenda) handleScheduleMeeting(date, location, agenda);
    }}>
      Schedule Faculty Meeting
    </button>
  );
}

export default ScheduleFacultyMeetingButton;
```

---

## Integration Examples

### In Student Dashboard
```jsx
import SubmitAssignmentButton from './buttons/SubmitAssignmentButton';
import PayFeesButton from './buttons/PayFeesButton';
import ApplyScholarshipButton from './buttons/ApplyScholarshipButton';

function StudentDashboard() {
  return (
    <div>
      <SubmitAssignmentButton courseId="CS201" assignmentId="1" />
      <PayFeesButton semesterCode="SP2026" amount={85000} />
      <ApplyScholarshipButton />
    </div>
  );
}
```

### In Faculty Dashboard
```jsx
import PostAssignmentButton from './buttons/PostAssignmentButton';
import ReleaseMarksButton from './buttons/ReleaseMarksButton';
import CancelClassButton from './buttons/CancelClassButton';

function FacultyDashboard() {
  return (
    <div>
      <PostAssignmentButton courseId="CS201" courseName="Data Structures" />
      <ReleaseMarksButton courseId="CS201" courseName="Data Structures" examName="Mid-term" />
      <CancelClassButton courseId="CS201" courseName="Data Structures" />
    </div>
  );
}
```

---

**All buttons are ready to use!** Simply copy and paste into your dashboard components.
