import React from "react";
import { Link } from "react-router-dom";
import { getLatestSubmission } from "../data/students";
import StudentCard from "../components/StudentCard";
import { 
  CheckCircle2, 
  Cpu, 
  ArrowRight, 
  PlusCircle, 
  LayoutDashboard, 
  AlertCircle,
  Database
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
            <h1 className="text-xl font-bold text-emerald-950">Student Information Submitted</h1>
            <p className="text-xs text-emerald-800 mt-0.5">
              Data successfully collected and saved to MongoDB for the predictive evaluation pipeline.
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

      {/* Submitted Student Card Display */}
      {student ? (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
              Submitted Profile Overview
            </h2>
            <div className="flex items-center gap-3">
              {studentIdentifier && (
                <Link
                  to={`/students/${studentIdentifier}`}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                >
                  <Database className="w-3 h-3" />
                  View in MongoDB
                </Link>
              )}
              <span className="text-xs text-slate-400">
                Recorded:{" "}
                {student.createdAt || student.submittedAt
                  ? new Date(student.createdAt || student.submittedAt).toLocaleTimeString()
                  : "Recent"}
              </span>
            </div>
          </div>
          <StudentCard student={student} />
        </section>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
          <h2 className="text-lg font-semibold text-slate-800">No Student Submitted Yet</h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Please fill out the student intake form first to view the submitted record preview.
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

      {/* AI Prediction Placeholder Section (Requirement 4 & 6) */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">AI Prediction</h2>
              <p className="text-xs text-slate-500">
                Machine Learning risk classification & inference engine
              </p>
            </div>
          </div>

          {/* Prompt Required Badge: "ML Model: Not Connected" */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
              AI Prediction: Coming Soon
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              ML Model: Not Connected
            </span>
          </div>
        </div>

        {/* Prompt Required Message */}
        <div className="mt-6 text-center py-8 px-4 bg-slate-50 rounded-lg border border-dashed border-slate-200 space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-200/70 text-slate-500 flex items-center justify-center mx-auto">
            <Cpu className="w-6 h-6" />
          </div>
          <p className="text-base sm:text-lg font-medium text-slate-700 max-w-lg mx-auto">
            Prediction will appear here after connecting the Machine Learning model.
          </p>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            Student records are now permanently recorded in MongoDB through the Express backend. In
            Part 3, the Machine Learning prediction algorithm will evaluate these attributes and
            output the dropout risk classification.
          </p>
        </div>

        {/* Action Controls */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-end gap-3">
          <Link
            to="/student-form"
            className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium rounded-lg text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition text-center"
          >
            Submit Another Student
          </Link>
          <Link
            to="/dashboard"
            className="w-full sm:w-auto px-5 py-2.5 text-sm font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition text-center shadow-xs"
          >
            View Dashboard
          </Link>
        </div>
      </section>
    </div>
  );
}
