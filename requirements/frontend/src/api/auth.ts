import { postJson } from "./http";
import type { LoginResponse, SignupResponse } from "../../shared/auth.types";

export type LoginRequest = {
	email: string;
  	password: string;
};

export type SignupRequest = {
	email: string;
  	password: string;
	username: string;
};


export function login(req: LoginRequest) {
  return postJson<LoginResponse>("/auth/login", req);
}

export function signup(req: SignupRequest) {
  return postJson<SignupResponse>("/auth/signup", req);
}
