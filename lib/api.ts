import axios from "axios";
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      Cookies.remove("token");
      Cookies.remove("user");
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

// ===== AUTH =====
export const authApi = {
  login: (data: { username: string; password: string }) =>
    api.post("/users/login", data),
  register: (data: { username: string; password: string; role?: string }) =>
    api.post("/users/register", data),
  getProfile: () => api.get("/users/profile"),
  updateProfile: (data: { username: string }) =>
    api.put("/users/profile", data),
  changePassword: (data: { oldPassword: string; newPassword: string }) =>
    api.put("/users/profile/change-password", data),
};

// ===== REPORTS =====
export const reportApi = {
  getAll: (params?: {
    status?: string;
    category_id?: number;
    page?: number;
    limit?: number;
  }) => api.get("/reports", { params }),
  getById: (id: number) => api.get(`/reports/${id}`),
  create: (formData: FormData) =>
    api.post("/reports", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  update: (id: number, formData: FormData) =>
    api.put(`/reports/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  delete: (id: number) => api.delete(`/reports/${id}`),
  updateStatus: (id: number, status: string) =>
    api.patch(`/reports/${id}/status`, { status }),
  getCategories: () => api.get("/reports/categories"),
  createCategory: (category_name: string) =>
    api.post("/reports/categories", { category_name }),
};

// ===== COMMENTS =====
export const commentApi = {
  getByReport: (reportId: number, params?: { page?: number; limit?: number }) =>
    api.get(`/comments/report/${reportId}`, { params }),
  create: (data: { body: string; public_report_id: number }) =>
    api.post("/comments", data),
  update: (id: number, body: string) => api.put(`/comments/${id}`, { body }),
  delete: (id: number) => api.delete(`/comments/${id}`),
};

// ===== USERS (Super Admin) =====
export const userApi = {
  getAll: () => api.get("/users/admin/users"),
  getById: (id: number) => api.get(`/users/admin/users/${id}`),
  create: (data: { username: string; password: string; role: string }) =>
    api.post("/users/admin/users", data),
  update: (id: number, data: { username: string; role: string }) =>
    api.put(`/users/admin/users/${id}`, data),
  delete: (id: number) => api.delete(`/users/admin/users/${id}`),
};

export const notificationApi = {
  getAll: () => api.get("/notifications"),
  markAsRead: (id: number) => api.patch(`/notifications/${id}/read`),
  markAllAsRead: () => api.patch("/notifications/read-all"),
};

export default api;
