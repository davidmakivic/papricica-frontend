export enum Role {
    USER = "USER",
    ADMIN = "ADMIN",
}

export enum UserStatus {
    UNLOCKED = "UNLOCKED",
    LOCKED = "LOCKED",
    UNVERIFIED = "UNVERIFIED",
}

export interface User {
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    role: Role;
    status: UserStatus;
}

export interface ChangePasswordDto {
    oldPassword: string;
    newPassword: string;
}