import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getStudentById, deleteStudent, getStudentPrediction, getModelStatus } from "../services/api";
import StudentCard from "../components/StudentCard";
import { ArrowLeft, Cpu, Trash2, AlertCircle, Loader2, LayoutDashboard, Calendar, RefreshCw, TrendingUp, ShieldAlert, MessageCircle } from "lucide-react";

export default function StudentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [modelStatus, setModelStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [predicting, setPredicting] = useState(false);
  const [error, setError] = useState("");
  const [predictionError, setPredictionError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const loadPrediction = async (identifier) => {
    setPredicting(true); setPredictionError("");
    try {
      const [status, result] = await Promise.all([getModelStatus(), getStudentPrediction(identifier)]);
      setModelStatus(status); setPrediction(result.prediction);
    } catch (err) {
      setPrediction(null);
      setPredictionError(err.response?.data?.message || err.response?.data?.detail || "ML model is not available yet. Configure and start the Python ML service.");
    } finally { setPredicting(false); }
  };

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const response = await getStudentById(id);
        if (!active) return;
        if (!response?.success) throw new Error(response?.message || "Student not found.");
        setStudent(response.data);
        loadPrediction(response.data._id || id);
      } catch (err) { if (active) setError(err.response?.data?.message || err.message || "Unable to load student."); }
      finally { if (active) setLoading(false); }
    })();
    return () => { active = false; };
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${student?.name}" and all linked records?`)) return;
    setIsDeleting(true);
    try { await deleteStudent(student?._id || student?.studentId || id); navigate("/dashboard"); }
    catch (err) { alert(err.response?.data?.message || "Failed to delete student."); setIsDeleting(false); }
  };

  if (loading) return <div className="max-w-4xl mx-auto py-16 px-4 text-center"><Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3"/><p className="text-sm text-slate-500">Loading student profile…</p></div>;
  if (error || !student) return <div className="max-w-4xl mx-auto py-12 px-4 text-center bg-white rounded-xl border"><AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3"/><h2 className="text-xl font-bold">Student record unavailable</h2><p className="text-sm text-slate-500 mt-2">{error}</p><Link to="/dashboard" className="inline-flex mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg">Back to Dashboard</Link></div>;

  const riskColor = prediction?.riskLevel === "High" ? "bg-rose-50 text-rose-700 border-rose-200" : prediction?.riskLevel === "Medium" ? "bg-amber-50 text-amber-800 border-amber-200" : "bg-emerald-50 text-emerald-700 border-emerald-200";

  return <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-7">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div><button onClick={() => navigate("/dashboard")} className="inline-flex items-center gap-1.5 text-xs text-slate-500 mb-2"><ArrowLeft className="w-3.5 h-3.5"/>Back to Dashboard</button><div className="flex items-center gap-2"><h1 className="text-2xl sm:text-3xl font-bold">Student Details</h1><span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-mono">{student.studentId}</span></div><p className="text-xs text-slate-500 mt-1 flex items-center gap-1"><Calendar className="w-3.5 h-3.5"/>Registered {student.createdAt ? new Date(student.createdAt).toLocaleDateString() : "recently"}</p></div>
      <div className="flex gap-2"><Link to="/conversations" className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border bg-white"><MessageCircle className="w-4 h-4"/>Conversations</Link><button onClick={handleDelete} disabled={isDeleting} className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg text-rose-700 bg-rose-50 border border-rose-200 disabled:opacity-50"><Trash2 className="w-4 h-4"/>{isDeleting ? "Deleting…" : "Delete"}</button></div>
    </div>
    <section className="space-y-3"><h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Permanent student profile</h2><StudentCard student={student}/></section>
    <section className="bg-white rounded-xl border border-slate-200 p-5 sm:p-7 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center"><Cpu className="w-5 h-5"/></div><div><h2 className="text-xl font-bold">AI Dropout Risk Assessment</h2><p className="text-xs text-slate-500">Part 3 · Machine-learning inference</p></div></div><button onClick={() => loadPrediction(student._id || id)} disabled={predicting} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-semibold disabled:opacity-50"><RefreshCw className={`w-4 h-4 ${predicting ? "animate-spin" : ""}`}/>Run prediction</button></div>
      {predicting && <div className="py-8 text-center text-sm text-slate-500"><Loader2 className="w-6 h-6 animate-spin mx-auto mb-2"/>Connecting to ML inference service…</div>}
      {!predicting && prediction && <><div className="grid sm:grid-cols-2 gap-4"><div className="rounded-xl border p-5"><p className="text-xs text-slate-500 uppercase tracking-wide">Estimated dropout risk</p><p className="text-4xl font-bold mt-2">{prediction.dropoutRiskProbability}<span className="text-lg text-slate-400">%</span></p><p className="text-xs text-slate-500 mt-1">Model estimate — not a certainty</p></div><div className={`rounded-xl border p-5 flex flex-col justify-center ${riskColor}`}><p className="text-xs font-semibold uppercase tracking-wide">Risk category</p><p className="text-3xl font-bold mt-2">{prediction.riskLevel} risk</p><p className="text-xs mt-1">Display bands: Low &lt;40%, Medium 40–69%, High ≥70%</p></div></div><div className="rounded-lg bg-slate-50 p-4 text-sm text-slate-600"><div className="flex items-center gap-2 font-semibold text-slate-800"><TrendingUp className="w-4 h-4"/>Model information</div><p className="mt-2 text-xs">Version: {prediction.modelVersion || "Not specified"} · Algorithm: Random Forest</p>{prediction.modelMetrics && <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">{[["Accuracy",prediction.modelMetrics.accuracy],["Precision",prediction.modelMetrics.precision],["Recall",prediction.modelMetrics.recall],["ROC-AUC",prediction.modelMetrics.rocAuc]].map(([label,value])=><div key={label}><p className="text-xs text-slate-500">{label}</p><p className="font-semibold">{value == null ? "—" : `${(value*100).toFixed(1)}%`}</p></div>)}</div>}</div></>}
      {!predicting && !prediction && <div className="rounded-lg border border-dashed p-6 text-center"><ShieldAlert className="w-8 h-8 text-amber-500 mx-auto mb-2"/><p className="font-semibold text-slate-800">Model not ready</p><p className="text-sm text-slate-500 mt-1">{predictionError || "Train and start the ML service to calculate a prediction."}</p></div>}
      <p className="text-xs text-slate-500">This screening estimate is intended only to help a human advisor prioritise supportive conversations. It is not a diagnosis, a guaranteed outcome, or a basis for disciplinary, admission, scholarship or grading decisions. Review data quality and model fairness before acting.</p>
      {modelStatus?.trained === false && <p className="text-xs text-amber-700">The inference API is reachable, but no trained model artifact is loaded.</p>}
    </section>
  </div>;
}
