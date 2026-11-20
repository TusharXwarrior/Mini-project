const mongoose = require("mongoose");
const Student = require("../models/Student");
const Progress = require("../models/Progress");

async function findStudent(id) {
  if (mongoose.Types.ObjectId.isValid(id)) {
    const byObjectId = await Student.findById(id);
    if (byObjectId) return byObjectId;
  }
  return Student.findOne({ studentId: String(id).trim().toUpperCase() });
}

function compare(current, previous) {
  if (!previous) return { status: "baseline", label: "Baseline recorded", changes: {} };
  const changes = {
    attendance: Number((current.attendance - previous.attendance).toFixed(1)),
    cgpa: Number((current.cgpa - previous.cgpa).toFixed(2)),
    assignmentCompletion: Number((current.assignmentCompletion - previous.assignmentCompletion).toFixed(1)),
    backlogs: current.backlogs - previous.backlogs,
  };
  const score = (changes.attendance > 0 ? 1 : changes.attendance < 0 ? -1 : 0)
    + (changes.cgpa > 0 ? 1 : changes.cgpa < 0 ? -1 : 0)
    + (changes.assignmentCompletion > 0 ? 1 : changes.assignmentCompletion < 0 ? -1 : 0)
    + (changes.backlogs < 0 ? 1 : changes.backlogs > 0 ? -1 : 0);
  return { status: score > 0 ? "improving" : score < 0 ? "declining" : "stable",
    label: score > 0 ? "Improving" : score < 0 ? "Needs attention" : "No significant change", changes };
}

exports.getProgress = async (req, res) => {
  try {
    const student = await findStudent(req.params.studentId);
    if (!student) return res.status(404).json({ success: false, message: "Student not found." });
    const records = await Progress.find({ student: student._id }).sort({ recordedAt: -1 }).lean();
    const latest = records[0] || null;
    const previous = records[1] || null;
    return res.json({ success: true, data: { records, comparison: latest ? compare(latest, previous) : null } });
  } catch (error) {
    console.error("Get progress:", error);
    return res.status(500).json({ success: false, message: "Unable to load progress history." });
  }
};

exports.addProgress = async (req, res) => {
  try {
    const student = await findStudent(req.params.studentId);
    if (!student) return res.status(404).json({ success: false, message: "Student not found." });
    const body = req.body || {};
    const record = await Progress.create({
      student: student._id,
      attendance: Number(body.attendance),
      cgpa: Number(body.cgpa),
      assignmentCompletion: Number(body.assignmentCompletion),
      backlogs: Number(body.backlogs ?? 0),
      wellbeing: body.wellbeing || "stable",
      notes: body.notes || "",
      actionPlan: body.actionPlan || "",
      followUpAt: body.followUpAt || null,
      recordedBy: body.recordedBy || "Counsellor",
    });
    const previous = await Progress.findOne({ student: student._id, _id: { $ne: record._id } }).sort({ recordedAt: -1 }).lean();
    return res.status(201).json({ success: true, data: record, comparison: compare(record.toObject(), previous) });
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") return res.status(400).json({ success: false, message: error.message });
    console.error("Add progress:", error);
    return res.status(500).json({ success: false, message: "Unable to save progress record." });
  }
};
