const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    // Personal Details
    studentId: {
      type: String,
      required: [true, "Student ID is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },
    name: {
      type: String,
      required: [true, "Student Name is required"],
      trim: true,
    },
    age: {
      type: Number,
      required: [true, "Age is required"],
      min: [15, "Age must be at least 15"],
      max: [100, "Age cannot exceed 100"],
    },
    gender: {
      type: String,
      required: [true, "Gender is required"],
      enum: {
        values: ["Male", "Female", "Other"],
        message: "Gender must be Male, Female, or Other",
      },
    },
    branch: {
      type: String,
      required: [true, "Course/Branch is required"],
      trim: true,
    },
    semester: {
      type: String,
      required: [true, "Semester is required"],
      trim: true,
    },

    // Academic Performance
    cgpa: {
      type: Number,
      required: [true, "Current CGPA is required"],
      min: [0, "CGPA must be between 0 and 10"],
      max: [10, "CGPA must be between 0 and 10"],
    },
    previousCgpa: {
      type: Number,
      required: [true, "Previous semester CGPA is required"],
      min: [0, "Previous CGPA must be between 0 and 10"],
      max: [10, "Previous CGPA must be between 0 and 10"],
    },
    backlogs: {
      type: Number,
      required: [true, "Number of backlogs is required"],
      min: [0, "Backlogs cannot be negative"],
      default: 0,
    },
    internalMarks: {
      type: Number,
      required: [true, "Internal marks are required"],
      min: [0, "Internal marks must be between 0 and 50"],
      max: [50, "Internal marks cannot exceed 50"],
    },

    // Attendance & Engagement
    attendance: {
      type: Number,
      required: [true, "Attendance percentage is required"],
      min: [0, "Attendance must be between 0 and 100"],
      max: [100, "Attendance must be between 0 and 100"],
    },
    assignmentCompletion: {
      type: Number,
      required: [true, "Assignment completion percentage is required"],
      min: [0, "Assignment completion must be between 0 and 100"],
      max: [100, "Assignment completion must be between 0 and 100"],
    },
    classesMissed: {
      type: Number,
      required: [true, "Classes missed is required"],
      min: [0, "Classes missed cannot be negative"],
      default: 0,
    },

    // Financial Information
    scholarship: {
      type: String,
      required: [true, "Scholarship status is required"],
      enum: {
        values: ["Yes", "No"],
        message: "Scholarship must be either Yes or No",
      },
      default: "No",
    },
    feeStatus: {
      type: String,
      required: [true, "Fee status is required"],
      enum: {
        values: ["Paid", "Pending"],
        message: "Fee status must be either Paid or Pending",
      },
      default: "Paid",
    },

    // AI Prediction & Risk Evaluation
    prediction: {
      riskLevel: {
        type: String,
        enum: ["Low Risk", "Medium Risk", "High Risk"],
        default: "Low Risk",
      },
      riskScore: {
        type: Number,
        min: 0,
        max: 100,
        default: 15,
      },
      probability: {
        type: Number,
        default: 0.15,
      },
      factors: [
        {
          type: String,
        },
      ],
      recommendation: {
        type: String,
      },
      evaluatedAt: {
        type: Date,
      },
    },

    // Metadata
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("Student", studentSchema);
