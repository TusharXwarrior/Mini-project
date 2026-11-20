const mongoose = require("mongoose");
const Student = require("../models/Student");
const Message = require("../models/Conversation");
const Progress = require("../models/Progress");
const { calculateStudentRisk } = require("../services/predictionService");

// @desc    Add a new student
// @route   POST /api/students
exports.createStudent = async (req, res) => {
  try {
    const {
      studentId,
      name,
      age,
      gender,
      branch,
      semester,
      cgpa,
      previousCgpa,
      prevCgpa, // support both naming conventions from frontend
      backlogs,
      internalMarks,
      attendance,
      assignmentCompletion,
      classesMissed,
      scholarship,
      feeStatus,
    } = req.body;

    // Check empty form submission
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Request body cannot be empty.",
      });
    }

    const effectivePrevCgpa = previousCgpa !== undefined ? previousCgpa : prevCgpa;

    // Check for duplicate student ID proactively
    if (studentId) {
      const existingStudent = await Student.findOne({
        studentId: studentId.toString().trim().toUpperCase(),
      });
      if (existingStudent) {
        return res.status(409).json({
          success: false,
          message: `Student ID "${studentId.toUpperCase()}" already exists in the database.`,
        });
      }
    }

    // Create student instance
    const student = new Student({
      studentId: studentId ? studentId.toString().trim().toUpperCase() : undefined,
      name: name ? name.toString().trim() : undefined,
      age: age !== undefined && age !== "" ? Number(age) : undefined,
      gender,
      branch,
      semester,
      cgpa: cgpa !== undefined && cgpa !== "" ? Number(cgpa) : undefined,
      previousCgpa:
        effectivePrevCgpa !== undefined && effectivePrevCgpa !== ""
          ? Number(effectivePrevCgpa)
          : undefined,
      backlogs: backlogs !== undefined && backlogs !== "" ? Number(backlogs) : 0,
      internalMarks:
        internalMarks !== undefined && internalMarks !== ""
          ? Number(internalMarks)
          : undefined,
      attendance:
        attendance !== undefined && attendance !== "" ? Number(attendance) : undefined,
      assignmentCompletion:
        assignmentCompletion !== undefined && assignmentCompletion !== ""
          ? Number(assignmentCompletion)
          : undefined,
      classesMissed:
        classesMissed !== undefined && classesMissed !== "" ? Number(classesMissed) : 0,
      scholarship: scholarship || "No",
      feeStatus: feeStatus || "Paid",
    });

    // Compute AI Dropout Risk Evaluation
    student.prediction = calculateStudentRisk(student);

    const savedStudent = await student.save();

    return res.status(201).json({
      success: true,
      message: "Student data saved successfully.",
      data: savedStudent,
    });
  } catch (error) {
    // Handle MongoDB duplicate key error (code 11000)
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Duplicate student ID detected. A student with this ID already exists.",
      });
    }

    // Handle Mongoose Validation Error
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(", "),
        errors: messages,
      });
    }

    console.error("Error creating student:", error);
    return res.status(500).json({
      success: false,
      message: "Server error: Unable to save student data.",
    });
  }
};

// @desc    Get all students
// @route   GET /api/students
exports.getAllStudents = async (req, res) => {
  try {
    const rawStudents = await Student.find().sort({ createdAt: -1 });

    const students = rawStudents.map((s) => {
      const doc = s.toObject();
      if (!doc.prediction || !doc.prediction.riskLevel) {
        doc.prediction = calculateStudentRisk(doc);
      }
      return doc;
    });

    return res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    console.error("Error fetching students:", error);
    return res.status(500).json({
      success: false,
      message: "Server error: Unable to retrieve students.",
    });
  }
};

// @desc    Get one student by ID (MongoDB _id or studentId)
// @route   GET /api/students/:id
exports.getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    let student = null;

    // Check if valid ObjectId
    if (mongoose.Types.ObjectId.isValid(id)) {
      student = await Student.findById(id);
    }

    // Fallback: search by studentId
    if (!student) {
      student = await Student.findOne({ studentId: id.toString().trim().toUpperCase() });
    }

    if (!student) {
      return res.status(404).json({
        success: false,
        message: `Student with identifier "${id}" not found.`,
      });
    }

    const doc = student.toObject();
    if (!doc.prediction || !doc.prediction.riskLevel) {
      doc.prediction = calculateStudentRisk(doc);
    }

    return res.status(200).json({
      success: true,
      data: doc,
    });
  } catch (error) {
    console.error("Error fetching student by ID:", error);
    return res.status(500).json({
      success: false,
      message: "Server error: Unable to fetch student details.",
    });
  }
};

// @desc    Run AI Risk Prediction for a specific student
// @route   POST /api/students/:id/predict
exports.predictStudent = async (req, res) => {
  try {
    const { id } = req.params;
    let student = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      student = await Student.findById(id);
    }
    if (!student) {
      student = await Student.findOne({ studentId: id.toString().trim().toUpperCase() });
    }

    if (!student) {
      return res.status(404).json({
        success: false,
        message: `Student with identifier "${id}" not found.`,
      });
    }

    const riskResult = calculateStudentRisk(student);
    student.prediction = riskResult;
    await student.save();

    return res.status(200).json({
      success: true,
      data: riskResult,
    });
  } catch (error) {
    console.error("Error computing student prediction:", error);
    return res.status(500).json({
      success: false,
      message: "Server error: Unable to evaluate prediction.",
    });
  }
};

// @desc    Direct AI Risk Prediction for raw features
// @route   POST /api/predict
exports.predictDirect = async (req, res) => {
  try {
    const riskResult = calculateStudentRisk(req.body);
    return res.status(200).json({
      success: true,
      prediction: riskResult.riskLevel,
      probability: riskResult.probability,
      data: riskResult,
    });
  } catch (error) {
    console.error("Error computing direct prediction:", error);
    return res.status(500).json({
      success: false,
      message: "Server error: Unable to evaluate prediction.",
    });
  }
};

// @desc    Delete a student by ID (MongoDB _id or studentId)
// @route   DELETE /api/students/:id
exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    let student = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      student = await Student.findByIdAndDelete(id);
    }

    if (!student) {
      student = await Student.findOneAndDelete({
        studentId: id.toString().trim().toUpperCase(),
      });
    }

    if (!student) {
      return res.status(404).json({
        success: false,
        message: `Student with identifier "${id}" not found.`,
      });
    }

    // Automatic deletion of associated records (Conversation messages and Progress tracking)
    const targetStudentId = student.studentId;
    await Promise.all([
      Message.deleteMany({ studentId: targetStudentId }),
      Progress.deleteMany({ studentId: targetStudentId }),
    ]);

    return res.status(200).json({
      success: true,
      message: "Student record and associated conversation & progress records deleted successfully.",
      data: { id: student._id, studentId: student.studentId },
    });
  } catch (error) {
    console.error("Error deleting student:", error);
    return res.status(500).json({
      success: false,
      message: "Server error: Unable to delete student record.",
    });
  }
};
