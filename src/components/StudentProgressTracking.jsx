import React, { useState, useEffect, useCallback } from "react";
import {
  getProgressComparison,
  recordStudentProgress,
} from "../services/api";
import {
  TrendingUp,
  Calendar,
  PlusCircle,
  FileText,
  Heart,
  Loader2,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";

export default function StudentProgressTracking({ student, onProgressUpdated }) {
  const studentId = student?.studentId || student?.id;

  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New checkpoint form state with lazy initializer
  const [formData, setFormData] = useState(() => {
    const twoWeeksLater = new Date();
    twoWeeksLater.setDate(twoWeeksLater.getDate() + 14);
    return {
      checkpointTitle: "Mid-Semester Progress Evaluation",
      attendance: student?.attendance || 75,
      cgpa: student?.cgpa || 7.0,
      assignmentCompletion: student?.assignmentCompletion || 80,
      backlogs: student?.backlogs || 0,
      wellbeingStatus: "Good",
      counsellorRemarks: "Attended remedial session; engaged actively with coursework.",
      actionPlan: "Submit pending assignments by Friday and maintain attendance above 80%.",
      followUpDate: twoWeeksLater.toISOString().split("T")[0],
    };
  });

  const loadComparison = useCallback(async () => {
    if (!studentId) return;
    setLoading(true);
    try {
      const res = await getProgressComparison(studentId);
      if (res && res.success) {
        setComparisonData(res.data);
      }
    } catch (err) {
      console.error("Error loading progress comparison:", err);
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    let isCancelled = false;
    const initLoad = async () => {
      if (!studentId) return;
      try {
        const res = await getProgressComparison(studentId);
        if (!isCancelled && res && res.success) {
          setComparisonData(res.data);
        }
      } catch (err) {
        if (!isCancelled) console.error("Error loading progress comparison:", err);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    };
    initLoad();
    return () => {
      isCancelled = true;
    };
  }, [studentId]);

  const handleRecordCheckpoint = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await recordStudentProgress(studentId, formData);
      if (res && res.success) {
        setShowModal(false);
        await loadComparison();
        if (onProgressUpdated) onProgressUpdated();
      }
    } catch (err) {
      console.error("Error recording checkpoint:", err);
      alert("Failed to save progress checkpoint.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStatusBadge = (status) => {
    if (status === "Improving") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          Improving
        </span>
      );
    }
    if (status === "Declining") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
          <span className="w-2 h-2 rounded-full bg-rose-500" />
          Declining
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
        <span className="w-2 h-2 rounded-full bg-amber-500" />
        Stable
      </span>
    );
  };

  const getWellbeingBadge = (wellbeing) => {
    switch (wellbeing) {
      case "Good":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Moderate":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Needs Attention":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Critical":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Controls */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-900">
              Student Progress Tracking
            </h3>
            {comparisonData?.overallTrend && (
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                  comparisonData.overallTrend === "Improving"
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                    : comparisonData.overallTrend === "Declining"
                    ? "bg-rose-50 text-rose-800 border-rose-200"
                    : "bg-amber-50 text-amber-800 border-amber-200"
                }`}
              >
                Overall Trend: {comparisonData.overallTrend}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Automatic comparison between previous and current academic standing with counsellor
            action plan.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={loadComparison}
            type="button"
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
            title="Refresh comparison"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            Record Checkpoint
          </button>
        </div>
      </div>

      {/* Automatic Progress Comparison Table (Exact User Requirement) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:px-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <h4 className="text-sm font-bold text-slate-900">
              Automatic Progress Comparison
            </h4>
          </div>
          <span className="text-xs text-slate-400">
            System automatically calculates: 🟢 Improving • 🟡 Stable • 🔴 Declining
          </span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-600 mb-2" />
            <p className="text-xs">Computing comparison metrics...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/70 text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th scope="col" className="py-3 px-6">Parameter</th>
                  <th scope="col" className="py-3 px-6">Previous</th>
                  <th scope="col" className="py-3 px-6">Current</th>
                  <th scope="col" className="py-3 px-6 text-center">Calculated Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {comparisonData?.comparison?.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition">
                    <td className="py-4 px-6 font-semibold text-slate-800">
                      {row.parameter}
                    </td>
                    <td className="py-4 px-6 text-slate-600 font-mono text-sm">
                      {row.previous}
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-900 font-mono text-sm">
                      {row.current}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {renderStatusBadge(row.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Progress Cards: Wellbeing, Counsellor Remarks, Action Plan, Follow-up Date */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Wellbeing Status */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-rose-500" />
              Wellbeing Status
            </span>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${getWellbeingBadge(
                comparisonData?.wellbeingStatus
              )}`}
            >
              {comparisonData?.wellbeingStatus || "Good"}
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Emotional & stress index monitored through student check-in sessions.
          </p>
        </div>

        {/* Counsellor Remarks */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-blue-600" />
            Counsellor Remarks
          </span>
          <p className="text-xs text-slate-700 leading-relaxed font-medium bg-slate-50 p-2.5 rounded-lg border border-slate-100">
            "{comparisonData?.counsellorRemarks || "Consistent active monitoring."}"
          </p>
        </div>

        {/* Action Plan & Follow-Up */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-indigo-600" />
              Next Follow-Up
            </span>
            <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
              {comparisonData?.followUpDate
                ? new Date(comparisonData.followUpDate).toLocaleDateString()
                : "Scheduled Soon"}
            </span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
            <strong className="block text-slate-800 text-[11px] mb-0.5">Action Plan:</strong>
            {comparisonData?.actionPlan || "Attend remedial sessions and submit lab reports."}
          </p>
        </div>
      </div>

      {/* Record Progress Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full border border-slate-200 overflow-hidden">
            <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h4 className="text-base font-bold text-slate-900">
                  Record Student Progress Checkpoint
                </h4>
                <p className="text-xs text-slate-500">
                  Update academic parameters and calculate new improvement metrics.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleRecordCheckpoint} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Checkpoint Title
                </label>
                <input
                  type="text"
                  value={formData.checkpointTitle}
                  onChange={(e) =>
                    setFormData({ ...formData, checkpointTitle: e.target.value })
                  }
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Attendance (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.attendance}
                    onChange={(e) =>
                      setFormData({ ...formData, attendance: e.target.value })
                    }
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Current CGPA (0-10)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    value={formData.cgpa}
                    onChange={(e) =>
                      setFormData({ ...formData, cgpa: e.target.value })
                    }
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Assignments (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.assignmentCompletion}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        assignmentCompletion: e.target.value,
                      })
                    }
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Active Backlogs
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.backlogs}
                    onChange={(e) =>
                      setFormData({ ...formData, backlogs: e.target.value })
                    }
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Wellbeing Status
                  </label>
                  <select
                    value={formData.wellbeingStatus}
                    onChange={(e) =>
                      setFormData({ ...formData, wellbeingStatus: e.target.value })
                    }
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="Good">Good</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Needs Attention">Needs Attention</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Follow-Up Date
                  </label>
                  <input
                    type="date"
                    value={formData.followUpDate}
                    onChange={(e) =>
                      setFormData({ ...formData, followUpDate: e.target.value })
                    }
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Counsellor Remarks
                </label>
                <textarea
                  rows="2"
                  value={formData.counsellorRemarks}
                  onChange={(e) =>
                    setFormData({ ...formData, counsellorRemarks: e.target.value })
                  }
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300"
                  placeholder="Notes on student mindset, motivation, or obstacles..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Action Plan
                </label>
                <textarea
                  rows="2"
                  value={formData.actionPlan}
                  onChange={(e) =>
                    setFormData({ ...formData, actionPlan: e.target.value })
                  }
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300"
                  placeholder="Specific tasks agreed upon for the next review..."
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs flex items-center gap-1.5"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  )}
                  Save Checkpoint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
