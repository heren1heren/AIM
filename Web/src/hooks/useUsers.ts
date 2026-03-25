import { useState, useEffect } from "react";
import api from "../services/api"; // Axios instance with interceptors

interface User {
    id: number;
    name: string; // Added name field
    username: string;
    isAdmin: boolean;
    isTeacher: boolean;
    isStudent: boolean;
    profile?: {
        nickname?: string;
        avatar?: string;
        bias?: string;
    };
}

interface CreateUserInput {
    name: string;
    username: string;
    password: string;
    isAdmin?: boolean;
    isTeacher?: boolean;
    isStudent?: boolean;
    profile?: {
        nickname?: string;
        avatar?: string;
        bias?: string;
    };
}

interface UpdateUserInput {
    name?: string;
    username?: string;
    password?: string;
    addRole?: "admin" | "teacher";
    removeRole?: "admin" | "teacher";
    profile?: {
        nickname?: string;
        avatar?: string;
        bias?: string;
    };
}

export const useUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch all users
    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            console.log("Fetching users with accessToken:", localStorage.getItem("accessToken")); // Debugging log
            const response = await api.get("/users");
            setUsers(response.data);
        } catch (err) {
            setError("Failed to fetch users");
            console.error("Fetch Users Error:", err); // Log the error for debugging
        } finally {
            setLoading(false);
        }
    };

    // Create a new user
    const createUser = async (newUser: CreateUserInput) => {
        setLoading(true);
        setError(null);
        try {
            console.log("Creating user with data:", newUser); // Debugging log
            const response = await api.post("/users", newUser); // Send new user data to the backend
            setUsers((prev) => [...prev, response.data]); // Add the new user to the state
        } catch (err) {
            setError("Failed to create user");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Get a user by ID
    const getUserById = async (id: number) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get(`/users/${id}`);
            return response.data; // Return the user data
        } catch (err) {
            setError("Failed to fetch user");
            console.error(err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Update a user
    const updateUser = async (id: number, updatedData: UpdateUserInput) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.put(`/users/${id}`, updatedData); // Send updated data to the backend
            setUsers((prev) =>
                prev.map((user) => (user.id === id ? { ...user, ...response.data } : user))
            ); // Update the user in the state
        } catch (err) {
            setError("Failed to update user");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Delete a user
    const deleteUser = async (id: number) => {
        setLoading(true);
        setError(null);
        try {
            await api.delete(`/users/${id}`); // Send delete request to the backend
            setUsers((prev) => prev.filter((user) => user.id !== id)); // Remove the user from the state
        } catch (err) {
            setError("Failed to delete user");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch users when the hook is used
    useEffect(() => {
        fetchUsers();
    }, []);

    return {
        users,
        loading,
        error,
        fetchUsers,
        createUser,
        getUserById,
        updateUser,
        deleteUser,
    };
};