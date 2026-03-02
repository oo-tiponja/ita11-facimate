import axios from "axios";

const API_BASE = "http://localhost:8080/api";

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error
      console.error("API Error:", error.response.data);
      return Promise.reject(error.response.data.message || "An error occurred");
    } else if (error.request) {
      // Request made but no response
      console.error("Network Error:", error.request);
      return Promise.reject("Network error. Please check your connection.");
    } else {
      // Something else happened
      console.error("Error:", error.message);
      return Promise.reject(error.message);
    }
  },
);

export const api = {
  // Dashboard
  getDashboard: () => apiClient.get("/rotation/dashboard"),

  // Rotation Actions
  skipToNext: (ceremonyId) => apiClient.post(`/rotation/skip/${ceremonyId}`),
  assignFacilitator: (ceremonyId, memberId) => apiClient.post("/rotation/assign", { ceremonyId, memberId }),
  retainFacilitator: (ceremonyId) => apiClient.post(`/rotation/retain/${ceremonyId}`),

  // Members
  getMembers: () => apiClient.get("/members"),
  addMember: (member) => apiClient.post("/members", member),
  updateMember: (id, member) => apiClient.put(`/members/${id}`, member),
  deleteMember: (id) => apiClient.delete(`/members/${id}`),
  toggleActive: (id) => apiClient.put(`/members/${id}/toggle-active`),

  // Ceremonies
  getCeremonies: () => apiClient.get("/ceremonies"),
  getCeremony: (id) => apiClient.get(`/ceremonies/${id}`),
  createCeremony: (ceremony) => apiClient.post("/ceremonies", ceremony),
  updateCeremony: (id, ceremony) => apiClient.put(`/ceremonies/${id}`, ceremony),
  deleteCeremony: (id) => apiClient.delete(`/ceremonies/${id}`),

  // Notifications (if you want to add this)
  getNotifications: () => apiClient.get("/notifications"),
  markAsRead: (id) => apiClient.put(`/notifications/${id}/read`),

  // Meeting Rooms (if you want to add this)
  getMeetingRooms: () => apiClient.get("/meeting-rooms"),
};

export default api;
