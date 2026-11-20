# AI-Based Student Dropout Prediction & Intervention System

> **College Project Showcase Prototype**  
> **Status:** Live Fullstack Application with Student Conversation & Progress Tracking  
> **Tech Stack:** React 19, Vite 8, Tailwind CSS 4, Node.js, Express.js, MongoDB, Mongoose, Axios

---

## 📌 Project Features Overview

This institutional portal provides academic risk monitoring, early intervention mechanisms, and longitudinal progress tracking:

### 1. 💬 Student Conversation System
- **Student ↔ Counsellor Chat**: Individual persistent chat history stored directly in MongoDB.
- **Message Timestamps**: Accurate chronological audit trail for every student interaction.
- **Dual Perspective Switch**: Seamlessly toggle between **Counsellor View** and **Student View** for presentation testing.
- **🤖 AI Counselling Assistant**: Context-aware suggested responses tailored to the student's academic standing, attendance rate, and backlog status for quick one-click counselling messages.

### 2. 📈 Student Progress Tracking
- **Multi-Checkpoint Tracking**: Log semester reviews, mid-terms, and intervention checkpoints.
- **Key Metrics Tracked**: Attendance %, CGPA, Assignment Completion %, and Active Backlogs.
- **Holistic Wellbeing**: Wellbeing rating (*Good*, *Moderate*, *Needs Attention*, *Critical*).
- **Counsellor Remarks & Action Plans**: Qualitative notes and concrete goals agreed upon with the student.
- **Scheduled Follow-Up Dates**: Actionable calendar reminders for subsequent evaluations.

### 3. ⚖️ Automatic Progress Comparison
The system automatically evaluates progress between baseline/previous assessments and the current status:

| Parameter | Previous | Current | Calculated Status |
| :--- | :--- | :--- | :---: |
| **Attendance** | 62% | 78% | 🟢 **Improving** |
| **CGPA** | 5.80 | 6.40 | 🟢 **Improving** |
| **Assignments** | 55% | 82% | 🟢 **Improving** |
| **Backlogs** | 3 | 2 | 🟢 **Improving** |

*Dynamic Status Badges:*
- 🟢 **Improving**: Academic gains, attendance recovery, backlog reduction.
- 🟡 **Stable**: Minor variations within normal performance thresholds.
- 🔴 **Declining**: Dropping scores, reduced attendance, increased backlogs.

### 4. 🗄️ Database Architecture & Cascade Deletions
- **Mongoose Schemas**: `Student`, `Message` (`Conversation.js`), and `Progress`.
- **Automatic Cascade Deletion**: Deleting a student via `DELETE /api/students/:id` automatically removes all associated conversation logs and progress checkpoints.

---

## 📡 REST API Documentation

Base URL: `http://localhost:5000/api`

### Students API
| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/students` | Get all students (sorted by createdAt) |
| `POST` | `/api/students` | Register a new student profile |
| `GET` | `/api/students/:id` | Get student details by ID or Student ID |
| `DELETE` | `/api/students/:id` | Delete student and cascade purge chat & progress |

### Conversations API
| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/conversations/:studentId` | Get complete chat history for student |
| `POST` | `/api/conversations/:studentId/messages` | Send message as Student or Counsellor |
| `POST` | `/api/conversations/:studentId/ai-suggest` | Generate AI Counselling suggested responses |

### Progress Tracking API
| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/progress/:studentId` | Get all progress review checkpoints |
| `POST` | `/api/progress/:studentId` | Record a new evaluation checkpoint |
| `GET` | `/api/progress/:studentId/comparison` | Compute automatic progress comparison |

---

## 💻 Local Setup & Execution Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB Community Server running on `mongodb://127.0.0.1:27017`

### 1. Start the Backend API Server
```bash
# From project root:
npm --prefix backend start

# Or inside backend directory:
cd backend
npm install
npm start
```
The Express backend starts at: **`http://localhost:5000`**

### 2. Start the React Frontend Application
```bash
# In the project root directory:
npm install
npm run dev
```
The application opens at: **`http://localhost:5173`**

---

## 🚀 Cloud Deployment (Render.com)

A complete [render.yaml](file:///c:/Mini%20project%2002/render.yaml) blueprint is included:
- **Backend**: Express Web Service deployed with Node environment.
- **Frontend**: Vite Static Site deployed with rewrite rules for client-side routing.
