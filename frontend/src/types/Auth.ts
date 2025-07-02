export interface LoginResponse {
  token: string;
  email: string;
  fullName: string;
  role: string;
}

export interface RegisterResponse {
  message: string;
  userId?: number;
}