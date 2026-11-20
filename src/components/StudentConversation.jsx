import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  getConversation,
  sendConversationMessage,
  getAiSuggestedResponses,
} from "../services/api";
import {
  Send,
  Sparkles,
  User,
  GraduationCap,
  RefreshCw,
  Loader2,
  Clock,
  Bot,
} from "lucide-react";

export default function StudentConversation({ student }) {
  const studentId = student?.studentId || student?.id;
  const studentName = student?.name || "Student";

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [activeRole, setActiveRole] = useState("counsellor"); // "counsellor" or "student"
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [showAiBar, setShowAiBar] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMessages = useCallback(async () => {
    if (!studentId) return;
    try {
      const res = await getConversation(studentId);
      if (res && res.success) {
        setMessages(res.data || []);
      }
    } catch (err) {
      console.error("Error loading conversation:", err);
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    let isCancelled = false;
    const loadInit = async () => {
      if (!studentId) return;
      try {
        const res = await getConversation(studentId);
        if (!isCancelled && res && res.success) {
          setMessages(res.data || []);
        }
      } catch (err) {
        if (!isCancelled) console.error("Error loading conversation:", err);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    };
    loadInit();
    return () => {
      isCancelled = true;
    };
  }, [studentId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (customText = null, isAi = false) => {
    const textToSend = customText !== null ? customText : inputText;
    if (!textToSend.trim() || isSending) return;

    setIsSending(true);
    try {
      const payload = {
        sender: activeRole,
        senderName: activeRole === "counsellor" ? "Academic Counsellor" : studentName,
        text: textToSend.trim(),
        isAiAssisted: isAi,
      };

      const res = await sendConversationMessage(studentId, payload);
      if (res && res.success) {
        setMessages((prev) => [...prev, res.data]);
        if (customText === null) {
          setInputText("");
        }
      }
    } catch (err) {
      console.error("Error sending message:", err);
      alert("Failed to send message. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const handleFetchAiSuggestions = async () => {
    setShowAiBar(true);
    setLoadingSuggestions(true);
    try {
      const res = await getAiSuggestedResponses(studentId);
      if (res && res.success) {
        setSuggestions(res.suggestions || []);
      }
    } catch (err) {
      console.error("Error loading suggestions:", err);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleApplySuggestion = (text) => {
    setInputText(text);
    setShowAiBar(false);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col h-[620px]">
      {/* Chat Header */}
      <div className="p-4 sm:px-6 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900">
              Student ↔ Counsellor Conversation
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 text-blue-800">
              {studentId}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Individual persistent chat history for academic guidance & wellbeing.
          </p>
        </div>

        {/* View Toggle (Counsellor vs Student View) */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs text-slate-500 font-medium">Viewing as:</span>
          <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5 text-xs font-semibold shadow-2xs">
            <button
              type="button"
              onClick={() => setActiveRole("counsellor")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition ${
                activeRole === "counsellor"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              Counsellor
            </button>
            <button
              type="button"
              onClick={() => setActiveRole("student")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition ${
                activeRole === "student"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              Student
            </button>
          </div>
          <button
            onClick={fetchMessages}
            type="button"
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition"
            title="Refresh messages"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Scroll View */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/50">
        {loading ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            <p className="text-xs">Loading conversation history from MongoDB...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2 py-12">
            <Bot className="w-10 h-10 text-slate-300" />
            <p className="text-sm font-medium text-slate-600">No messages yet</p>
            <p className="text-xs text-slate-400 max-w-sm text-center">
              Start the conversation by sending an academic inquiry, encouragement note, or study
              advice.
            </p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isCounsellor = msg.sender === "counsellor";
            return (
              <div
                key={msg._id || index}
                className={`flex gap-3 max-w-[85%] sm:max-w-[75%] ${
                  isCounsellor ? "ml-auto flex-row-reverse" : "mr-auto"
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0 text-xs font-bold shadow-xs ${
                    isCounsellor ? "bg-blue-600" : "bg-indigo-600"
                  }`}
                >
                  {isCounsellor ? "C" : studentName.charAt(0)}
                </div>

                {/* Message Body */}
                <div className="space-y-1">
                  <div
                    className={`flex items-center gap-2 text-[11px] text-slate-400 ${
                      isCounsellor ? "justify-end" : "justify-start"
                    }`}
                  >
                    <span className="font-semibold text-slate-700">{msg.senderName}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    {msg.isAiAssisted && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] bg-amber-50 text-amber-700 border border-amber-200">
                        <Sparkles className="w-2.5 h-2.5" /> AI Assisted
                      </span>
                    )}
                  </div>

                  <div
                    className={`p-3.5 rounded-2xl text-sm leading-relaxed ${
                      isCounsellor
                        ? "bg-blue-600 text-white rounded-tr-xs"
                        : "bg-white text-slate-800 border border-slate-200 rounded-tl-xs shadow-2xs"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* AI Counselling Assistant Suggestions Drawer */}
      {showAiBar && (
        <div className="bg-amber-50/70 border-t border-amber-200 p-3 sm:px-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              AI Counselling Assistant (Suggested Responses)
            </span>
            <button
              onClick={() => setShowAiBar(false)}
              className="text-xs text-amber-700 hover:text-amber-900 font-medium"
            >
              Close
            </button>
          </div>

          {loadingSuggestions ? (
            <div className="py-2 text-center text-xs text-amber-700 flex items-center justify-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Analyzing student risk profile & generating tailored responses...
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {suggestions.map((sug, i) => (
                <div
                  key={i}
                  className="bg-white p-2.5 rounded-lg border border-amber-200 hover:border-amber-400 transition cursor-pointer text-left shadow-2xs group"
                  onClick={() => handleApplySuggestion(sug.text)}
                >
                  <span className="text-[11px] font-bold text-amber-800 block mb-1 group-hover:text-amber-900">
                    {sug.title}
                  </span>
                  <p className="text-xs text-slate-600 line-clamp-2">{sug.text}</p>
                  <span className="text-[10px] text-blue-600 font-medium block mt-1">
                    Click to insert
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Input Controls */}
      <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="space-y-2"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>
              Typing as:{" "}
              <strong className={activeRole === "counsellor" ? "text-blue-700" : "text-indigo-700"}>
                {activeRole === "counsellor" ? "Academic Counsellor" : studentName}
              </strong>
            </span>

            {/* AI Assistant trigger button */}
            {activeRole === "counsellor" && (
              <button
                type="button"
                onClick={handleFetchAiSuggestions}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-300 px-2.5 py-1 rounded-md transition shadow-2xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                AI Suggested Responses
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder={
                activeRole === "counsellor"
                  ? "Type your counselling advice or choose an AI suggestion..."
                  : "Type student query, reason for absence, or concern..."
              }
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-4 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isSending}
              className={`px-4 py-2.5 rounded-lg text-white font-medium text-sm flex items-center gap-1.5 shadow-xs transition ${
                activeRole === "counsellor"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-indigo-600 hover:bg-indigo-700"
              } ${!inputText.trim() || isSending ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              {isSending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">Send</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
