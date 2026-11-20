const mongoose = require("mongoose");
const Student = require("../models/Student");
const Conversation = require("../models/Conversation");

async function findStudent(id) {
  if (mongoose.Types.ObjectId.isValid(id)) {
    const byObjectId = await Student.findById(id);
    if (byObjectId) return byObjectId;
  }
  return Student.findOne({ studentId: String(id).trim().toUpperCase() });
}

exports.listConversations = async (req, res) => {
  try {
    const students = await Student.find().select("name studentId branch semester");
    const conversations = await Conversation.find().sort({ lastActivityAt: -1 }).lean();
    const latestByStudent = new Map();
    conversations.forEach((c) => {
      const key = String(c.student);
      if (!latestByStudent.has(key)) latestByStudent.set(key, c);
    });
    return res.json({ success: true, data: students.map((s) => {
      const c = latestByStudent.get(String(s._id));
      return { student: s, conversationId: c?._id || null, lastActivityAt: c?.lastActivityAt || null,
        messageCount: c?.messages?.length || 0, status: c?.status || "new" };
    }) });
  } catch (error) {
    console.error("List conversations:", error);
    return res.status(500).json({ success: false, message: "Unable to load conversations." });
  }
};

exports.getConversation = async (req, res) => {
  try {
    const student = await findStudent(req.params.studentId);
    if (!student) return res.status(404).json({ success: false, message: "Student not found." });
    let conversation = await Conversation.findOne({ student: student._id });
    if (!conversation) conversation = await Conversation.create({ student: student._id });
    return res.json({ success: true, data: { student, conversation } });
  } catch (error) {
    console.error("Get conversation:", error);
    return res.status(500).json({ success: false, message: "Unable to load conversation." });
  }
};

exports.addMessage = async (req, res) => {
  try {
    const { message, sender, senderName } = req.body || {};
    if (!message || !String(message).trim()) return res.status(400).json({ success: false, message: "Message is required." });
    if (!["student", "counsellor"].includes(sender)) return res.status(400).json({ success: false, message: "Sender must be student or counsellor." });
    const student = await findStudent(req.params.studentId);
    if (!student) return res.status(404).json({ success: false, message: "Student not found." });
    let conversation = await Conversation.findOne({ student: student._id });
    if (!conversation) conversation = new Conversation({ student: student._id });
    conversation.messages.push({ message: String(message).trim(), sender, senderName: String(senderName || "").trim().slice(0, 80) });
    conversation.lastActivityAt = new Date();
    conversation.status = "open";
    await conversation.save();
    return res.status(201).json({ success: true, data: conversation });
  } catch (error) {
    console.error("Add message:", error);
    return res.status(500).json({ success: false, message: "Unable to send message." });
  }
};

exports.closeConversation = async (req, res) => {
  try {
    const student = await findStudent(req.params.studentId);
    if (!student) return res.status(404).json({ success: false, message: "Student not found." });
    const conversation = await Conversation.findOneAndUpdate({ student: student._id }, { status: "closed" }, { new: true, upsert: true, setDefaultsOnInsert: true });
    return res.json({ success: true, data: conversation });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Unable to close conversation." });
  }
};
