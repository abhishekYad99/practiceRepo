import axios from "axios";

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
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// TODO (optional): add interceptors here for centralised error handling / logging.

export default apiClient;
