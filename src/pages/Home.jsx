import React from "react";
import { Link } from "react-router-dom";
import { 
  GraduationCap, 
  ArrowRight, 
  BookOpen, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Database, 
  ShieldCheck 
} from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-12 py-8 sm:py-12">
      {/* Prototype Notice Banner */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3 text-blue-800 text-sm">
          <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">Project Showcase - Part 1 Prototype:</span>{" "}
            This stage implements the student data intake interface, academic metrics collection,
            and college analytics dashboard. Machine Learning risk evaluation will be connected in
            subsequent phases.
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto px-4 space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200">
          <GraduationCap className="w-4 h-4 text-blue-600" />
          Academic Performance & Early Intervention System
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Student Dropout Prediction System
        </h1>

        <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
          AI-powered early identification of students who may be at risk of dropping out.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/student-form"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow-sm hover:shadow transition"
          >
            Check Student Risk
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 shadow-xs transition"
          >
            View Student Dashboard
          </Link>
        </div>
      </section>

      {/* 3 Core Feature Cards */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Key Analytical Pillars</h2>
          <p className="text-sm text-slate-500 mt-1">
            Core dimensions collected for dropout pattern recognition and intervention
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Academic Analysis */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs hover:border-blue-200 hover:shadow-sm transition">
            <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4 border border-blue-100">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Academic Analysis</h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Monitors cumulative grade point averages (CGPA), semester-over-semester score trends,
              internal marks, and active subject backlogs.
            </p>
            <ul className="text-xs text-slate-500 space-y-1.5 border-t border-slate-100 pt-3">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                Current & Previous Semester CGPA
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                Active backlogs & course clearance
              </li>
            </ul>
          </div>

          {/* Card 2: Attendance Monitoring */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs hover:border-indigo-200 hover:shadow-sm transition">
            <div className="w-12 h-12 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 border border-indigo-100">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Attendance Monitoring</h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Tracks physical lecture attendance percentage, missed class hours, and regular
              engagement with course assignments and assessments.
            </p>
            <ul className="text-xs text-slate-500 space-y-1.5 border-t border-slate-100 pt-3">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" />
                Threshold alerts below 75% attendance
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" />
                Assignment completion rates
              </li>
            </ul>
          </div>

          {/* Card 3: Early Risk Detection */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs hover:border-amber-200 hover:shadow-sm transition">
            <div className="w-12 h-12 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-4 border border-amber-100">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Early Risk Detection</h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Consolidates academic, attendance, and administrative factors to help college
              administrators intervene before a student reaches dropout stage.
            </p>
            <ul className="text-xs text-slate-500 space-y-1.5 border-t border-slate-100 pt-3">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
                Holistic student profiling
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
                Ready pipeline for Machine Learning
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* How It Works Simple Strip */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
          <h3 className="text-base font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <Database className="w-4 h-4 text-blue-600" />
            Workflow of the System
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600">
            <div className="bg-white p-3 rounded-lg border border-slate-200">
              <span className="font-bold text-blue-600 block mb-1">Step 1: Input</span>
              Faculty / Admin enters student academic, attendance, and fee information.
            </div>
            <div className="bg-white p-3 rounded-lg border border-slate-200">
              <span className="font-bold text-blue-600 block mb-1">Step 2: Verification</span>
              Form validates boundaries (CGPA 0–10, Attendance 0–100%, non-negative values).
            </div>
            <div className="bg-white p-3 rounded-lg border border-slate-200">
              <span className="font-bold text-blue-600 block mb-1">Step 3: ML Pipeline</span>
              Data is structured for feeding into the Machine Learning prediction model in Part 2.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
