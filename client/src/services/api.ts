import axios, { AxiosHeaders, type AxiosError, type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';

const API_BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:5000/api/v1';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');

  if (token) {
    const headers = new AxiosHeaders(config.headers);
    headers.set('Authorization', `Bearer ${token}`);
    config.headers = headers;
  }

  return config;
});

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    const status = error.response?.status;

    if (status === 401) {
      localStorage.removeItem('authToken');
      window.location.assign('/login');
    }

    const message =
      (error.response?.data as { message?: string } | undefined)?.message ??
      error.message ??
      'Something went wrong while fetching the data.';

    return Promise.reject(new Error(message));
  }
);

export const getApiConfig = (config?: AxiosRequestConfig): AxiosRequestConfig => ({
  ...config,
  baseURL: API_BASE_URL,
});

export default api;
