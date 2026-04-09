export type AuthSuccessResponse = {
  ok: true;
  message: string;
  id: number;
  username: string;
  email: string;
};

export type AuthErrorResponse = {
  ok: false;
  message: string;
};

export type LoginResponse = AuthSuccessResponse | AuthErrorResponse;

export type SignupResponse = AuthSuccessResponse | AuthErrorResponse;
