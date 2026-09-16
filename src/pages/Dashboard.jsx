import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { getStoredStudents } from "../data/students";
import { 
  Users, 
  UserCheck, 
  Sparkles, 
  Search, 
  UserPlus 
} from "lucide-react";

export default function Dashboard() {
  const [students] = useState(() => getStoredStudents());
  const [searchTerm, setSearchTerm] = useState("");
  const [branchFilter, setBranchFilter] = useState("All");

  const branches = useMemo(() => {
    const unique = new Set(students.map((s) => s.branch));
    return ["All", ...Array.from(unique)];
  }, [students]);

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesBranch = branchFilter === "All" || student.branch === branchFilter;
      return matchesSearch && matchesBranch;
    });
  }, [students, searchTerm, branchFilter]);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 mb-2">
            Institutional Analytics
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Student Monitoring Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Overview of student academic records, attendance standing, and intake status.
          </p>
        </div>

        <Link
          to="/student-form"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          Add Student Record
        </Link>
      </div>

      {/* 3 Metric Cards (Exact Prompt Requirement) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Card 1: Total Students */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Students
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">25</span>
            <span className="text-xs text-slate-400 font-medium">Enrolled batch</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Cohort size monitored across active engineering departments.
          </p>
        </div>

        {/* Card 2: Students Registered */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Students Registered
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">18</span>
            <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-1.5 py-0.5 rounded">
              72% complete
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Profiles with completed academic and attendance submissions.
          </p>
        </div>

        {/* Card 3: Prediction Status */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Prediction Status
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-700">Coming Soon</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Machine Learning inference pipeline will be hooked in Part 2.
          </p>
        </div>
      </div>

      {/* Student Records Table Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Table Top Controls & Fictional Data Disclaimer */}
        <div className="p-4 sm:p-6 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">Registered Student Records</h2>
              <span className="px-2 py-0.5 text-[11px] font-medium bg-slate-100 text-slate-600 rounded-md border border-slate-200">
                Demo / Fictional Data
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Showing {filteredStudents.length} of {students.length} demo student profiles
            </p>
          </div>

          {/* Search & Branch Filter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-60 pl-9 pr-3.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
              />
            </div>

            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-slate-700"
            >
              {branches.map((b) => (
                <option key={b} value={b}>
                  {b === "All" ? "All Branches" : b}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table Required Columns: Student ID | Name | Branch | Semester | Attendance | CGPA */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th scope="col" className="py-3 px-4 sm:px-6">Student ID</th>
                <th scope="col" className="py-3 px-4">Name</th>
                <th scope="col" className="py-3 px-4">Branch</th>
                <th scope="col" className="py-3 px-4">Semester</th>
                <th scope="col" className="py-3 px-4">Attendance</th>
                <th scope="col" className="py-3 px-4">CGPA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => {
                  const att = Number(student.attendance);
                  const cgpa = Number(student.cgpa);

                  return (
                    <tr
                      key={student.id}
                      className="hover:bg-slate-50/80 transition group"
                    >
                      <td className="py-3.5 px-4 sm:px-6 font-mono text-xs font-semibold text-blue-700 whitespace-nowrap">
                        {student.id}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-900 whitespace-nowrap">
                        {student.name}
                        {student.scholarship === "Yes" && (
                          <span className="ml-2 inline-block px-1.5 py-0.5 text-[10px] font-medium bg-blue-50 text-blue-600 rounded">
                            Scholar
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-600 whitespace-nowrap">
                        {student.branch}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-600 whitespace-nowrap">
                        {student.semester}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-semibold ${
                              att >= 75 ? "text-emerald-700" : "text-rose-700"
                            }`}
                          >
                            {att}%
                          </span>
                          <span
                            className={`inline-block w-2 h-2 rounded-full ${
                              att >= 75 ? "bg-emerald-500" : "bg-rose-500"
                            }`}
                          />
                        </div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded text-xs font-bold ${
                            cgpa >= 8.0
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : cgpa >= 6.5
                              ? "bg-blue-50 text-blue-700 border border-blue-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          {cgpa.toFixed(2)}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                    No student records matching your query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <span>Data source: Simulated College Dataset (Part 1 Showcase)</span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Attendance &ge; 75%
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              Attendance &lt; 75%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
