import { Types } from "mongoose";

export interface IAuthProvider {
    provider: "google" | "credentials";
    providerId: string
}
export enum Role {
    USER = "USER",
    ADMIN = "ADMIN",
    SUPER_ADMIN = "SUPER_ADMIN",
    GUIDE = "GUIDE"
}

export interface IUser {
    _id?: string
    name: string;
    email: string;
    password?: string;
    phone?: string;
    picture?: string;
    address?: string;
    isDeleted?: string;
    isActive?: "ACTIVE" | "INACTIVE" | "BLOCK";
    isVerified?: boolean;
    auths: IAuthProvider[];
    role: Role;
    bookings?: Types.ObjectId[];
    guides?: Types.ObjectId[];
}