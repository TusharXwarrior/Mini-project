import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getStudentById, deleteStudent } from "../services/api";
import StudentCard from "../components/StudentCard";
import StudentConversation from "../components/StudentConversation";
import StudentProgressTracking from "../components/StudentProgressTracking";
import {
  ArrowLeft,
  Cpu,
  Trash2,
  AlertCircle,
  Loader2,
  LayoutDashboard,
  Calendar,
  MessageSquare,
  TrendingUp,
  UserCheck,
} from "lucide-react";

export default function StudentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState("progress"); // "progress", "conversation", "profile"

  const fetchStudent = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getStudentById(id);
      if (response && response.success) {
        setStudent(response.data);
      } else {
        setError(response.message || "Failed to load student details.");
      }
    } catch (err) {
      console.error("Error fetching student details:", err);
      setError(
        err.response?.data?.message ||
          "Unable to load student information from the server."
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    let ignore = false;
    const loadData = async () => {
      try {
        const response = await getStudentById(id);
        if (!ignore) {
          if (response && response.success) {
            setStudent(response.data);
          } else {
            setError(response.message || "Failed to load student details.");
          }
        }
      } catch (err) {
        if (!ignore) {
          setError(
            err.response?.data?.message ||
              "Unable to load student information from the server."
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };
    loadData();
    return () => {
      ignore = true;
    };
  }, [id]);

  const handleDelete = async () => {
    if (
      !window.confirm(
        `Are you sure you want to delete student "${student?.name}" (${student?.studentId}) from MongoDB? All associated conversation and progress records will be permanently deleted.`
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      const deleteIdentifier = student?._id || student?.studentId || id;
      await deleteStudent(deleteIdentifier);
      navigate("/dashboard");
    } catch (err) {
      console.error("Error deleting student:", err);
      alert(
        err.response?.data?.message ||
          "Failed to delete student record. Please try again."
      );
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
        <p className="text-sm text-slate-500">Fetching student record from MongoDB...</p>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center space-y-4">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
          <h2 className="text-xl font-bold text-slate-800">Student Record Not Found</h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            {error || `No record exists for student identifier "${id}".`}
          </p>
          <div className="pt-2">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition"
            >
              <LayoutDashboard className="w-4 h-4" />
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Top Navigation & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => navigate("/dashboard")}
            type="button"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </button>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              {student.name}
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-mono font-medium">
              {student.studentId}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            Registered on:{" "}
            {student.createdAt
              ? new Date(student.createdAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "Recent"}{" "}
            • {student.branch} • {student.semester}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            type="button"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition"
            title="Deletes student and purges associated conversations & progress records"
          >
            {isDeleting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Trash2 className="w-3.5 h-3.5" />
            )}
            Delete Student
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 space-x-1 sm:space-x-3 text-xs sm:text-sm font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab("progress")}
          className={`flex items-center gap-2 py-3 px-3.5 border-b-2 transition ${
            activeTab === "progress"
              ? "border-blue-600 text-blue-700"
              : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Progress & Auto Comparison
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("conversation")}
          className={`flex items-center gap-2 py-3 px-3.5 border-b-2 transition ${
            activeTab === "conversation"
              ? "border-blue-600 text-blue-700"
              : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          Student ↔ Counsellor Chat
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("profile")}
          className={`flex items-center gap-2 py-3 px-3.5 border-b-2 transition ${
            activeTab === "profile"
              ? "border-blue-600 text-blue-700"
              : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
          }`}
        >
          <UserCheck className="w-4 h-4" />
          Academic Profile Card
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === "progress" && (
        <section className="space-y-6">
          <StudentProgressTracking
            student={student}
            onProgressUpdated={fetchStudent}
          />
        </section>
      )}

      {activeTab === "conversation" && (
        <section className="space-y-6">
          <StudentConversation student={student} />
        </section>
      )}

      {activeTab === "profile" && (
        <section className="space-y-6">
          <StudentCard student={student} />
        </section>
      )}

      {/* AI Prediction Placeholder Notice */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                AI Prediction Status
              </h2>
              <p className="text-xs text-slate-500">
                Machine Learning risk classification & inference engine
              </p>
            </div>
          </div>

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

        <div className="mt-4 text-center py-6 px-4 bg-slate-50 rounded-lg border border-dashed border-slate-200 space-y-2">
          <p className="text-sm font-medium text-slate-700 max-w-lg mx-auto">
            Prediction will appear here after connecting the Machine Learning model.
          </p>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            All student parameters, conversations, and progress checkpoints are permanently
            stored in MongoDB. The classification algorithm will evaluate these attributes and
            output dropout risk categories in the ML phase.
          </p>
        </div>
      </section>
    </div>
  );
}
