import axios from "axios";

// 🔥 YOUR FASTAPI BACKEND URL
const BASE_URL = "http://127.0.0.1:8000";

const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const GlobalApi = {
  // ✅ CREATE
  SaveResume: (data) => axiosClient.post("/save", data),

  // ✅ READ (single)
  GetResumeById: (id) => axiosClient.get(`/resume/${id}`),

  // ✅ READ (all)
  GetAllResumes: () => axiosClient.get("/resumes"),

  // ✅ UPDATE
  UpdateResume: (id, data) => axiosClient.put(`/resume/${id}`, data),

  // ✅ DELETE
  DeleteResume: (id) => axiosClient.delete(`/resume/${id}`),

  // 🤖 AI ANALYSIS
  AnalyzeResume: (data) => axiosClient.post("/analyze", data),

  // 💼 JOB RECOMMENDATION
  GetJobs: (data) => axiosClient.post("/jobs", data),
};

export default GlobalApi;
