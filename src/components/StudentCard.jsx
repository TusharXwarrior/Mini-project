import React from "react";
import { User, BookOpen, Clock, CheckCircle2 } from "lucide-react";

export default function StudentCard({ student }) {
  if (!student) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500">
        No student record found.
      </div>
    );
  }

  const studentIdentifier = student.studentId || student.id || student._id || "N/A";
  const prevCgpaValue =
    student.previousCgpa !== undefined ? student.previousCgpa : student.prevCgpa;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-5 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/30 text-blue-100 border border-blue-400/30 mb-1">
              ID: {studentIdentifier}
            </span>
            <h3 className="text-xl font-bold tracking-tight text-white">{student.name}</h3>
            <p className="text-sm text-blue-100">
              {student.branch} • {student.semester}
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-blue-100 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-xs self-start sm:self-center">
            <span>Age: {student.age}</span>
            <span>•</span>
            <span>Gender: {student.gender}</span>
          </div>
        </div>
      </div>

      {/* Grid of details */}
      <div className="p-6 divide-y divide-slate-100 space-y-6">
        {/* Academic Performance */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-600" />
            Academic Performance
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="text-xs text-slate-500 block">Current CGPA</span>
              <span className="text-lg font-bold text-slate-800">
                {student.cgpa !== undefined && student.cgpa !== null
                  ? Number(student.cgpa).toFixed(2)
                  : "N/A"}
              </span>
              <span className="text-xs text-slate-400 block mt-0.5">Scale: 0 - 10</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="text-xs text-slate-500 block">Prev. Sem CGPA</span>
              <span className="text-lg font-bold text-slate-800">
                {prevCgpaValue !== undefined && prevCgpaValue !== null
                  ? Number(prevCgpaValue).toFixed(2)
                  : "N/A"}
              </span>
              <span className="text-xs text-slate-400 block mt-0.5">Scale: 0 - 10</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="text-xs text-slate-500 block">Active Backlogs</span>
              <span
                className={`text-lg font-bold ${
                  Number(student.backlogs) > 0 ? "text-amber-600" : "text-emerald-600"
                }`}
              >
                {student.backlogs ?? 0}
              </span>
              <span className="text-xs text-slate-400 block mt-0.5">Subjects</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="text-xs text-slate-500 block">Internal Marks</span>
              <span className="text-lg font-bold text-slate-800">
                {student.internalMarks ?? "N/A"}
              </span>
              <span className="text-xs text-slate-400 block mt-0.5">Max: 50</span>
            </div>
          </div>
        </div>

        {/* Attendance & Engagement */}
        <div className="pt-6">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-600" />
            Attendance & Engagement
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-100">
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-xs text-slate-500">Attendance</span>
                <span
                  className={`text-sm font-semibold ${
                    Number(student.attendance) >= 75 ? "text-emerald-600" : "text-rose-600"
                  }`}
                >
                  {student.attendance}%
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-2 rounded-full ${
                    Number(student.attendance) >= 75 ? "bg-emerald-500" : "bg-rose-500"
                  }`}
                  style={{ width: `${Math.min(100, Math.max(0, Number(student.attendance)))}%` }}
                />
              </div>
              <span className="text-[11px] text-slate-400 block mt-1">
                {Number(student.attendance) >= 75 ? "Satisfactory" : "Below 75% minimum requirement"}
              </span>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-100">
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-xs text-slate-500">Assignment Completion</span>
                <span className="text-sm font-semibold text-slate-800">
                  {student.assignmentCompletion}%
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-indigo-500 h-2 rounded-full"
                  style={{
                    width: `${Math.min(100, Math.max(0, Number(student.assignmentCompletion)))}%`,
                  }}
                />
              </div>
              <span className="text-[11px] text-slate-400 block mt-1">Coursework assignments</span>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-100">
              <span className="text-xs text-slate-500 block">Classes Missed</span>
              <span className="text-lg font-bold text-slate-800">{student.classesMissed ?? 0}</span>
              <span className="text-xs text-slate-400 block mt-0.5">Total sessions absent</span>
            </div>
          </div>
        </div>

        {/* Financial & Administration */}
        <div className="pt-6">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
            <User className="w-4 h-4 text-slate-500" />
            Financial & Support Details
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 block">Scholarship</span>
                <span className="text-sm font-medium text-slate-800">
                  {student.scholarship || "No"}
                </span>
              </div>
              {student.scholarship === "Yes" ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              ) : (
                <span className="text-xs text-slate-400">Not Awarded</span>
              )}
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 block">Fee Status</span>
                <span
                  className={`text-sm font-semibold ${
                    student.feeStatus === "Paid" ? "text-emerald-700" : "text-amber-700"
                  }`}
                >
                  {student.feeStatus || "Pending"}
                </span>
              </div>
              {student.feeStatus === "Paid" ? (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                  Cleared
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                  Due
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
