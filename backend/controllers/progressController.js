const Progress = require("../models/Progress");
const Student = require("../models/Student");

// Helper to determine status
function calculateStatus(prev, curr, higherIsBetter = true, threshold = 0.5) {
  const p = Number(prev);
  const c = Number(curr);
  if (isNaN(p) || isNaN(c)) return "Stable";

  const diff = c - p;
  if (Math.abs(diff) <= threshold) return "Stable";

  if (higherIsBetter) {
    return diff > 0 ? "Improving" : "Declining";
  } else {
    // For backlogs: fewer is better
    return diff < 0 ? "Improving" : "Declining";
  }
}

// @desc    Get progress history for a student
// @route   GET /api/progress/:studentId
exports.getProgressHistory = async (req, res) => {
  try {
    const studentId = req.params.studentId.trim().toUpperCase();
    const history = await Progress.find({ studentId }).sort({ recordedAt: -1 });

    return res.status(200).json({
      success: true,
      count: history.length,
      data: history,
    });
  } catch (error) {
    console.error("Error fetching progress history:", error);
    return res.status(500).json({
      success: false,
      message: "Server error: Unable to retrieve progress history.",
    });
  }
};

// @desc    Record new progress checkpoint
// @route   POST /api/progress/:studentId
exports.recordProgress = async (req, res) => {
  try {
    const studentId = req.params.studentId.trim().toUpperCase();
    const {
      checkpointTitle,
      attendance,
      cgpa,
      assignmentCompletion,
      backlogs,
      wellbeingStatus,
      counsellorRemarks,
      actionPlan,
      followUpDate,
    } = req.body;

    const progress = new Progress({
      studentId,
      checkpointTitle: checkpointTitle || "Progress Evaluation",
      attendance: Number(attendance),
      cgpa: Number(cgpa),
      assignmentCompletion: Number(assignmentCompletion),
      backlogs: Number(backlogs || 0),
      wellbeingStatus: wellbeingStatus || "Good",
      counsellorRemarks: counsellorRemarks || "",
      actionPlan: actionPlan || "",
      followUpDate: followUpDate ? new Date(followUpDate) : undefined,
      recordedAt: new Date(),
    });

    const savedProgress = await progress.save();

    // Also update student current metrics to reflect this latest update
    await Student.findOneAndUpdate(
      { studentId },
      {
        attendance: Number(attendance),
        cgpa: Number(cgpa),
        assignmentCompletion: Number(assignmentCompletion),
        backlogs: Number(backlogs || 0),
      }
    );

    return res.status(201).json({
      success: true,
      message: "Progress record created successfully.",
      data: savedProgress,
    });
  } catch (error) {
    console.error("Error recording progress:", error);
    return res.status(500).json({
      success: false,
      message: "Server error: Unable to record progress.",
    });
  }
};

// @desc    Automatic Progress Comparison: Compare previous vs current parameters
// @route   GET /api/progress/:studentId/comparison
exports.getProgressComparison = async (req, res) => {
  try {
    const studentId = req.params.studentId.trim().toUpperCase();
    const student = await Student.findOne({ studentId });
    const checkpoints = await Progress.find({ studentId }).sort({ recordedAt: -1 }).limit(2);

    if (!student && checkpoints.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No student or progress record found for comparison.",
      });
    }

    // Determine Previous vs Current
    let prev = {};
    let curr = {};

    if (checkpoints.length >= 2) {
      // Compare the two most recent recorded checkpoints
      curr = checkpoints[0];
      prev = checkpoints[1];
    } else if (checkpoints.length === 1 && student) {
      // Compare baseline student profile (previous) with recent checkpoint (current)
      prev = {
        attendance: student.attendance,
        cgpa: student.previousCgpa !== undefined ? student.previousCgpa : student.cgpa,
        assignmentCompletion: student.assignmentCompletion,
        backlogs: student.backlogs,
      };
      curr = checkpoints[0];
    } else if (student) {
      // Baseline comparison: student's previous semester CGPA vs current CGPA, plus estimated baseline
      prev = {
        attendance: Math.max(30, Math.round(student.attendance - 12)),
        cgpa: student.previousCgpa !== undefined ? Number(student.previousCgpa) : Number(student.cgpa),
        assignmentCompletion: Math.max(25, Math.round(student.assignmentCompletion - 15)),
        backlogs: Math.max(0, student.backlogs + 1),
      };
      curr = {
        attendance: student.attendance,
        cgpa: student.cgpa,
        assignmentCompletion: student.assignmentCompletion,
        backlogs: student.backlogs,
      };
    }

    const comparison = [
      {
        parameter: "Attendance",
        previous: `${prev.attendance}%`,
        current: `${curr.attendance}%`,
        status: calculateStatus(prev.attendance, curr.attendance, true, 1),
      },
      {
        parameter: "CGPA",
        previous: Number(prev.cgpa).toFixed(2),
        current: Number(curr.cgpa).toFixed(2),
        status: calculateStatus(prev.cgpa, curr.cgpa, true, 0.05),
      },
      {
        parameter: "Assignments",
        previous: `${prev.assignmentCompletion}%`,
        current: `${curr.assignmentCompletion}%`,
        status: calculateStatus(prev.assignmentCompletion, curr.assignmentCompletion, true, 2),
      },
      {
        parameter: "Backlogs",
        previous: `${prev.backlogs}`,
        current: `${curr.backlogs}`,
        status: calculateStatus(prev.backlogs, curr.backlogs, false, 0),
      },
    ];

    // Calculate overall status
    const improvingCount = comparison.filter((c) => c.status === "Improving").length;
    const decliningCount = comparison.filter((c) => c.status === "Declining").length;
    let overallTrend = "Stable";
    if (improvingCount >= 2) overallTrend = "Improving";
    else if (decliningCount >= 2) overallTrend = "Declining";

    return res.status(200).json({
      success: true,
      data: {
        comparison,
        overallTrend,
        latestCheckpoint: checkpoints[0] || null,
        wellbeingStatus: checkpoints[0]?.wellbeingStatus || "Good",
        counsellorRemarks: checkpoints[0]?.counsellorRemarks || "Consistent active monitoring.",
        actionPlan: checkpoints[0]?.actionPlan || "Continue attending weekly lectures and submitting assignments on schedule.",
        followUpDate: checkpoints[0]?.followUpDate || null,
      },
    });
  } catch (error) {
    console.error("Error computing progress comparison:", error);
    return res.status(500).json({
      success: false,
      message: "Server error: Unable to compute progress comparison.",
    });
  }
};
