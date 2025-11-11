/**
 * User profile management types
 */

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  mobile?: string;
  enrollmentId?: string;
  active: boolean;
  flags?: any;
  createdAt: string;
  updatedAt?: string;
}

export interface UpdateEmailRequest {
  email: string;
}

export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateNotificationsRequest {
  email?: boolean;
  sms?: boolean;
  push?: boolean;
}

export interface UpdateRecoveryQuestionRequest {
  question: string;
  answer: string;
}

export interface CloseAccountResponse {
  success: boolean;
  message: string;
}

export interface UserInitializeResponse {
  theme?: any;
  logo?: string;
  features?: any;
  hostConfig?: any;
}
