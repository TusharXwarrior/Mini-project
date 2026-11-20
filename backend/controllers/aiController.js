const mongoose = require("mongoose");
const Student = require("../models/Student");
const Conversation = require("../models/Conversation");
const Progress = require("../models/Progress");

exports.counsellingSuggestion = async (req, res) => {
  try {
    const id = req.params.studentId;
    let student = mongoose.Types.ObjectId.isValid(id) ? await Student.findById(id) : null;
    if (!student) student = await Student.findOne({ studentId: String(id).trim().toUpperCase() });
    if (!student) return res.status(404).json({ success: false, message: "Student not found." });

    const [chat, latestProgress] = await Promise.all([
      Conversation.findOne({ student: student._id }),
      Progress.findOne({ student: student._id }).sort({ recordedAt: -1 }),
    ]);
    const history = (chat?.messages || []).slice(-8).map((m) => ({ role: m.sender === "student" ? "user" : "assistant", content: m.message }));
    const context = {
      student: { name: student.name, attendance: student.attendance, cgpa: student.cgpa, previousCgpa: student.previousCgpa, assignmentCompletion: student.assignmentCompletion, backlogs: student.backlogs },
      latestCounsellorCheckpoint: latestProgress ? { wellbeing: latestProgress.wellbeing, notes: latestProgress.notes, actionPlan: latestProgress.actionPlan } : null,
    };
    const fallback = [
      `Hi ${student.name}, thanks for checking in. I wanted to understand how your studies have been going recently.`,
      Number(student.attendance) < 75 ? "I noticed attendance may need attention. Is there anything making it difficult to attend classes regularly?" : "Your attendance is a useful foundation. Which subjects or topics are you finding most challenging?",
      Number(student.cgpa) < Number(student.previousCgpa) ? "Your recent academic result seems lower than the previous one. What kind of academic support would help you most?" : "Let's identify one academic goal you would like to work towards before our next check-in.",
      "Would a short weekly follow-up and a practical study plan be helpful? You can share any concerns you feel comfortable discussing."
    ].join("\n\n");

    if (!process.env.AI_API_KEY) return res.json({ success: true, mode: "guided-template", reply: fallback });

    const base = (process.env.AI_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "");
    const response = await fetch(`${base}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.AI_API_KEY}` },
      body: JSON.stringify({
        model: process.env.AI_MODEL || "gpt-4o-mini",
        temperature: 0.4,
        messages: [
          { role: "system", content: "You are a supportive educational check-in assistant. Draft a short, empathetic message and 2-3 open questions for a human counsellor to review. Do not diagnose mental-health conditions, make dropout predictions, shame the student, or claim certainty. Do not expose sensitive internal scores. Encourage urgent human support if the student mentions immediate danger." },
          { role: "user", content: JSON.stringify({ context, recentConversation: history }) }
        ]
      })
    });
    if (!response.ok) throw new Error(`AI provider returned ${response.status}`);
    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content?.trim();
    if (!reply) throw new Error("AI provider returned an empty suggestion");
    return res.json({ success: true, mode: "ai", reply });
  } catch (error) {
    console.error("Counselling suggestion:", error);
    return res.status(502).json({ success: false, message: "Could not generate a counselling suggestion. Check the AI provider configuration." });
  }
};
