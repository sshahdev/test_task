export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  login_count: number;
  pdf_download_count: number;
  last_activity_at: string | null;
  created_at: string;
}

export interface UserFormData {
  name: string;
  email: string;
  role: 'admin' | 'user';
  login_count: number;
  pdf_download_count: number;
  last_activity_at: string | null;
  created_at: string;
}

export interface UserActivity {
  id: string;
  userId: number;
  type: 'LOGIN' | 'DOWNLOAD';
  timestamp: string;
} 