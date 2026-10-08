import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createStudent } from "../services/api";
import { saveStudent as saveLocalBackup } from "../data/students";
import { AlertCircle, ArrowLeft, Sparkles, CheckCircle2, Loader2 } from "lucide-react";

export default function StudentForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    studentId: "",
    name: "",
    age: "",
    gender: "Male",
    branch: "Computer Science",
    semester: "4th Semester",
    cgpa: "",
    previousCgpa: "",
    backlogs: "",
    internalMarks: "",
    attendance: "",
    assignmentCompletion: "",
    classesMissed: "",
    scholarship: "No",
    feeStatus: "Paid",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [serverSuccess, setServerSuccess] = useState("");

  const sampleStudents = [
    {
      studentId: "STU-2024-101",
      name: "Harsh Vardhan",
      age: "20",
      gender: "Male",
      branch: "Computer Science",
      semester: "4th Semester",
      cgpa: "6.2",
      previousCgpa: "6.5",
      backlogs: "2",
      internalMarks: "32",
      attendance: "68",
      assignmentCompletion: "65",
      classesMissed: "24",
      scholarship: "No",
      feeStatus: "Pending",
    },
    {
      studentId: "STU-2024-102",
      name: "Priyanka Sen",
      age: "19",
      gender: "Female",
      branch: "Information Technology",
      semester: "3rd Semester",
      cgpa: "8.9",
      previousCgpa: "8.7",
      backlogs: "0",
      internalMarks: "46",
      attendance: "94",
      assignmentCompletion: "95",
      classesMissed: "4",
      scholarship: "Yes",
      feeStatus: "Paid",
    },
  ];

  const handleFillSample = (index = 0) => {
    // Generate unique ID with random suffix to avoid duplicate key errors during repeated testing
    const sample = { ...sampleStudents[index] };
    sample.studentId = `STU-DEMO-${Math.floor(100 + Math.random() * 900)}`;
    setFormData(sample);
    setErrors({});
    setServerError("");
    setServerSuccess("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
    setServerError("");
  };

  const validate = () => {
    const errs = {};

    // 1. Personal Details
    if (!formData.studentId.trim()) errs.studentId = "Student ID is required";
    if (!formData.name.trim()) errs.name = "Student Name is required";
    if (!formData.age) {
      errs.age = "Age is required";
    } else if (Number(formData.age) < 15 || Number(formData.age) > 40) {
      errs.age = "Age must be between 15 and 40";
    }

    // 2. Academic Performance
    if (formData.cgpa === "" || formData.cgpa === undefined) {
      errs.cgpa = "Current CGPA is required";
    } else {
      const val = Number(formData.cgpa);
      if (isNaN(val) || val < 0 || val > 10) {
        errs.cgpa = "CGPA must be between 0.0 and 10.0";
      }
    }

    if (formData.previousCgpa === "" || formData.previousCgpa === undefined) {
      errs.previousCgpa = "Previous CGPA is required";
    } else {
      const val = Number(formData.previousCgpa);
      if (isNaN(val) || val < 0 || val > 10) {
        errs.previousCgpa = "Previous CGPA must be between 0.0 and 10.0";
      }
    }

    if (formData.backlogs === "" || formData.backlogs === undefined) {
      errs.backlogs = "Backlogs count is required";
    } else {
      const val = Number(formData.backlogs);
      if (isNaN(val) || val < 0 || !Number.isInteger(val)) {
        errs.backlogs = "Backlogs cannot be negative";
      }
    }

    if (formData.internalMarks === "" || formData.internalMarks === undefined) {
      errs.internalMarks = "Internal marks are required";
    } else {
      const val = Number(formData.internalMarks);
      if (isNaN(val) || val < 0 || val > 50) {
        errs.internalMarks = "Internal marks must be between 0 and 50";
      }
    }

    // 3. Attendance & Engagement
    if (formData.attendance === "" || formData.attendance === undefined) {
      errs.attendance = "Attendance percentage is required";
    } else {
      const val = Number(formData.attendance);
      if (isNaN(val) || val < 0 || val > 100) {
        errs.attendance = "Attendance must be between 0% and 100%";
      }
    }

    if (
      formData.assignmentCompletion === "" ||
      formData.assignmentCompletion === undefined
    ) {
      errs.assignmentCompletion = "Assignment completion percentage is required";
    } else {
      const val = Number(formData.assignmentCompletion);
      if (isNaN(val) || val < 0 || val > 100) {
        errs.assignmentCompletion = "Assignment completion must be between 0% and 100%";
      }
    }

    if (formData.classesMissed === "" || formData.classesMissed === undefined) {
      errs.classesMissed = "Classes missed is required";
    } else {
      const val = Number(formData.classesMissed);
      if (isNaN(val) || val < 0 || !Number.isInteger(val)) {
        errs.classesMissed = "Classes missed cannot be negative";
      }
    }

    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    setServerSuccess("");

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setIsSubmitting(true);

    const payload = {
      studentId: formData.studentId.trim(),
      name: formData.name.trim(),
      age: Number(formData.age),
      gender: formData.gender,
      branch: formData.branch,
      semester: formData.semester,
      cgpa: Number(formData.cgpa),
      previousCgpa: Number(formData.previousCgpa),
      backlogs: Number(formData.backlogs),
      internalMarks: Number(formData.internalMarks),
      attendance: Number(formData.attendance),
      assignmentCompletion: Number(formData.assignmentCompletion),
      classesMissed: Number(formData.classesMissed),
      scholarship: formData.scholarship,
      feeStatus: formData.feeStatus,
    };

    try {
      // POST /api/students via Axios
      const res = await createStudent(payload);

      if (res && res.success) {
        setServerSuccess("Student data saved successfully.");

        // Store latest submission for preview page
        const savedStudent = res.data;
        saveLocalBackup(savedStudent);

        // Redirect to result page after brief acknowledgment
        setTimeout(() => {
          navigate("/result");
        }, 1200);
      } else {
        setServerError("Unable to save student data. Please try again.");
      }
    } catch (err) {
      console.error("API submission error:", err);
      const backendMessage =
        err.response?.data?.message || "Unable to save student data. Please try again.";
      setServerError(backendMessage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <button
            onClick={() => navigate("/")}
            type="button"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Student Data Intake Form
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Submit academic, attendance, and administrative records directly to the database.
          </p>
        </div>

        {/* Demo fill button for presentation convenience */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => handleFillSample(0)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition"
            title="Auto-fills an at-risk student profile for testing"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            Fill Demo (At-Risk)
          </button>
          <button
            type="button"
            onClick={() => handleFillSample(1)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition"
            title="Auto-fills a regular student profile for testing"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            Fill Demo (Safe)
          </button>
        </div>
      </div>

      {/* Success Banner */}
      {serverSuccess && (
        <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm rounded-lg p-4 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div className="font-semibold">{serverSuccess}</div>
        </div>
      )}

      {/* Server Error Banner */}
      {serverError && (
        <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-800 text-sm rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold">{serverError}</div>
            <p className="text-xs text-rose-600 mt-0.5">
              Please check your values or verify that the backend server is reachable on port 5000.
            </p>
          </div>
        </div>
      )}

      {/* Validation alert banner if client errors exist */}
      {Object.keys(errors).length > 0 && (
        <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-800 text-sm rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold">Please correct the following issues:</div>
            <ul className="list-disc list-inside mt-1 text-xs space-y-0.5">
              {Object.values(errors).map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} noValidate className="space-y-8">
        {/* SECTION 1: Personal Details */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center gap-2.5 pb-4 mb-5 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
              1
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Personal Details</h2>
              <p className="text-xs text-slate-500">
                Primary student identification and enrollment metadata
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {/* Student ID */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Student ID <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="studentId"
                placeholder="e.g. STU-2024-042"
                value={formData.studentId}
                onChange={handleChange}
                className={`w-full px-3.5 py-2 rounded-lg text-sm border bg-white focus:outline-none focus:ring-2 transition ${
                  errors.studentId
                    ? "border-rose-300 focus:ring-rose-200 bg-rose-50/20"
                    : "border-slate-300 focus:ring-blue-100 focus:border-blue-500"
                }`}
              />
              {errors.studentId && (
                <p className="text-xs text-rose-600 mt-1">{errors.studentId}</p>
              )}
            </div>

            {/* Student Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Student Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                placeholder="e.g. Rahul Sharma"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-3.5 py-2 rounded-lg text-sm border bg-white focus:outline-none focus:ring-2 transition ${
                  errors.name
                    ? "border-rose-300 focus:ring-rose-200 bg-rose-50/20"
                    : "border-slate-300 focus:ring-blue-100 focus:border-blue-500"
                }`}
              />
              {errors.name && <p className="text-xs text-rose-600 mt-1">{errors.name}</p>}
            </div>

            {/* Age */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Age <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                name="age"
                placeholder="e.g. 20"
                value={formData.age}
                onChange={handleChange}
                className={`w-full px-3.5 py-2 rounded-lg text-sm border bg-white focus:outline-none focus:ring-2 transition ${
                  errors.age
                    ? "border-rose-300 focus:ring-rose-200 bg-rose-50/20"
                    : "border-slate-300 focus:ring-blue-100 focus:border-blue-500"
                }`}
              />
              {errors.age && <p className="text-xs text-rose-600 mt-1">{errors.age}</p>}
            </div>

            {/* Gender */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-lg text-sm border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Course / Branch */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Course / Branch
              </label>
              <select
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-lg text-sm border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
              >
                <option value="Computer Science">Computer Science</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Electronics & Communication">Electronics & Communication</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Electrical Engineering">Electrical Engineering</option>
                <option value="Civil Engineering">Civil Engineering</option>
                <option value="Data Science & AI">Data Science & AI</option>
              </select>
            </div>

            {/* Semester */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Semester</label>
              <select
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-lg text-sm border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
              >
                <option value="1st Semester">1st Semester</option>
                <option value="2nd Semester">2nd Semester</option>
                <option value="3rd Semester">3rd Semester</option>
                <option value="4th Semester">4th Semester</option>
                <option value="5th Semester">5th Semester</option>
                <option value="6th Semester">6th Semester</option>
                <option value="7th Semester">7th Semester</option>
                <option value="8th Semester">8th Semester</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 2: Academic Performance */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center gap-2.5 pb-4 mb-5 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
              2
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Academic Performance</h2>
              <p className="text-xs text-slate-500">
                Grade points, past semester performance, backlogs, and sessionals
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            {/* Current CGPA */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Current CGPA (0 - 10) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                name="cgpa"
                placeholder="e.g. 7.85"
                value={formData.cgpa}
                onChange={handleChange}
                className={`w-full px-3.5 py-2 rounded-lg text-sm border bg-white focus:outline-none focus:ring-2 transition ${
                  errors.cgpa
                    ? "border-rose-300 focus:ring-rose-200 bg-rose-50/20"
                    : "border-slate-300 focus:ring-blue-100 focus:border-blue-500"
                }`}
              />
              {errors.cgpa && <p className="text-xs text-rose-600 mt-1">{errors.cgpa}</p>}
            </div>

            {/* Prev CGPA */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Prev Sem CGPA (0 - 10) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                name="previousCgpa"
                placeholder="e.g. 7.50"
                value={formData.previousCgpa}
                onChange={handleChange}
                className={`w-full px-3.5 py-2 rounded-lg text-sm border bg-white focus:outline-none focus:ring-2 transition ${
                  errors.previousCgpa
                    ? "border-rose-300 focus:ring-rose-200 bg-rose-50/20"
                    : "border-slate-300 focus:ring-blue-100 focus:border-blue-500"
                }`}
              />
              {errors.previousCgpa && (
                <p className="text-xs text-rose-600 mt-1">{errors.previousCgpa}</p>
              )}
            </div>

            {/* Backlogs */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Active Backlogs <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="1"
                name="backlogs"
                placeholder="0"
                value={formData.backlogs}
                onChange={handleChange}
                className={`w-full px-3.5 py-2 rounded-lg text-sm border bg-white focus:outline-none focus:ring-2 transition ${
                  errors.backlogs
                    ? "border-rose-300 focus:ring-rose-200 bg-rose-50/20"
                    : "border-slate-300 focus:ring-blue-100 focus:border-blue-500"
                }`}
              />
              {errors.backlogs && <p className="text-xs text-rose-600 mt-1">{errors.backlogs}</p>}
            </div>

            {/* Internal Marks */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Internal Marks (Max 50) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                max="50"
                step="0.5"
                name="internalMarks"
                placeholder="e.g. 40"
                value={formData.internalMarks}
                onChange={handleChange}
                className={`w-full px-3.5 py-2 rounded-lg text-sm border bg-white focus:outline-none focus:ring-2 transition ${
                  errors.internalMarks
                    ? "border-rose-300 focus:ring-rose-200 bg-rose-50/20"
                    : "border-slate-300 focus:ring-blue-100 focus:border-blue-500"
                }`}
              />
              {errors.internalMarks && (
                <p className="text-xs text-rose-600 mt-1">{errors.internalMarks}</p>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 3: Attendance & Other Factors */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center gap-2.5 pb-4 mb-5 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-sm">
              3
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Attendance & Other Factors
              </h2>
              <p className="text-xs text-slate-500">
                Physical class engagement, coursework completion, and administrative standing
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mb-5">
            {/* Attendance % */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Attendance % (0 - 100) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  name="attendance"
                  placeholder="e.g. 85"
                  value={formData.attendance}
                  onChange={handleChange}
                  className={`w-full px-3.5 py-2 rounded-lg text-sm border bg-white focus:outline-none focus:ring-2 transition ${
                    errors.attendance
                      ? "border-rose-300 focus:ring-rose-200 bg-rose-50/20"
                    : "border-slate-300 focus:ring-blue-100 focus:border-blue-500"
                  }`}
                />
                <span className="absolute right-3 top-2 text-xs font-medium text-slate-400">
                  %
                </span>
              </div>
              {errors.attendance && (
                <p className="text-xs text-rose-600 mt-1">{errors.attendance}</p>
              )}
            </div>

            {/* Assignment Completion % */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Assignment Completion % (0 - 100) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  name="assignmentCompletion"
                  placeholder="e.g. 90"
                  value={formData.assignmentCompletion}
                  onChange={handleChange}
                  className={`w-full px-3.5 py-2 rounded-lg text-sm border bg-white focus:outline-none focus:ring-2 transition ${
                    errors.assignmentCompletion
                      ? "border-rose-300 focus:ring-rose-200 bg-rose-50/20"
                      : "border-slate-300 focus:ring-blue-100 focus:border-blue-500"
                  }`}
                />
                <span className="absolute right-3 top-2 text-xs font-medium text-slate-400">
                  %
                </span>
              </div>
              {errors.assignmentCompletion && (
                <p className="text-xs text-rose-600 mt-1">{errors.assignmentCompletion}</p>
              )}
            </div>

            {/* Classes Missed */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Classes Missed <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="1"
                name="classesMissed"
                placeholder="e.g. 8"
                value={formData.classesMissed}
                onChange={handleChange}
                className={`w-full px-3.5 py-2 rounded-lg text-sm border bg-white focus:outline-none focus:ring-2 transition ${
                  errors.classesMissed
                    ? "border-rose-300 focus:ring-rose-200 bg-rose-50/20"
                    : "border-slate-300 focus:ring-blue-100 focus:border-blue-500"
                }`}
              />
              {errors.classesMissed && (
                <p className="text-xs text-rose-600 mt-1">{errors.classesMissed}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-slate-100">
            {/* Scholarship */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Scholarship Beneficiary
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label
                  className={`flex items-center justify-center gap-2 p-2.5 rounded-lg border text-sm font-medium cursor-pointer transition ${
                    formData.scholarship === "Yes"
                      ? "bg-blue-50 border-blue-500 text-blue-700"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="scholarship"
                    value="Yes"
                    checked={formData.scholarship === "Yes"}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <span>Yes (Awarded)</span>
                </label>
                <label
                  className={`flex items-center justify-center gap-2 p-2.5 rounded-lg border text-sm font-medium cursor-pointer transition ${
                    formData.scholarship === "No"
                      ? "bg-blue-50 border-blue-500 text-blue-700"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="scholarship"
                    value="No"
                    checked={formData.scholarship === "No"}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <span>No Scholarship</span>
                </label>
              </div>
            </div>

            {/* Fee Status */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Tuition Fee Status
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label
                  className={`flex items-center justify-center gap-2 p-2.5 rounded-lg border text-sm font-medium cursor-pointer transition ${
                    formData.feeStatus === "Paid"
                      ? "bg-emerald-50 border-emerald-500 text-emerald-700"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="feeStatus"
                    value="Paid"
                    checked={formData.feeStatus === "Paid"}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <span>Paid (No Dues)</span>
                </label>
                <label
                  className={`flex items-center justify-center gap-2 p-2.5 rounded-lg border text-sm font-medium cursor-pointer transition ${
                    formData.feeStatus === "Pending"
                      ? "bg-amber-50 border-amber-500 text-amber-800"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="feeStatus"
                    value="Pending"
                    checked={formData.feeStatus === "Pending"}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <span>Pending / Due</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <p className="text-xs text-slate-500">
            <span className="font-semibold text-slate-700">Storage:</span> Data is sent to the
            Express REST API and saved permanently in MongoDB.
          </p>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm hover:shadow transition flex items-center justify-center gap-2 ${
              isSubmitting ? "opacity-75 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving to Database...
              </>
            ) : (
              "Submit Student Data"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
