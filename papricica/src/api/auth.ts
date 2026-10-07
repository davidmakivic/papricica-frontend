import { api } from "./client";
import {
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    RefreshTokenDto,
} from "@/types/auth";

export async function login(credentials: LoginRequest)
    : Promise<LoginResponse> {
    const response = await api.post<LoginResponse>(
        "/api/v1/users/login",
        credentials
    );

    return response.data;
}

export async function logout(refreshToken: RefreshTokenDto) {
    await api.delete<void>(
        "/api/v1/users/logout",
        { data: refreshToken}
    );
}

export async function registerUser(user: RegisterRequest): Promise<void> {
    const response = await api.post<void>(
        "/api/v1/users",
        user
    );
}