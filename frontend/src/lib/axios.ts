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

// ✅ Endpoints that should NEVER trigger refresh
const AUTH_ENDPOINTS = [
  "/api/user/login",
  "/api/user/register",
  "/api/user/refresh",
  "/api/user/logout",
  "/api/user/forgot-password",
  "/api/user/reset-password",
  "/api/user/verify-reset-token",
  "/api/user/admin",
];

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (!original) return Promise.reject(error);

    const url = original.url || "";
    const isAuthEndpoint = AUTH_ENDPOINTS.some((endpoint) =>
      url.includes(endpoint),
    );

    // ✅ Let auth errors propagate to the caller
    if (isAuthEndpoint) {
      return Promise.reject(error);
    }

    // Refresh token for other 401s
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/user/refresh`,
          {},
          { withCredentials: true },
        );

        setAccessToken(data.token);
        original.headers = original.headers ?? {};
        original.headers.Authorization = `Bearer ${data.token}`;

        return api(original);
      } catch {
        setAccessToken("");
      }
    }

    return Promise.reject(error);
  },
);

export default api;
