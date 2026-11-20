const Message = require("../models/Conversation");
const Student = require("../models/Student");

// @desc    Get messages for a student
// @route   GET /api/conversations/:studentId
exports.getConversation = async (req, res) => {
  try {
    const studentId = req.params.studentId.trim().toUpperCase();
    const messages = await Message.find({ studentId }).sort({ timestamp: 1 });

    return res.status(200).json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    console.error("Error fetching conversation:", error);
    return res.status(500).json({
      success: false,
      message: "Server error: Unable to retrieve conversation.",
    });
  }
};

// @desc    Send a message (student or counsellor)
// @route   POST /api/conversations/:studentId/messages
exports.sendMessage = async (req, res) => {
  try {
    const studentId = req.params.studentId.trim().toUpperCase();
    const { sender, senderName, text, isAiAssisted } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message text cannot be empty.",
      });
    }

    const message = new Message({
      studentId,
      sender: sender === "counsellor" ? "counsellor" : "student",
      senderName: senderName || (sender === "counsellor" ? "Academic Counsellor" : "Student"),
      text: text.trim(),
      isAiAssisted: Boolean(isAiAssisted),
      timestamp: new Date(),
    });

    const savedMessage = await message.save();

    return res.status(201).json({
      success: true,
      data: savedMessage,
    });
  } catch (error) {
    console.error("Error sending message:", error);
    return res.status(500).json({
      success: false,
      message: "Server error: Unable to send message.",
    });
  }
};

// @desc    AI Counselling Assistant: Generate suggested responses for counsellor
// @route   POST /api/conversations/:studentId/ai-suggest
exports.getAiSuggestedResponses = async (req, res) => {
  try {
    const studentId = req.params.studentId.trim().toUpperCase();
    const student = await Student.findOne({ studentId });
    const lastStudentMessage = await Message.findOne({
      studentId,
      sender: "student",
    }).sort({ timestamp: -1 });

    const studentName = student?.name || "Student";
    const att = student ? student.attendance : 75;
    const backlogs = student ? student.backlogs : 0;
    const msgContext = lastStudentMessage ? lastStudentMessage.text.toLowerCase() : "";

    // Generate smart context-aware suggestions
    const suggestions = [];

    if (msgContext.includes("exam") || msgContext.includes("stress") || msgContext.includes("hard") || msgContext.includes("difficult")) {
      suggestions.push({
        title: "Academic Reassurance & Study Plan",
        text: `Hi ${studentName}, I completely understand that exam preparation can feel overwhelming. Let's break down your coursework into manageable milestones together this week. Would tomorrow at 3 PM work for a quick review?`,
      });
    }

    if (att < 75) {
      suggestions.push({
        title: "Attendance Support & Catch-Up Plan",
        text: `Hello ${studentName}, I noticed your attendance is currently at ${att}%. We want to help you stay on track for semester clearance. Please let me know if any personal or commuting challenges are affecting your schedule so we can support you.`,
      });
    } else {
      suggestions.push({
        title: "Encouraging Progress Check-in",
        text: `Hi ${studentName}, thank you for reaching out! Your current attendance is steady at ${att}%. Let's discuss your upcoming internal evaluations and ensure you have all needed course materials.`,
      });
    }

    if (backlogs > 0) {
      suggestions.push({
        title: "Remedial & Backlog Clearance Strategy",
        text: `Regarding your subject backlogs, the department is conducting remedial tutoring sessions starting next Tuesday. I strongly encourage you to attend so we can clear them smoothly before end-terms.`,
      });
    } else {
      suggestions.push({
        title: "Mentorship & Career Guidance",
        text: `You have maintained zero backlogs, which is commendable! Keep up the focus, and feel free to drop by whenever you want advice on technical electives or internship preparation.`,
      });
    }

    suggestions.push({
      title: "Open Empathy & Wellbeing Inquiry",
      text: `Hi ${studentName}, how have you been feeling overall with the semester pace? Remember our student support cell is always here if you ever need someone to speak with.`,
    });

    return res.status(200).json({
      success: true,
      suggestions: suggestions.slice(0, 3),
    });
  } catch (error) {
    console.error("AI Assistant suggestion error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error: Unable to generate AI suggestions.",
    });
  }
};
