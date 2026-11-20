import React, { useState } from "react";
import { predictStudent } from "../services/api";
import {
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Info,
  ShieldCheck,
  Brain,
  Lightbulb,
} from "lucide-react";

export default function StudentPredictionCard({
  student,
  prediction: initialPrediction,
  onPredictionUpdated,
}) {
  const studentId = student?.studentId || student?.id;
  const currentPrediction = initialPrediction || student?.prediction;

  const [prediction, setPrediction] = useState(currentPrediction || null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const handleReevaluate = async () => {
    if (!studentId || isEvaluating) return;
    setIsEvaluating(true);
    try {
      const res = await predictStudent(studentId);
      if (res && res.success) {
        setPrediction(res.data);
        if (onPredictionUpdated) onPredictionUpdated(res.data);
      }
    } catch (err) {
      console.error("Prediction evaluation error:", err);
      alert("Unable to complete AI evaluation. Please verify server connection.");
    } finally {
      setIsEvaluating(false);
    }
  };

  const riskLevel = prediction?.riskLevel || "Low Risk";
  const riskScore = prediction?.riskScore ?? 15;
  const probability = prediction?.probability ?? (riskScore / 100).toFixed(2);
  const factors = prediction?.factors || ["Regular academic engagement"];
  const recommendation =
    prediction?.recommendation ||
    "Maintain ongoing attendance and participate actively in core engineering electives.";

  const getRiskStyles = () => {
    switch (riskLevel) {
      case "High Risk":
        return {
          badgeBg: "bg-rose-50 text-rose-800 border-rose-300",
          dotColor: "bg-rose-500",
          barColor: "bg-rose-500",
          headerBg: "bg-rose-50/50 border-rose-200",
          icon: AlertCircle,
          iconColor: "text-rose-600",
          title: "High Risk of Dropout",
        };
      case "Medium Risk":
        return {
          badgeBg: "bg-amber-50 text-amber-800 border-amber-300",
          dotColor: "bg-amber-500",
          barColor: "bg-amber-500",
          headerBg: "bg-amber-50/50 border-amber-200",
          icon: AlertTriangle,
          iconColor: "text-amber-600",
          title: "Moderate Dropout Risk",
        };
      default:
        return {
          badgeBg: "bg-emerald-50 text-emerald-800 border-emerald-300",
          dotColor: "bg-emerald-500",
          barColor: "bg-emerald-500",
          headerBg: "bg-emerald-50/50 border-emerald-200",
          icon: CheckCircle2,
          iconColor: "text-emerald-600",
          title: "Low Dropout Risk",
        };
    }
  };

  const style = getRiskStyles();
  const Icon = style.icon;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Top Banner */}
      <div className={`p-5 sm:p-6 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${style.headerBg}`}>
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-lg bg-white shadow-2xs flex items-center justify-center shrink-0 border border-slate-200`}>
            <Brain className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                AI Dropout Risk Assessment
              </h3>
              <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold border ${style.badgeBg}`}>
                <span className={`w-2 h-2 rounded-full ${style.dotColor} animate-pulse`} />
                {riskLevel}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Machine Learning evaluation based on academic scores, attendance, backlogs, and engagement.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {studentId && (
            <button
              type="button"
              onClick={handleReevaluate}
              disabled={isEvaluating}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 transition shadow-2xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isEvaluating ? "animate-spin text-blue-600" : ""}`} />
              {isEvaluating ? "Evaluating..." : "Re-evaluate with AI"}
            </button>
          )}
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-6">
        {/* Risk Score Progress Bar & Probability */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon className={`w-4 h-4 ${style.iconColor}`} />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Estimated Risk Probability
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-900 font-mono">
                {riskScore}%
              </span>
              <span className="text-xs text-slate-400">
                (p = {probability})
              </span>
            </div>
          </div>

          {/* Visual bar */}
          <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden p-0.5">
            <div
              className={`h-2 rounded-full transition-all duration-700 ${style.barColor}`}
              style={{ width: `${Math.min(100, Math.max(5, riskScore))}%` }}
            />
          </div>

          <div className="flex justify-between text-[11px] text-slate-400 font-medium">
            <span>0% (Safe)</span>
            <span>35% (Moderate Threshold)</span>
            <span>65% (Critical Threshold)</span>
            <span>100%</span>
          </div>
        </div>

        {/* Contributing Factors & Recommendation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Key Contributing Factors */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Observed Risk Factors
            </span>
            <div className="space-y-1.5">
              {factors.map((factor, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                  <span>{factor}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actionable Support Recommendation */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
              Recommended Intervention
            </span>
            <div className="bg-blue-50/60 p-3.5 rounded-xl border border-blue-100 space-y-2">
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                "{recommendation}"
              </p>
              <div className="text-[11px] text-blue-800 font-semibold flex items-center gap-1 pt-1 border-t border-blue-100">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                Suggested next step: Discuss in Student ↔ Counsellor Chat.
              </div>
            </div>
          </div>
        </div>

        {/* Mandatory Educational Safety Notice */}
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-start gap-2.5 text-xs text-slate-500">
          <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-slate-700">Educational Notice:</strong> Predictions are based on
            available academic, attendance, and engagement indicators and must be utilized as an
            early-warning decision support tool, never as a definitive or final outcome.
          </p>
        </div>
      </div>
    </div>
  );
}
