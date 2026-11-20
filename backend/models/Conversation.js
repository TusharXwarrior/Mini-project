const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    sender: {
      type: String,
      required: true,
      enum: ["student", "counsellor"],
      default: "student",
    },
    senderName: {
      type: String,
      required: true,
      trim: true,
    },
    text: {
      type: String,
      required: [true, "Message text is required"],
      trim: true,
    },
    isAiAssisted: {
      type: Boolean,
      default: false,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("Message", messageSchema);
