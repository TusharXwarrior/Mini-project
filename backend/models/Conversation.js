const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: { type: String, enum: ["student", "counsellor", "ai"], required: true },
  senderName: { type: String, trim: true, maxlength: 80, default: "" },
  message: { type: String, required: true, trim: true, maxlength: 4000 },
  createdAt: { type: Date, default: Date.now },
}, { _id: true });

const conversationSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true, index: true },
  messages: { type: [messageSchema], default: [] },
  status: { type: String, enum: ["open", "closed"], default: "open" },
  lastActivityAt: { type: Date, default: Date.now, index: true },
}, { timestamps: true });

conversationSchema.index({ student: 1, lastActivityAt: -1 });
module.exports = mongoose.model("Conversation", conversationSchema);
