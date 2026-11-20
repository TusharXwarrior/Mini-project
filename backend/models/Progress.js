const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    checkpointTitle: {
      type: String,
      default: "Progress Review",
      trim: true,
    },
    attendance: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    cgpa: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },
    assignmentCompletion: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    backlogs: {
      type: Number,
      required: true,
      min: 0,
    },
    wellbeingStatus: {
      type: String,
      enum: ["Good", "Moderate", "Needs Attention", "Critical"],
      default: "Good",
    },
    counsellorRemarks: {
      type: String,
      default: "",
      trim: true,
    },
    actionPlan: {
      type: String,
      default: "",
      trim: true,
    },
    followUpDate: {
      type: Date,
    },
    recordedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("Progress", progressSchema);
