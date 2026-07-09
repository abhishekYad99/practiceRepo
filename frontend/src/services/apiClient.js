import axios from "axios";
import { useAuthStore } from "@/stores/useAuthStore";

/**
 * Shared Axios instance for all API calls.
 *
 * The base URL comes from NEXT_PUBLIC_API_BASE_URL (see .env.example).
 * Point it at your own mockapi.io project.
 *
 * All feature code should import THIS client from the service files
 * (taskService, documentService, userService) — never call axios or
 * fetch directly from components.
 */
console.log("API BASE URL =", process.env.NEXT_PUBLIC_API_BASE_URL);
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

console.log("Axios Base URL =", apiClient.defaults.baseURL);

// TODO (optional): add interceptors here for centralised error handling / logging.


// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {

    const token = useAuthStore.getState().user?.accessToken;

    console.log("Token =>", token);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;







