const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true, index: true },
  attendance: { type: Number, min: 0, max: 100, required: true },
  cgpa: { type: Number, min: 0, max: 10, required: true },
  assignmentCompletion: { type: Number, min: 0, max: 100, required: true },
  backlogs: { type: Number, min: 0, required: true, default: 0 },
  wellbeing: { type: String, enum: ["good", "stable", "needs_support"], default: "stable" },
  notes: { type: String, trim: true, maxlength: 1500, default: "" },
  actionPlan: { type: String, trim: true, maxlength: 1500, default: "" },
  followUpAt: { type: Date, default: null },
  recordedBy: { type: String, trim: true, maxlength: 100, default: "Counsellor" },
  recordedAt: { type: Date, default: Date.now, index: true },
}, { timestamps: true });

progressSchema.index({ student: 1, recordedAt: -1 });
module.exports = mongoose.model("Progress", progressSchema);
