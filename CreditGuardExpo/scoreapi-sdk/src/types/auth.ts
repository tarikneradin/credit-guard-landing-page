/**
 * Authentication-related types
 */

export interface LoginRequest {
  username: string;
  password: string;
}

export interface UserLoginRequest extends LoginRequest {
  customerToken?: string;
}

export interface CustomerLoginRequest extends LoginRequest {}

export interface DirectLoginRequest {
  apiKey: string;
  secret: string;
}

export interface DirectLoginResponse extends LoginResponse {
  host?: CustomerHost;
}

export interface CustomerHost {
  id: string;
  customerId: string;
  name: string;
  key: string;
  active: boolean;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  mobile?: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface UserLoginResponse extends LoginResponse {
  user: UserProfile;
}

export interface CustomerLoginResponse extends LoginResponse {
  customer: Customer;
}

export interface UserProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  mobile?: string;
  enrollmentId?: string;
  active: boolean;
  flags?: any;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  active: boolean;
  createdAt: string;
}

export interface TokenRefreshResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface PasswordRecoveryRequest {
  email: string;
}

export interface PasswordResetRequest {
  token: string;
  newPassword: string;
  securityAnswer?: string;
}
