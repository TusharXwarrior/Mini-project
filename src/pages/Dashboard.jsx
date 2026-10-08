import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getStudents, deleteStudent, createStudent } from "../services/api";
import { initialStudents } from "../data/students";
import {
  Users,
  UserCheck,
  Sparkles,
  Search,
  UserPlus,
  Loader2,
  AlertCircle,
  Database,
  ExternalLink,
  Trash2,
  RefreshCw,
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [branchFilter, setBranchFilter] = useState("All");
  const [isSeeding, setIsSeeding] = useState(false);
  const [actionMessage, setActionMessage] = useState("");

  const fetchStudentsList = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getStudents();
      if (response && response.success) {
        setStudents(response.data || []);
      } else {
        setError("Failed to retrieve students from database.");
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError(
        err.response?.data?.message ||
          "Could not connect to Express backend. Please ensure the server is running on port 5000."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    const initFetch = async () => {
      try {
        const response = await getStudents();
        if (!ignore) {
          if (response && response.success) {
            setStudents(response.data || []);
          } else {
            setError("Failed to retrieve students from database.");
          }
        }
      } catch (err) {
        if (!ignore) {
          setError(
            err.response?.data?.message ||
              "Could not connect to Express backend. Please ensure the server is running on port 5000."
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    initFetch();

    return () => {
      ignore = true;
    };
  }, []);

  // Handle single student deletion
  const handleDeleteStudent = async (student, e) => {
    e.stopPropagation();
    const identifier = student._id || student.studentId;
    if (
      !window.confirm(
        `Are you sure you want to delete student "${student.name}" (${student.studentId})?`
      )
    ) {
      return;
    }

    try {
      await deleteStudent(identifier);
      setActionMessage(`Student "${student.name}" deleted successfully.`);
      setTimeout(() => setActionMessage(""), 4000);
      setStudents((prev) =>
        prev.filter((s) => (s._id || s.studentId) !== identifier)
      );
    } catch (err) {
      console.error("Delete error:", err);
      alert(
        err.response?.data?.message ||
          "Failed to delete student. Please try again."
      );
    }
  };

  // Seed demo students into MongoDB for demonstration showcase
  const handleSeedDemoData = async () => {
    setIsSeeding(true);
    setActionMessage("");
    try {
      for (const item of initialStudents) {
        try {
          await createStudent({
            studentId: item.id,
            name: item.name,
            age: item.age,
            gender: item.gender,
            branch: item.branch,
            semester: item.semester,
            cgpa: item.cgpa,
            previousCgpa: item.prevCgpa,
            backlogs: item.backlogs,
            internalMarks: item.internalMarks,
            attendance: item.attendance,
            assignmentCompletion: item.assignmentCompletion,
            classesMissed: item.classesMissed,
            scholarship: item.scholarship,
            feeStatus: item.feeStatus,
          });
        } catch {
          // ignore duplicate if already present
        }
      }
      setActionMessage("Demo students successfully seeded into MongoDB!");
      setTimeout(() => setActionMessage(""), 5000);
      await fetchStudentsList();
    } catch (err) {
      console.error("Seeding error:", err);
      alert("Error seeding demo students.");
    } finally {
      setIsSeeding(false);
    }
  };

  const branches = useMemo(() => {
    const unique = new Set(students.map((s) => s.branch).filter(Boolean));
    return ["All", ...Array.from(unique)];
  }, [students]);

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const studentId = (student.studentId || student.id || "").toLowerCase();
      const studentName = (student.name || "").toLowerCase();
      const term = searchTerm.toLowerCase();

      const matchesSearch = studentName.includes(term) || studentId.includes(term);
      const matchesBranch =
        branchFilter === "All" || student.branch === branchFilter;

      return matchesSearch && matchesBranch;
    });
  }, [students, searchTerm, branchFilter]);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 mb-2">
            <Database className="w-3.5 h-3.5 text-blue-600" />
            MongoDB Live Database Integration (Part 2)
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Student Monitoring Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Real-time student academic records and attendance directly from MongoDB.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            onClick={fetchStudentsList}
            disabled={loading}
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 transition"
            title="Refresh student list"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <Link
            to="/student-form"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition"
          >
            <UserPlus className="w-4 h-4" />
            Add Student
          </Link>
        </div>
      </div>

      {/* Action Notification Banner */}
      {actionMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm rounded-lg p-3.5 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* 3 Metric Cards (Real MongoDB values) */}
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
            <span className="text-3xl font-extrabold text-slate-900">
              {loading ? "..." : students.length}
            </span>
            <span className="text-xs text-slate-400 font-medium">in MongoDB</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Live count of persisted student records stored in database.
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
            <span className="text-3xl font-extrabold text-slate-900">
              {loading ? "..." : students.length}
            </span>
            <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-1.5 py-0.5 rounded">
              Verified
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Validated profiles with academic & attendance tracking.
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
            Machine Learning model will be connected in Part 3.
          </p>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-5 text-rose-800 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-sm">Failed to connect to Backend API</h4>
              <p className="text-xs mt-1 text-rose-700">{error}</p>
            </div>
          </div>
          <button
            onClick={fetchStudentsList}
            type="button"
            className="px-3 py-1.5 bg-rose-600 text-white text-xs font-medium rounded-lg hover:bg-rose-700 transition shrink-0"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Student Records Table Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Table Controls */}
        <div className="p-4 sm:p-6 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">Student Database Records</h2>
              <span className="px-2 py-0.5 text-[11px] font-medium bg-emerald-50 text-emerald-700 rounded-md border border-emerald-200">
                Live MongoDB
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Showing {filteredStudents.length} of {students.length} students stored in database
            </p>
          </div>

          {/* Search, Filter, & Demo Seeder */}
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

            {students.length === 0 && !loading && (
              <button
                type="button"
                onClick={handleSeedDemoData}
                disabled={isSeeding}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 transition whitespace-nowrap"
              >
                {isSeeding ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                )}
                Seed Demo Dataset
              </button>
            )}
          </div>
        </div>

        {/* Table Body */}
        {loading ? (
          <div className="py-16 text-center">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
            <p className="text-xs text-slate-500">Loading student records from MongoDB...</p>
          </div>
        ) : filteredStudents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th scope="col" className="py-3 px-4 sm:px-6">Student ID</th>
                  <th scope="col" className="py-3 px-4">Student Name</th>
                  <th scope="col" className="py-3 px-4">Branch</th>
                  <th scope="col" className="py-3 px-4">Semester</th>
                  <th scope="col" className="py-3 px-4">CGPA</th>
                  <th scope="col" className="py-3 px-4">Attendance</th>
                  <th scope="col" className="py-3 px-4">Backlogs</th>
                  <th scope="col" className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((student) => {
                  const att = Number(student.attendance);
                  const cgpa = Number(student.cgpa);
                  const backlogs = Number(student.backlogs || 0);
                  const studentIdentifier = student.studentId || student.id;
                  const recordKey = student._id || studentIdentifier;

                  return (
                    <tr
                      key={recordKey}
                      onClick={() =>
                        navigate(`/students/${student._id || studentIdentifier}`)
                      }
                      className="hover:bg-slate-50/80 transition cursor-pointer group"
                    >
                      {/* Student ID */}
                      <td className="py-3.5 px-4 sm:px-6 font-mono text-xs font-semibold text-blue-700 whitespace-nowrap">
                        {studentIdentifier}
                      </td>

                      {/* Student Name */}
                      <td className="py-3.5 px-4 font-medium text-slate-900 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span>{student.name}</span>
                          {student.scholarship === "Yes" && (
                            <span className="inline-block px-1.5 py-0.5 text-[10px] font-medium bg-blue-50 text-blue-600 rounded">
                              Scholar
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Branch */}
                      <td className="py-3.5 px-4 text-xs text-slate-600 whitespace-nowrap">
                        {student.branch}
                      </td>

                      {/* Semester */}
                      <td className="py-3.5 px-4 text-xs text-slate-600 whitespace-nowrap">
                        {student.semester}
                      </td>

                      {/* CGPA */}
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

                      {/* Attendance */}
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

                      {/* Backlogs */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`text-xs font-semibold ${
                            backlogs > 0 ? "text-amber-600 font-bold" : "text-slate-600"
                          }`}
                        >
                          {backlogs}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/students/${student._id || studentIdentifier}`);
                            }}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded transition"
                            title="View student profile"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => handleDeleteStudent(student, e)}
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded transition"
                            title="Delete student from MongoDB"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 px-4 text-center space-y-3">
            <Database className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-semibold text-slate-700">
              No Student Records in MongoDB Yet
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Submit a new student profile through the intake form or load the initial demo dataset
              to populate the database.
            </p>
            <div className="pt-2 flex items-center justify-center gap-3">
              <Link
                to="/student-form"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Add Student
              </Link>
              <button
                type="button"
                onClick={handleSeedDemoData}
                disabled={isSeeding}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition"
              >
                {isSeeding ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                )}
                Seed Demo Dataset
              </button>
            </div>
          </div>
        )}

        {/* Table Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <span>Backend API: Express / MongoDB Server (Port 5000)</span>
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
