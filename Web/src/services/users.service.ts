import api from "./api";
import type { User } from "../types/user";

export async function getUsers(): Promise<User[]> {
    const res = await api.get("/users");
    return res.data;
}

export async function createUser(data: Partial<User>) {
    const res = await api.post("/users", data);
    return res.data;
}

export async function updateUser(id: number, data: Partial<User>) {
    const res = await api.put(`/users/${id}`, data);
    return res.data;
}

export async function deleteUser(id: number) {
    const res = await api.delete(`/users/${id}`);
    return res.data;
}
