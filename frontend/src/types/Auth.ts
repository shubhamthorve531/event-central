export interface LoginResponse {
  token: string;
  role: string;
  user?: {
    id: number;
    email: string;
    fullname: string;
  };
}

export interface RegisterResponse {
  message: string;
  userId?: number;
}