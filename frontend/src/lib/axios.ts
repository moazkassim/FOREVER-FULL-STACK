import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL as string,
  withCredentials: true,
});

let accessToken = "";
export const setAccessToken = (token: string) => {
  accessToken = token;
};
export const getAccessToken = () => accessToken;

api.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

// ✅ Prevent multiple simultaneous refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// ✅ Prevent redirect loop
let isRedirecting = false;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (!original) return Promise.reject(error);

    // ✅ Skip refresh for auth endpoints
    const isAuthEndpoint =
      original.url?.includes("/api/user/refresh") ||
      original.url?.includes("/api/user/login") ||
      original.url?.includes("/api/user/register");

    if (isAuthEndpoint) {
      return Promise.reject(error);
    }

    // ✅ Only handle 401 once per request
    if (error.response?.status === 401 && !original._retry) {
      if (isRefreshing) {
        // Queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            original.headers = original.headers ?? {};
            original.headers.Authorization = `Bearer ${token}`;
            return api(original);
          })
          .catch((err) => Promise.reject(err));
      }

      original._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/user/refresh`,
          {},
          { withCredentials: true },
        );

        setAccessToken(data.token);
        processQueue(null, data.token);

        original.headers = original.headers ?? {};
        original.headers.Authorization = `Bearer ${data.token}`;
        return api(original);
      } catch (refreshError) {
        processQueue(refreshError, null);
        setAccessToken("");

        // ✅ Only redirect if not already on login page AND not already redirecting
        if (!window.location.pathname.includes("/login") && !isRedirecting) {
          isRedirecting = true;
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;
