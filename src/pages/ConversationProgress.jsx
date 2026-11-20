import React, { useCallback, useEffect, useMemo, useState } from "react";
import { MessageCircle, Send, TrendingUp, TrendingDown, Minus, Plus, RefreshCw, CalendarClock, UserRound, Bot, GraduationCap, AlertCircle, CheckCircle2 } from "lucide-react";
import { getStudents, getConversation, sendConversationMessage, getStudentProgress, addProgressRecord, askCounsellingAI } from "../services/api";

const initialForm = { attendance: "", cgpa: "", assignmentCompletion: "", backlogs: "0", wellbeing: "stable", notes: "", actionPlan: "", followUpAt: "" };
const dateLabel = (date) => date ? new Date(date).toLocaleString() : "No activity yet";

export default function ConversationProgress() {
  const [students, setStudents] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [student, setStudent] = useState(null);
  const [conversation, setConversation] = useState(null);
  const [progress, setProgress] = useState({ records: [], comparison: null });
  const [message, setMessage] = useState("");
  const [role, setRole] = useState("counsellor");
  const [senderName, setSenderName] = useState("Counsellor");
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadStudents = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const response = await getStudents();
      const rows = response.data || [];
      setStudents(rows);
      if (!selectedId && rows.length) setSelectedId(rows[0]._id || rows[0].studentId);
    } catch (e) { setError(e.response?.data?.message || "Could not load students. Check the backend connection."); }
    finally { setLoading(false); }
  }, [selectedId]);

  const loadSelected = useCallback(async () => {
    if (!selectedId) { setStudent(null); setConversation(null); setProgress({ records: [], comparison: null }); return; }
    try {
      const [chat, history] = await Promise.all([getConversation(selectedId), getStudentProgress(selectedId)]);
      setStudent(chat.data.student); setConversation(chat.data.conversation); setProgress(history.data);
      setForm({ attendance: chat.data.student.attendance ?? "", cgpa: chat.data.student.cgpa ?? "", assignmentCompletion: chat.data.student.assignmentCompletion ?? "", backlogs: chat.data.student.backlogs ?? 0, wellbeing: "stable", notes: "", actionPlan: "", followUpAt: "" });
    } catch (e) { setError(e.response?.data?.message || "Could not load this student's records."); }
  }, [selectedId]);

  useEffect(() => { loadStudents(); }, []);
  useEffect(() => { loadSelected(); }, [loadSelected]);

  const selectedKey = useMemo(() => selectedId, [selectedId]);
  const submitMessage = async (e) => {
    e.preventDefault(); if (!message.trim() || !selectedKey) return;
    setSaving(true); setError("");
    try {
      const response = await sendConversationMessage(selectedKey, { message: message.trim(), sender: role, senderName });
      setConversation(response.data); setMessage(""); setNotice("Message saved to the student's conversation history.");
    } catch (e2) { setError(e2.response?.data?.message || "Message could not be sent."); }
    finally { setSaving(false); }
  };

  const submitProgress = async (e) => {
    e.preventDefault(); setSaving(true); setError(""); setNotice("");
    try {
      const payload = { ...form, attendance: Number(form.attendance), cgpa: Number(form.cgpa), assignmentCompletion: Number(form.assignmentCompletion), backlogs: Number(form.backlogs), recordedBy: senderName };
      const response = await addProgressRecord(selectedKey, payload);
      setProgress((old) => ({ records: [response.data, ...old.records], comparison: response.comparison }));
      setNotice("Progress checkpoint saved. The latest record has been compared with the previous checkpoint.");
      setForm((old) => ({ ...old, notes: "", actionPlan: "", followUpAt: "" }));
    } catch (e2) { setError(e2.response?.data?.message || "Progress record could not be saved."); }
    finally { setSaving(false); }
  };

  const requestAI = async () => {
    if (!student || !conversation) return;
    setAiLoading(true); setError("");
    try {
      const response = await askCounsellingAI(selectedKey);
      const saved = await sendConversationMessage(selectedKey, { message: response.reply, sender: "counsellor", senderName: "AI Counselling Assistant" });
      setConversation(saved.data); setNotice(response.mode === "ai" ? "AI suggestion added to the conversation. Review it before sharing with the student." : "Guided suggestion added. Configure an AI API key for generated responses.");
    } catch (e) { setError(e.response?.data?.message || "AI assistant is unavailable."); }
    finally { setAiLoading(false); }
  };

  const comparison = progress.comparison;
  const StatusIcon = comparison?.status === "improving" ? TrendingUp : comparison?.status === "declining" ? TrendingDown : Minus;
  const statusColor = comparison?.status === "improving" ? "text-emerald-700 bg-emerald-50" : comparison?.status === "declining" ? "text-rose-700 bg-rose-50" : "text-amber-700 bg-amber-50";

  return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
    <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div><p className="text-xs font-semibold uppercase tracking-wider text-blue-600">Student retention workspace</p><h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">Conversations & Progress</h1><p className="text-sm text-slate-500 mt-1">Counsellors and students can communicate, record follow-ups and review academic trends.</p></div>
      <button onClick={() => { loadStudents(); if (selectedKey) loadSelected(); }} className="inline-flex items-center gap-2 px-3 py-2 text-sm border rounded-lg bg-white hover:bg-slate-50"><RefreshCw className="w-4 h-4"/>Refresh</button>
    </header>
    {error && <div role="alert" className="p-3 rounded-lg border border-rose-200 bg-rose-50 text-rose-800 text-sm flex gap-2"><AlertCircle className="w-4 h-4 shrink-0"/>{error}</div>}
    {notice && <div role="status" className="p-3 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-800 text-sm flex gap-2"><CheckCircle2 className="w-4 h-4 shrink-0"/>{notice}</div>}
    <div className="grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] gap-5">
      <aside className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="p-4 border-b"><h2 className="font-semibold text-slate-900">Students</h2><p className="text-xs text-slate-500 mt-1">{students.length} student profiles</p></div>
        <div className="max-h-[640px] overflow-y-auto divide-y divide-slate-100">
          {loading ? <p className="p-5 text-sm text-slate-500">Loading students…</p> : students.map((s) => <button key={s._id || s.studentId} onClick={() => setSelectedId(s._id || s.studentId)} className={`w-full text-left p-4 hover:bg-slate-50 ${selectedId === (s._id || s.studentId) ? "bg-blue-50 border-l-4 border-blue-600" : ""}`}><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600"><UserRound className="w-4 h-4"/></div><div className="min-w-0"><p className="font-medium text-sm text-slate-900 truncate">{s.name}</p><p className="text-xs text-slate-500">{s.studentId} · {s.branch}</p></div></div></button>)}
          {!loading && students.length === 0 && <p className="p-5 text-sm text-slate-500">No students found. Add a student first.</p>}
        </div>
      </aside>
      <div className="space-y-5 min-w-0">
        {!student ? <div className="bg-white border rounded-xl p-12 text-center text-slate-500">Select a student to open their conversation and progress history.</div> : <>
          <section className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div><h2 className="text-lg font-bold text-slate-900">{student.name}</h2><p className="text-xs text-slate-500">{student.studentId} · {student.branch} · Semester {student.semester}</p></div>
            {comparison && <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${statusColor}`}><StatusIcon className="w-4 h-4"/>{comparison.label}</span>}
          </section>
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
            {[["Attendance", student.attendance, "%"],["CGPA", student.cgpa, "/10"],["Assignments", student.assignmentCompletion, "%"],["Backlogs", student.backlogs, ""]].map(([label,value,suffix]) => <div key={label} className="bg-white border rounded-xl p-4"><p className="text-xs text-slate-500">{label}</p><p className="text-2xl font-bold text-slate-900 mt-1">{value ?? "—"}<span className="text-xs font-medium text-slate-400 ml-1">{suffix}</span></p></div>)}
          </div>
          <section className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="p-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3"><div><h3 className="font-semibold text-slate-900 flex items-center gap-2"><MessageCircle className="w-4 h-4 text-blue-600"/>Conversation history</h3><p className="text-xs text-slate-500 mt-1">Last activity: {dateLabel(conversation?.lastActivityAt)}</p></div><div className="flex items-center gap-2"><select value={role} onChange={e => { setRole(e.target.value); setSenderName(e.target.value === "student" ? student.name : "Counsellor"); }} className="text-xs border rounded-lg p-2"><option value="counsellor">Counsellor view</option><option value="student">Student view</option></select><button onClick={requestAI} disabled={aiLoading} className="inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg bg-violet-50 text-violet-700 border border-violet-200 disabled:opacity-50"><Bot className="w-4 h-4"/>{aiLoading ? "Thinking…" : "AI suggestion"}</button></div></div>
            <div className="h-[340px] overflow-y-auto p-4 space-y-3 bg-slate-50/70">
              {(conversation?.messages || []).map((m) => <div key={m._id} className={`flex ${m.sender === "student" ? "justify-start" : "justify-end"}`}><div className={`max-w-[85%] rounded-xl px-3.5 py-2.5 shadow-sm ${m.sender === "student" ? "bg-white border" : m.sender === "ai" ? "bg-violet-50 border border-violet-100" : "bg-blue-600 text-white"}`}><p className={`text-[11px] font-semibold mb-1 ${m.sender === "counsellor" ? "text-blue-100" : "text-slate-500"}`}>{m.senderName || m.sender} · {new Date(m.createdAt).toLocaleString()}</p><p className="text-sm whitespace-pre-wrap break-words">{m.message}</p></div></div>)}
              {!conversation?.messages?.length && <div className="text-center py-16 text-sm text-slate-400"><MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-40"/>No messages yet. Start the conversation.</div>}
            </div>
            <form onSubmit={submitMessage} className="p-3 border-t flex gap-2"><input value={message} onChange={e => setMessage(e.target.value)} maxLength={4000} placeholder={role === "student" ? "Write a message to your counsellor…" : "Write a message to this student…"} className="flex-1 min-w-0 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100" /><button disabled={saving || !message.trim()} className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"><Send className="w-4 h-4"/>Send</button></form>
          </section>
          <section className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-4"><Plus className="w-5 h-5 text-blue-600"/><div><h3 className="font-semibold text-slate-900">Record progress checkpoint</h3><p className="text-xs text-slate-500">Save a dated snapshot after a student check-in.</p></div></div>
            <form onSubmit={submitProgress} className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[["attendance","Attendance %",0,100],["cgpa","CGPA",0,10],["assignmentCompletion","Assignment %",0,100],["backlogs","Backlogs",0,50]].map(([key,label,min,max]) => <label key={key} className="text-xs font-medium text-slate-600">{label}<input required type="number" min={min} max={max} step={key === "cgpa" ? "0.01" : "1"} value={form[key]} onChange={e => setForm({...form,[key]:e.target.value})} className="mt-1 block w-full border rounded-lg px-3 py-2 text-sm text-slate-900"/></label>)}
              </div>
              <div className="grid md:grid-cols-2 gap-3"><label className="text-xs font-medium text-slate-600">Wellbeing<select value={form.wellbeing} onChange={e=>setForm({...form,wellbeing:e.target.value})} className="mt-1 block w-full border rounded-lg px-3 py-2 text-sm"><option value="good">Good</option><option value="stable">Stable</option><option value="needs_support">Needs support</option></select></label><label className="text-xs font-medium text-slate-600">Next follow-up date<input type="date" value={form.followUpAt} onChange={e=>setForm({...form,followUpAt:e.target.value})} className="mt-1 block w-full border rounded-lg px-3 py-2 text-sm"/></label></div>
              <label className="block text-xs font-medium text-slate-600">Counsellor notes<textarea rows="2" maxLength="1500" value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} className="mt-1 block w-full border rounded-lg px-3 py-2 text-sm" placeholder="What changed since the last check-in?"/></label>
              <label className="block text-xs font-medium text-slate-600">Action plan<textarea rows="2" maxLength="1500" value={form.actionPlan} onChange={e=>setForm({...form,actionPlan:e.target.value})} className="mt-1 block w-full border rounded-lg px-3 py-2 text-sm" placeholder="Agreed next steps and support required…"/></label>
              <button disabled={saving} className="bg-slate-900 hover:bg-slate-800 text-white rounded-lg px-4 py-2.5 text-sm font-medium disabled:opacity-50">Save progress checkpoint</button>
            </form>
          </section>
          <section className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2 mb-4"><CalendarClock className="w-4 h-4 text-blue-600"/>Progress timeline</h3>
            {comparison?.changes && <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">{Object.entries(comparison.changes).map(([key,value])=><div key={key} className="rounded-lg bg-slate-50 p-3"><p className="text-xs text-slate-500 capitalize">{key.replace(/([A-Z])/g," $1")}</p><p className={`font-semibold mt-1 ${(key === "backlogs" ? value < 0 : value > 0) ? "text-emerald-700" : (value !== 0 ? "text-rose-700" : "text-slate-700")}`}>{value > 0 ? "+" : ""}{value}{key === "cgpa" ? "" : key === "backlogs" ? "" : " pp"}</p></div>)}</div>}
            <div className="space-y-3">{progress.records.map((r,i)=><div key={r._id} className="border-l-2 border-blue-200 pl-4 py-1"><div className="flex flex-wrap items-center justify-between gap-2"><p className="text-sm font-semibold text-slate-900">{new Date(r.recordedAt).toLocaleDateString()} · {i === 0 ? "Latest checkpoint" : "Previous checkpoint"}</p><span className="text-xs text-slate-500">By {r.recordedBy}</span></div><p className="text-xs text-slate-600 mt-1">Attendance {r.attendance}% · CGPA {r.cgpa} · Assignments {r.assignmentCompletion}% · Backlogs {r.backlogs} · Wellbeing: {r.wellbeing.replace("_"," ")}</p>{r.notes && <p className="text-sm text-slate-600 mt-2">{r.notes}</p>}{r.actionPlan && <p className="text-sm text-blue-700 mt-1">Action: {r.actionPlan}</p>}{r.followUpAt && <p className="text-xs text-amber-700 mt-1">Follow-up: {new Date(r.followUpAt).toLocaleDateString()}</p>}</div>)}
              {!progress.records.length && <p className="text-sm text-slate-500">No progress checkpoints yet. Save the first checkpoint above to establish a baseline.</p>}</div>
          </section>
          <p className="text-xs text-slate-400 flex items-start gap-2"><GraduationCap className="w-4 h-4 shrink-0"/>Progress status compares the latest checkpoint with the previous one across attendance, CGPA, assignments and backlogs. It is a support indicator, not an automated judgement about a student's future.</p>
        </>}
      </div>
    </div>
  </div>;
}
