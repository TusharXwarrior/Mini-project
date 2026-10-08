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

export default apiClient;
