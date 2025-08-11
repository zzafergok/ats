export interface UserProfile {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  errors?: any[];
}

// Re-export CVTemplateData from cvTemplate.types.ts
export { CVTemplateData } from './cvTemplate.types';
