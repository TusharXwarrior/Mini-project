import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
const apiClient = axios.create({ baseURL: API_BASE_URL, headers: { "Content-Type": "application/json" }, timeout: 15000 });

export const getStudents = async () => (await apiClient.get("/students")).data;
export const getStudentById = async (id) => (await apiClient.get(`/students/${id}`)).data;
export const createStudent = async (studentData) => (await apiClient.post("/students", studentData)).data;
export const deleteStudent = async (id) => (await apiClient.delete(`/students/${id}`)).data;
export const checkHealth = async () => (await apiClient.get("/health")).data;
export const getConversation = async (studentId) => (await apiClient.get(`/conversations/${studentId}`)).data;
export const sendConversationMessage = async (studentId, payload) => (await apiClient.post(`/conversations/${studentId}/messages`, payload)).data;
export const getStudentProgress = async (studentId) => (await apiClient.get(`/progress/${studentId}`)).data;
export const addProgressRecord = async (studentId, payload) => (await apiClient.post(`/progress/${studentId}`, payload)).data;
export const askCounsellingAI = async (studentId) => (await apiClient.post(`/ai/counselling-suggestion/${studentId}`)).data;
export default apiClient;
