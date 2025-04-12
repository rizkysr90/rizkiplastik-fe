// Interface matching your backend LoginRequest
export interface LoginRequest {
  username: string;
  password: string;
}

// Interface matching your backend LoginResponse
export interface LoginResponse {
  token: string;
}
