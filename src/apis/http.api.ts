import { COOKIE_CONST } from "@constants";
import { CookieStorageUtil } from "@utils";
import axios from "axios";

const http = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
  baseURL: import.meta.env.VITE_BASE_API_URL,
});

http.interceptors.request.use((config) => {
  const sessionToken = CookieStorageUtil.get(COOKIE_CONST.SESSION);

  if (sessionToken && !config?.headers.Authorization) {
    config.headers.Authorization = `Bearer ${sessionToken}`;
  }
  return config;
});

http.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      CookieStorageUtil.delete(COOKIE_CONST.SESSION);
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    throw error.response.data;
  }
);

export default http;
