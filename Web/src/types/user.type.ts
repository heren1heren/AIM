export type UserRole = "admin" | "teacher" | "student";

export interface User {
    id: number;
    name: string;
    username: string;
    password_hash: string;
    role: UserRole;
    created_at: string; // ISO timestamp from backend
}

export interface AdminCreateUserDTO {
    name: string;
    username: string;
    password: string;
    role: "admin" | "teacher" | "student";
}

export interface AdminUpdateUserDTO {
    name?: string;
    username?: string;
    password?: string;
    role?: "admin" | "teacher" | "student";
}
export interface CreateUserDTO {
    name: string;
    username: string;
    password: string;

}
export interface UpdateUserDTO {
    name?: string;
    username?: string;
    password?: string;

}
