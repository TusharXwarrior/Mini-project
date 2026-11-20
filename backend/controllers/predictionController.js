const mongoose = require("mongoose");
const Student = require("../models/Student");

const ML_SERVICE_URL = (process.env.ML_SERVICE_URL || "http://127.0.0.1:8000").replace(/\/$/, "");

async function findStudent(id) {
  if (mongoose.Types.ObjectId.isValid(id)) {
    const found = await Student.findById(id);
    if (found) return found;
  }
  return Student.findOne({ studentId: String(id).trim().toUpperCase() });
}

function toFeatures(student) {
  return {
    age: student.age,
    cgpa: student.cgpa,
    previousCgpa: student.previousCgpa,
    backlogs: student.backlogs,
    internalMarks: student.internalMarks,
    attendance: student.attendance,
    assignmentCompletion: student.assignmentCompletion,
    classesMissed: student.classesMissed,
    scholarship: student.scholarship,
    feeStatus: student.feeStatus,
  };
}

exports.getModelStatus = async (_req, res) => {
  try {
    const response = await fetch(`${ML_SERVICE_URL}/model-info`);
    const data = await response.json();
    return res.status(response.ok ? 200 : 503).json({ success: response.ok, ...data });
  } catch (error) {
    return res.status(503).json({ success: false, trained: false, message: "ML service is unavailable. Check ML_SERVICE_URL." });
  }
};

exports.predictStudent = async (req, res) => {
  try {
    const student = await findStudent(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: "Student not found." });
    const response = await fetch(`${ML_SERVICE_URL}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(toFeatures(student)),
    });
    const result = await response.json();
    if (!response.ok) return res.status(response.status).json({ success: false, message: result.detail || "Prediction service error.", modelTrained: false });
    return res.json({ success: true, student: { id: student._id, studentId: student.studentId, name: student.name }, prediction: result });
  } catch (error) {
    console.error("Student prediction:", error);
    return res.status(503).json({ success: false, message: "Prediction service is unavailable. Check ML_SERVICE_URL." });
  }
};

exports.predictAllStudents = async (_req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    const results = await Promise.all(students.map(async (student) => {
      try {
        const response = await fetch(`${ML_SERVICE_URL}/predict`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify(toFeatures(student)),
        });
        const data = await response.json();
        return { student: { id: student._id, studentId: student.studentId, name: student.name }, success: response.ok, prediction: response.ok ? data : null, error: response.ok ? null : data.detail };
      } catch (error) {
        return { student: { id: student._id, studentId: student.studentId, name: student.name }, success: false, error: "ML service unavailable" };
      }
    }));
    return res.json({ success: true, count: results.length, data: results, modelAvailable: results.some((item) => item.success) });
  } catch (error) {
    console.error("Batch prediction:", error);
    return res.status(500).json({ success: false, message: "Unable to calculate student risk summary." });
  }
};
