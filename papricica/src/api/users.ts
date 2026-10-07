import { api } from "./client";
import {UserDetails} from "@/types/auth";
import {ChangePasswordDto} from "@/types/user";

export async function getCurrentUser() : Promise<UserDetails> {

    const response = await api.get<UserDetails>(
        "api/v1/users/me"
    );

    return response.data;
}

export async function getRedeemMeal(amount: number){
    await api.get<void>(
         `/api/v1/users/redeem-meal?amount=${amount}`
    );
}

export async function forgotPassword(email: string) {
    await api.get<void>(
      `/api/v1/users/forgot-password?email=${email}`
    );
}

export async function changePassword(dto: ChangePasswordDto){
    await api.put<void>(
        "api/v1/users/change-password",
        dto
    );
}