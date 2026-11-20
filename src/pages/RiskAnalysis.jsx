import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPredictionSummary, getModelStatus } from "../services/api";
import { Activity, AlertCircle, RefreshCw, ShieldCheck, TrendingUp, Users } from "lucide-react";

export default function RiskAnalysis() {
  const [summary,setSummary]=useState(null);
  const [status,setStatus]=useState(null);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState("");
  const load=async()=>{setLoading(true);setError("");try{const [s,m]=await Promise.all([getPredictionSummary(),getModelStatus()]);setSummary(s);setStatus(m);}catch(e){setError(e.response?.data?.message||"Could not connect to the ML service. Train and start it, then retry.");}finally{setLoading(false);}};
  useEffect(()=>{load();},[]);
  const rows=summary?.data||[];
  const valid=rows.filter(x=>x.success);
  const count=(level)=>valid.filter(x=>x.prediction.riskLevel===level).length;
  return <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
    <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-3"><div><p className="text-xs uppercase tracking-wider text-blue-600 font-semibold">Part 3 · ML Analytics</p><h1 className="text-3xl font-bold text-slate-900 mt-1">Student Risk Analysis</h1><p className="text-sm text-slate-500 mt-1">Model-generated screening estimates for human review.</p></div><button onClick={load} disabled={loading} className="inline-flex items-center gap-2 px-3 py-2 border rounded-lg text-sm"><RefreshCw className={`w-4 h-4 ${loading?"animate-spin":""}`}/>Refresh predictions</button></header>
    {error&&<div role="alert" className="p-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm flex gap-2"><AlertCircle className="w-4 h-4 shrink-0"/>{error}</div>}
    {status&&<div className={`p-3 rounded-lg border text-sm ${status.trained?"bg-emerald-50 border-emerald-200 text-emerald-800":"bg-amber-50 border-amber-200 text-amber-800"}`}>ML service connected · {status.trained?"Trained model loaded":"No trained model loaded"} {status.metadata?.model_version&&`· ${status.metadata.model_version}`}</div>}
    {loading?<div className="py-16 text-center text-slate-500"><Activity className="w-7 h-7 animate-pulse mx-auto mb-2"/>Calculating predictions…</div>:summary&&<><div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">{[["Total students",summary.count,Users],["Predictions ready",valid.length,ShieldCheck],["High risk",count("High"),AlertCircle],["Medium risk",count("Medium"),TrendingUp]].map(([label,value,Icon])=><div key={label} className="bg-white border rounded-xl p-5"><Icon className="w-5 h-5 text-slate-500"/><p className="text-xs text-slate-500 mt-3">{label}</p><p className="text-3xl font-bold mt-1">{value}</p></div>)}</div>
    <section className="bg-white border rounded-xl overflow-hidden"><div className="p-4 border-b"><h2 className="font-semibold">Student-level predictions</h2><p className="text-xs text-slate-500 mt-1">Only valid model results are categorised. Failed predictions are not treated as low risk.</p></div><div className="overflow-x-auto"><table className="w-full text-sm text-left"><thead className="bg-slate-50 text-xs text-slate-500"><tr><th className="p-3">Student</th><th className="p-3">Student ID</th><th className="p-3">Risk category</th><th className="p-3">Estimated probability</th><th className="p-3">Details</th></tr></thead><tbody className="divide-y">{rows.map(row=><tr key={row.student.id}><td className="p-3 font-medium">{row.student.name}</td><td className="p-3 text-slate-500">{row.student.studentId}</td><td className="p-3">{row.success?<span className={`px-2 py-1 rounded-full text-xs font-semibold ${row.prediction.riskLevel==="High"?"bg-rose-50 text-rose-700":row.prediction.riskLevel==="Medium"?"bg-amber-50 text-amber-700":"bg-emerald-50 text-emerald-700"}`}>{row.prediction.riskLevel}</span>:<span className="text-xs text-slate-400">Unavailable</span>}</td><td className="p-3">{row.success?`${row.prediction.dropoutRiskProbability}%`:"—"}</td><td className="p-3"><Link className="text-blue-600 hover:underline" to={`/students/${row.student.id}`}>Open profile</Link></td></tr>)}</tbody></table></div>{!rows.length&&<p className="p-6 text-center text-sm text-slate-500">No students registered yet.</p>}</section></>}
    <p className="text-xs text-slate-500">Risk bands are configurable demonstration thresholds, not institutionally validated decision cut-offs. Use this screen to prioritise supportive check-ins only. Never interpret a missing prediction as low risk.</p>
  </main>;
}
