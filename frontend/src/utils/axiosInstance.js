import axios from 'axios';
import { useAuthStore } from '@/stores/useAuthStore';
import { APP_ENV, NODE_URL_NO_VERSION, PLATEFORM_URL } from './constants';
 
const axiosInstance = axios.create({
  // Every caller passes an absolute URL (built from NODE_URL), so axios ignores
  // this baseURL for them. It only applies to relative paths — bound to the
  // env-driven host so a relative call can never silently escape to another
  // environment (the previous hardcoded prod URL was a cross-env data hazard).
  baseURL: NODE_URL_NO_VERSION,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});
 
// Attach the bearer token from the auth store to every outgoing request.
// (Unchanged from before — request behavior is identical, no API call is affected.)
axiosInstance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().user?.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
 
// Guarded so a burst of concurrent 401s triggers exactly one redirect.
let isRedirectingToLogin = false;
 
const redirectToLogin = () => {
  if (isRedirectingToLogin || typeof window === 'undefined') return;
  isRedirectingToLogin = true;
 
  const userName = useAuthStore.getState().user?.email || '';
  useAuthStore.getState().clearUser?.();
 
  const base = APP_ENV === 'development' ? '' : PLATEFORM_URL;
  window.location.href = `${base}/login?sessionExpired=true&userName=${userName}`;
};
 
// Successful responses pass through untouched. Auth failures are handled by
// status, with the standard distinction:
//   401 Unauthorized -> credentials missing/expired/invalid: the session is
//                       dead, so clear it and send the user to log in.
//   403 Forbidden    -> authenticated but not permitted for this resource:
//                       keep the session and let the caller surface the error.
// Everything else (incl. 5xx) is rejected as-is so callers can handle it.
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
 
    switch (status) {
      case 401:
        redirectToLogin();
        break;
      case 403:
        // Intentionally no logout/redirect — not an authentication failure.
        break;
      default:
        break;
    }
 
    return Promise.reject(error);
  }
);
 
export default axiosInstance;
 