export interface ApiError {
  code: number;
  message: string;
}

export interface ApiResponse {
  isSucceeded: boolean;
  content: any;
  error: ApiError;
}
