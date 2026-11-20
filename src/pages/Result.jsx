import React from "react";
import { Link } from "react-router-dom";
import { getLatestSubmission } from "../data/students";
import StudentCard from "../components/StudentCard";
import StudentPredictionCard from "../components/StudentPredictionCard";
import { 
  CheckCircle2, 
  ArrowRight, 
  PlusCircle, 
  LayoutDashboard, 
  AlertCircle,
  Database,
  Brain
} from "lucide-react";

export default function Result() {
  const student = getLatestSubmission();
  const studentIdentifier = student?._id || student?.studentId || student?.id;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Submission Success Alert Header */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-emerald-950">Student Data Evaluated Successfully</h1>
            <p className="text-xs text-emerald-800 mt-0.5">
              Record stored permanently in MongoDB and evaluated by the AI Dropout Prediction Engine.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/student-form"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-emerald-800 text-xs font-semibold rounded-lg border border-emerald-300 hover:bg-emerald-100 transition shadow-2xs"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            New Entry
          </Link>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 text-white text-xs font-semibold rounded-lg hover:bg-emerald-800 transition shadow-2xs"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            Dashboard
          </Link>
        </div>
      </div>

      {student ? (
        <>
          {/* Active AI Prediction Card */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Brain className="w-4 h-4 text-blue-600" />
                Live AI Risk Assessment Result
              </h2>
              {studentIdentifier && (
                <Link
                  to={`/students/${studentIdentifier}`}
                  className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
                >
                  <Database className="w-3.5 h-3.5" />
                  Open Student Details & Chat
                </Link>
              )}
            </div>
            <StudentPredictionCard student={student} />
          </section>

          {/* Submitted Student Profile */}
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
              Submitted Academic Profile
            </h2>
            <StudentCard student={student} />
          </section>

          {/* Quick Action Navigation */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500">
              Student ID: <strong className="text-slate-800 font-mono">{studentIdentifier}</strong>
            </span>
            <div className="flex items-center gap-2.5">
              <Link
                to="/student-form"
                className="px-4 py-2 text-xs font-medium rounded-lg text-slate-700 bg-slate-50 border border-slate-300 hover:bg-slate-100 transition"
              >
                Submit Another Student
              </Link>
              <Link
                to={`/students/${studentIdentifier}`}
                className="px-4 py-2 text-xs font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition shadow-xs"
              >
                Go to Counsellor Chat & Progress
              </Link>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
          <h2 className="text-lg font-semibold text-slate-800">No Student Submitted Yet</h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Please fill out the student intake form first to view the AI prediction report.
          </p>
          <Link
            to="/student-form"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition"
          >
            Open Student Form
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
