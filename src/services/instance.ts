import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { ROUTE_CONSTANTS } from "@constants/RouteConstants";

export const instance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// 중복 refresh 방지용 상태
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: AxiosError | null) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(null)));
  failedQueue = [];
};

instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => config,
  (error: AxiosError) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    if (error.code === "ECONNABORTED") {
      window.location.href = "/error";
      return Promise.reject(error);
    }

    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      // refresh 자체가 401 → refresh token도 만료 → 로그인으로
      if (originalRequest.url?.includes("/auth/refresh")) {
        window.location.href = ROUTE_CONSTANTS.LOGIN;
        return Promise.reject(error);
      }

      // 이미 refresh 진행 중 → 큐에 추가하고 대기
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => instance(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // instance 대신 순수 axios로 호출 (인터셉터 재진입 방지)
        const baseUrl = (import.meta.env.VITE_BASE_URL ?? "").replace(
          /\/+$/,
          ""
        );
        await axios.post(
          `${baseUrl}/api/v3/spring/auth/refresh`,
          {},
          { withCredentials: true }
        );
        processQueue(null);
        return instance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as AxiosError);
        window.location.href = ROUTE_CONSTANTS.LOGIN;
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
