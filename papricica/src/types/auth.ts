import { Role } from "./user";

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    role: Role;
}

export interface UserDetails {
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    points: number;
}

export interface RefreshTokenDto {
    refreshToken: string;
}