import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

export const getStudents = async () => {
  const response = await apiClient.get("/students");
  return response.data;
};

export const getStudentById = async (id) => {
  const response = await apiClient.get(`/students/${id}`);
  return response.data;
};

export const createStudent = async (studentData) => {
  const response = await apiClient.post("/students", studentData);
  return response.data;
};

export const deleteStudent = async (id) => {
  const response = await apiClient.delete(`/students/${id}`);
  return response.data;
};

export const checkHealth = async () => {
  const response = await apiClient.get("/health");
  return response.data;
};

// Conversation & Chat APIs
export const getConversation = async (studentId) => {
  const response = await apiClient.get(`/conversations/${studentId}`);
  return response.data;
};

export const sendConversationMessage = async (studentId, messageData) => {
  const response = await apiClient.post(`/conversations/${studentId}/messages`, messageData);
  return response.data;
};

export const getAiSuggestedResponses = async (studentId) => {
  const response = await apiClient.post(`/conversations/${studentId}/ai-suggest`);
  return response.data;
};

// Progress Tracking APIs
export const getProgressHistory = async (studentId) => {
  const response = await apiClient.get(`/progress/${studentId}`);
  return response.data;
};

export const recordStudentProgress = async (studentId, progressData) => {
  const response = await apiClient.post(`/progress/${studentId}`, progressData);
  return response.data;
};

export const getProgressComparison = async (studentId) => {
  const response = await apiClient.get(`/progress/${studentId}/comparison`);
  return response.data;
};

export default apiClient;
