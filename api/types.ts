import { AxiosError } from 'axios';

export interface User {
  id: number;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: null | boolean;
  role: number;
  createdAt: string;
  updatedAt: string;
}

export interface Article {
  id: number;
  title: string;
  body: string;
  user: User;
  published_at: string;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: number;
  message: string;
  user: User;
  published_at: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResult {
  jwt: string;
  user: User;
}

type AuthErrorData = {
  message: {
    id: string;
    message: string;
  }[];
}[];

export type AuthError = AxiosError<{
  statusCode: number;
  error: string;
  message: AuthErrorData;
  data: AuthErrorData;
}>;
