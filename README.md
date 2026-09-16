# AI-Based Student Dropout Prediction System (Part 1)

> **College Project Showcase Prototype**  
> **Stage:** Part 1 — Frontend & Student Data Collection Interface  
> **Status:** Completed & Functional

---

## 📌 Project Overview

This application serves as the data collection and institutional monitoring portal for an **AI-Based Student Dropout Prediction System**. 

In this first stage (**Part 1**), the focus is solely on providing an intuitive, realistic, and responsive interface to collect key academic, attendance, and administrative indicators that influence student retention. Machine learning prediction models will be connected in subsequent parts.

---

## 🚀 Tech Stack

- **React.js 19**: Component-based UI library
- **Vite 8**: Modern build tool and development server
- **Tailwind CSS 4**: Utility-first styling framework
- **React Router DOM 7**: Client-side page routing
- **Lucide React**: Clean and minimal educational icons

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Navbar.jsx          # Top navigation bar with branding, routes & mobile menu
│   └── StudentCard.jsx     # Reusable card component displaying student profiles
├── pages/
│   ├── Home.jsx            # Landing page with hero & 3 analytical pillars
│   ├── Dashboard.jsx       # Analytics dashboard with metric cards & demo table
│   ├── StudentForm.jsx     # 3-section student data intake form with validation
│   └── Result.jsx          # Submitted record preview with ML: Not Connected badge
├── data/
│   └── students.js         # 10 fictional demo students & localStorage helpers
├── App.jsx                 # Application routes & layout wrapper
├── main.jsx                # Application root mounting
└── index.css               # Tailwind CSS imports and base styles
```

---

## 🧭 Application Flow

1. **Home (`/`)**:
   - Hero header: *"Student Dropout Prediction System"*
   - Subtitle: *"AI-powered early identification of students who may be at risk of dropping out."*
   - CTA button: **Check Student Risk** → navigates directly to `/student-form`.
   - 3 Feature Cards: **Academic Analysis**, **Attendance Monitoring**, and **Early Risk Detection**.

2. **Student Input Form (`/student-form`)**:
   Divided into 3 clean, validated sections:
   - **Personal Details**: Student ID, Name, Age, Gender, Course/Branch, Semester.
   - **Academic Performance**: Current CGPA, Previous CGPA, Backlogs, Internal Marks.
   - **Attendance & Other Factors**: Attendance %, Assignment Completion %, Classes Missed, Scholarship (Yes/No), Fee Status (Paid/Pending).
   - Built-in validation rules (CGPA 0–10, Attendance 0–100%, non-negative values).
   - Built-in demo auto-fill buttons for presentation convenience.

3. **Result Preview (`/result`)**:
   - Displays confirmation: *"Student Information Submitted"*.
   - Renders the entered student profile in a clean `StudentCard`.
   - Shows the placeholder:
     - **AI Prediction**: *"Prediction will appear here after connecting the Machine Learning model."*
     - Badge: `ML Model: Not Connected`.

4. **Institutional Dashboard (`/dashboard`)**:
   - Metric Cards:
     - **Total Students**: `25`
     - **Students Registered**: `18`
     - **Prediction Status**: `Coming Soon`
   - Student Table with columns:
     `Student ID | Name | Branch | Semester | Attendance | CGPA`
   - Pre-populated with 10 realistic fictional demo students.

---

## 💻 How to Run the Project

### Prerequisites
- Node.js (v18 or higher recommended)
- npm

### Installation & Execution

1. **Clone or navigate to the project directory**:
   ```bash
   cd "Mini project 02"
   ```

2. **Install dependencies** (if not already installed):
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Visit [http://localhost:5173](http://localhost:5173)

5. **Build for production**:
   ```bash
   npm run build
   ```
