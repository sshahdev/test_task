import axios, { AxiosInstance, AxiosError } from 'axios';
import { API_CONFIG } from '../config/api';

class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const message = error.response?.data.message || 'An unexpected error occurred';
    const status = error.response?.status || 500;
    throw new ApiError(status, message, error.response?.data);
  }
);

export { apiClient, ApiError }; 