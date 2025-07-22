import { Types } from "mongoose";

export interface IAuthProvider {
    provider: string;
    providerId: string
}
export enum Role {
    USER = "USER",
    ADMIN = "ADMIN",
    SUPER_ADMIN = "SUPER_ADMIN",
    GUIDE = "GUIDE"
}

export interface IUser {
    name: string;
    email: string;
    password?: string;
    phone?: string;
    picture?: string;
    address?: string;
    isDeleted?: string;
    isAcive?: "ACTIVE" | "INACTIVE" | "BLOCK";
    isVerified?: string;
    auths: IAuthProvider[];
    role: Role;
    bookings?: Types.ObjectId[];
    guides?: Types.ObjectId[];
}