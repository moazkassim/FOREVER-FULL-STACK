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

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (!original) {
      return Promise.reject(error);
    }

    const isRefreshEndpoint = original.url?.includes("/api/user/refresh");
    const isLoginEndpoint = original.url?.includes("/api/user/login");
    const isRegisterEndpoint = original.url?.includes("/api/user/register");

    if (isRefreshEndpoint || isLoginEndpoint || isRegisterEndpoint) {
      return Promise.reject(error);
    }

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
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default api;
