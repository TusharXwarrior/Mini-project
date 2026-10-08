import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import StudentForm from "./pages/StudentForm";
import Result from "./pages/Result";
import Dashboard from "./pages/Dashboard";
import StudentDetails from "./pages/StudentDetails";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-100 selection:text-blue-900">
        {/* Navigation Bar */}
        <Navbar />

        {/* Page Content */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/student-form" element={<StudentForm />} />
            <Route path="/result" element={<Result />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/students/:id" element={<StudentDetails />} />
            {/* Fallback */}
            <Route
              path="*"
              element={
                <div className="text-center py-20 px-4">
                  <h2 className="text-2xl font-bold text-slate-800">Page Not Found</h2>
                  <p className="text-sm text-slate-500 mt-2">
                    The requested page could not be located.
                  </p>
                  <Link
                    to="/"
                    className="inline-block mt-4 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Return to Home
                  </Link>
                </div>
              }
            />
          </Routes>
        </main>

        {/* College Project Minimal Footer */}
        <footer className="border-t border-slate-200 bg-white py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div>
              <span className="font-semibold text-slate-700">
                AI-Based Student Dropout Prediction System
              </span>{" "}
              — College Project Showcase (Part 2: Express & MongoDB Integration)
            </div>
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-medium border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                MongoDB Connected
              </span>
              <span>Node.js • Express • React • Tailwind</span>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}
