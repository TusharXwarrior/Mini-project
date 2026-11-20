import React from "react";
import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  BookOpen, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  BrainCircuit, 
  ShieldCheck,
  TrendingUp,
  MessageSquare
} from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-12 py-8 sm:py-12">
      {/* Complete System Notice Banner */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3 text-emerald-900 text-sm shadow-xs">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-emerald-800">College Showcase Ready — Complete System:</span>{" "}
            Fullstack student dropout prediction system with real-time AI risk evaluation, 
            MongoDB persistent storage, student progress tracking with trend comparisons, and 
            counsellor communication assistant.
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto px-4 space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
          <BrainCircuit className="w-4 h-4 text-blue-600" />
          AI-Powered Academic Early Warning & Intervention Platform
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Student Dropout Prediction System
        </h1>

        <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Early identification of at-risk students using explainable machine learning scoring across academic, attendance, engagement, and financial indicators.
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

      {/* 3 Core Analytical Pillars */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Key Analytical Pillars</h2>
          <p className="text-sm text-slate-500 mt-1">
            Core dimensions collected for dropout pattern recognition and intervention
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Academic Analysis */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs hover:border-blue-300 hover:shadow-sm transition">
            <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4 border border-blue-100">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Academic Analysis</h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Monitors cumulative grade point averages (CGPA), semester trajectory, internal marks, and active subject backlogs.
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
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs hover:border-indigo-300 hover:shadow-sm transition">
            <div className="w-12 h-12 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 border border-indigo-100">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Attendance Monitoring</h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Tracks physical lecture attendance percentage, missed class hours, and regular engagement with course assignments.
            </p>
            <ul className="text-xs text-slate-500 space-y-1.5 border-t border-slate-100 pt-3">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" />
                Threshold alerts below 75% attendance
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" />
                Assignment completion tracking
              </li>
            </ul>
          </div>

          {/* Card 3: Early Risk Detection */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs hover:border-amber-300 hover:shadow-sm transition">
            <div className="w-12 h-12 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-4 border border-amber-100">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Early Risk Detection</h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Consolidates multi-factor risk scores into actionable Low, Medium, and High risk classifications with specific advice.
            </p>
            <ul className="text-xs text-slate-500 space-y-1.5 border-t border-slate-100 pt-3">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
                Explainable risk factor highlights
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
                Actionable academic recommendations
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Feature Highlights: Progress & Counselling */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Student Progress Tracking</h3>
                <p className="text-xs text-slate-500">Continuous semester checkpoint comparisons</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 mb-3">
              Records follow-up checkpoints and automatically calculates progress status:
              <span className="inline-flex items-center gap-1 mx-1.5 font-medium text-emerald-700">🟢 Improving</span>,
              <span className="inline-flex items-center gap-1 mx-1.5 font-medium text-amber-700">🟡 Stable</span>, or
              <span className="inline-flex items-center gap-1 mx-1.5 font-medium text-rose-700">🔴 Declining</span>.
            </p>
          </div>

          <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Counsellor Communication System</h3>
                <p className="text-xs text-slate-500">Student ↔ Counsellor chat with AI suggestions</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 mb-3">
              Dedicated messaging channel between students and faculty counsellors with an AI Counselling Assistant that generates tailored supportive responses.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Strip */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
          <h3 className="text-base font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <BrainCircuit className="w-4 h-4 text-blue-600" />
            End-to-End System Workflow
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600">
            <div className="bg-white p-3 rounded-lg border border-slate-200">
              <span className="font-bold text-blue-600 block mb-1">Step 1: Intake & Storage</span>
              Student academic, attendance, and fee data is validated and permanently saved in MongoDB.
            </div>
            <div className="bg-white p-3 rounded-lg border border-slate-200">
              <span className="font-bold text-blue-600 block mb-1">Step 2: AI Risk Evaluation</span>
              The machine learning model assesses risk score, probability, and key contributing indicators.
            </div>
            <div className="bg-white p-3 rounded-lg border border-slate-200">
              <span className="font-bold text-blue-600 block mb-1">Step 3: Intervention & Tracking</span>
              Faculty counsellors review alerts on the dashboard, monitor progress trends, and provide guidance.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

