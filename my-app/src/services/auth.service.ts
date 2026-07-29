import axios from 'axios';
import type { AxiosError, AxiosRequestConfig } from 'axios';
import { TokenService } from './token.service';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const accessToken = TokenService.getAccessToken();
    if (accessToken) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let failedQueue: {
  resolve: (value?: unknown) => void;
  reject: (error: any) => void;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError & { config?: AxiosRequestConfig & { _retry?: boolean } }) => {
    const originalRequest = error.config!;
    const status = error.response?.status;

    if ((status === 401 || status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = TokenService.getRefreshToken();
      if (!refreshToken) {
        TokenService.clearTokens();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            const accessToken = token as string;
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      return new Promise((resolve, reject) => {
        axios
          .post<{ access: string; refresh: string }>(
            `${API_BASE_URL}/token/refresh/`,
            { refresh: refreshToken }
          )
          .then(({ data }) => {
            TokenService.setTokens(data);
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${data.access}`;
            processQueue(null, data.access);

            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers['Authorization'] = `Bearer ${data.access}`;
            resolve(apiClient(originalRequest));
          })
          .catch((refreshErr) => {
            processQueue(refreshErr, null);
            TokenService.clearTokens();
            window.location.href = '/login';
            reject(refreshErr);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }

    return Promise.reject(error);
  }
);

export const AuthService = {
  async signIn(username: string, password: string) {
    try {
      const response = await axios.post(`${API_BASE_URL}/token/`, { username, password });
      return response.data; // { access, refresh }
    } catch (error: any) {
      throw error.response?.data?.detail || 'Invalid username or password';
    }
  },
};

export default apiClient;