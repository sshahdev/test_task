import { apiClient, ApiError } from '../utils/apiClient';
import { API_CONFIG } from '../config/api';
import { User, UserFormData, UserActivity } from '../types/user';

export class UserService {
  static async getAllUsers(): Promise<User[]> {
    try {
      const response = await apiClient.get(API_CONFIG.ENDPOINTS.USERS);
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, 'Failed to fetch users');
    }
  }

  static async getUserById(userId: string): Promise<User> {
    try {
      const response = await apiClient.get(`${API_CONFIG.ENDPOINTS.USERS}/${userId}`);
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, `Failed to fetch user with ID: ${userId}`);
    }
  }

  static async createUser(userData: UserFormData): Promise<User> {
    try {
      const response = await apiClient.post(API_CONFIG.ENDPOINTS.USERS, userData);
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, 'Failed to create user');
    }
  }

  static async updateUser(userId: string, userData: UserFormData): Promise<User> {
    try {
      const response = await apiClient.put(
        `${API_CONFIG.ENDPOINTS.USERS}/${userId}`,
        userData
      );
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, `Failed to update user with ID: ${userId}`);
    }
  }

  static async deleteUser(userId: string): Promise<void> {
    try {
      await apiClient.delete(`${API_CONFIG.ENDPOINTS.USERS}/${userId}`);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, `Failed to delete user with ID: ${userId}`);
    }
  }

  static async getUserActivities(userId: string): Promise<UserActivity[]> {
    try {
      const endpoint = API_CONFIG.ENDPOINTS.USER_ACTIVITIES.replace(':userId', userId);
      const response = await apiClient.get(endpoint);
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, `Failed to fetch activities for user ID: ${userId}`);
    }
  }

  static async generateUserReport(userId: string): Promise<Blob> {
    try {
      const endpoint = API_CONFIG.ENDPOINTS.USER_PDF.replace(':userId', userId);
      const response = await apiClient.get(endpoint, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, `Failed to generate PDF for user ID: ${userId}`);
    }
  }
} 