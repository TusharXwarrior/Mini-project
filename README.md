# AI-Based Student Dropout Prediction System

> **College Project Showcase Prototype**  
> **Stage:** Part 2 — Fullstack Backend & Database Integration  
> **Status:** Backend Connected & Live with MongoDB

---

## 📌 Project Overview

This application serves as the data collection, institutional monitoring, and student retention analytics portal for an **AI-Based Student Dropout Prediction System**.

- **Part 1 (Frontend & Data Collection)**: Built the responsive React frontend, intake form with input boundary validations, and student profile preview.
- **Part 2 (Backend & Database Integration)**: Built a REST API using Node.js, Express.js, and MongoDB with Mongoose to permanently store student records, manage student data, and display live database analytics.
- **Part 3 (Upcoming)**: Machine Learning model training, inference pipeline, and AI dropout risk probability prediction.

---

## 🚀 Tech Stack

### Frontend
- **React.js 19**: Component architecture & hooks
- **Vite 8**: Frontend build tool & HMR dev server
- **Tailwind CSS 4**: Modern styling
- **React Router DOM 7**: Client routing
- **Axios**: HTTP client for REST API communication
- **Lucide React**: Educational iconography

### Backend
- **Node.js**: Runtime environment
- **Express.js**: RESTful web API framework
- **MongoDB**: NoSQL document database
- **Mongoose**: ODM library with strict schema validation
- **dotenv**: Environment variable management
- **CORS**: Cross-origin resource sharing configuration

---

## 📁 Project Structure

```
Mini project 02/
├── backend/
│   ├── models/
│   │   └── Student.js          # Mongoose schema with validations
│   ├── controllers/
│   │   └── studentController.js # CRUD handlers & duplicate key checks
│   ├── routes/
│   │   └── studentRoutes.js    # Express route mappings
│   ├── server.js               # Express application entry & MongoDB connection
│   ├── .env                    # Environment variables (PORT, MONGODB_URI)
│   ├── .env.example            # Environment template
│   └── package.json            # Backend dependencies
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # Header with branding & route navigation
│   │   └── StudentCard.jsx     # Reusable student profile card
│   ├── pages/
│   │   ├── Home.jsx            # Landing page with system pillars
│   │   ├── Dashboard.jsx       # Real-time dashboard connected to MongoDB
│   │   ├── StudentForm.jsx     # Intake form posting to Express via Axios
│   │   ├── StudentDetails.jsx  # Student details (/students/:id) from MongoDB
│   │   └── Result.jsx          # Submission confirmation & status
│   ├── services/
│   │   └── api.js              # Centralized Axios API client
│   ├── data/
│   │   └── students.js         # Demo dataset & local fallback utilities
│   ├── App.jsx                 # Route definitions including /students/:id
│   ├── main.jsx                # Application root mounting
│   └── index.css               # Tailwind CSS imports
├── package.json                # Frontend dependencies
└── vite.config.js              # Vite configuration with Tailwind plugin
```

---

## 📡 REST API Endpoints

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Description | Response Codes |
| --- | --- | --- | --- |
| `GET` | `/health` | Health check & MongoDB connection status | 200 |
| `GET` | `/students` | Get all students from database (sorted by createdAt) | 200, 500 |
| `POST` | `/students` | Create & validate a new student record | 201, 400, 409, 500 |
| `GET` | `/students/:id` | Get single student by MongoDB `_id` or `studentId` | 200, 404, 500 |
| `DELETE` | `/students/:id` | Delete student by MongoDB `_id` or `studentId` | 200, 404, 500 |

### Sample POST Request Body
```json
{
  "studentId": "STU-2024-001",
  "name": "Aarav Sharma",
  "age": 20,
  "gender": "Male",
  "branch": "Computer Science",
  "semester": "4th Semester",
  "cgpa": 8.85,
  "previousCgpa": 8.70,
  "backlogs": 0,
  "internalMarks": 44,
  "attendance": 92,
  "assignmentCompletion": 95,
  "classesMissed": 6,
  "scholarship": "Yes",
  "feeStatus": "Paid"
}
```

---

## 💻 How to Run the Project

### 1. MongoDB Setup
Ensure MongoDB Server is running locally on port `27017`:
- On Windows: Run `Get-Service MongoDB` in PowerShell (or start via Services).
- Connection string in `backend/.env`: `mongodb://127.0.0.1:27017/student_dropout_db`

### 2. Start the Backend Server
```bash
# In project root:
npm --prefix backend start

# Or navigate directly:
cd backend
npm install
npm start
```
Backend will start on: `http://localhost:5000`

### 3. Start the Frontend Application
In a separate terminal:
```bash
npm install
npm run dev
```
Frontend will be live at: `http://localhost:5173`

---

## 🧭 Tested End-to-End User Flow

1. Open `http://localhost:5173/` (Home page).
2. Click **"Check Student Risk"** → navigates to `/student-form`.
3. Submit student details or click **"Fill Demo"**:
   - Form posts data to `POST http://localhost:5000/api/students` via Axios.
   - Shows success notification: *"Student data saved successfully."*
4. Automatically navigates to `/result` showing the submitted profile and the placeholder:
   - `ML Model: Not Connected` / `AI Prediction: Coming Soon`.
5. Open `/dashboard`:
   - Live **Total Students** count loaded directly from MongoDB.
   - Student records listed with real data: `Student ID | Student Name | Branch | Semester | CGPA | Attendance | Backlogs`.
6. Click any student row or action icon → Opens `/students/:id`:
   - Fetches the persistent record from MongoDB.
   - Retains the clear `AI Prediction: Coming Soon` notice.
7. Click **"Delete Student"** → Calls `DELETE /api/students/:id`, removes the document from MongoDB, and returns to Dashboard.

---

## 🔮 What Will Be Implemented in Part 3

- **Machine Learning Model Integration**: Training a supervised classification model (e.g., Random Forest or Logistic Regression) using student training data.
- **Prediction API Endpoint**: Creating `POST /api/predict` or attaching prediction inference directly to student records.
- **Risk Calculation**: Generating risk scores (Low, Medium, High Risk) and percentage probability of dropout.
- **Intervention Recommendations**: Visual indicators and early warning recommendations for academic advisors.
