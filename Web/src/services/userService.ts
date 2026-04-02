import api from "./api"; // Axios instance with interceptors

export interface User {
    id: number;
    name: string;
    username: string; 
    avatarKey?: string; 
    avatarUrl?: string; 
    bio?: string; // User's bio
    isAdmin: boolean;
    isTeacher: boolean;
    isStudent: boolean;
}

export interface UserProfile {
    name: string;
    avatarKey?: string;
    avatarUrl?: string; 
    bio?: string;
}

export interface CreateUserInput {
    name: string;
    username: string;
    password: string;
    avatarKey?: string; // Optional avatar key
    bio?: string; // Optional bio
    isAdmin?: boolean;
    isTeacher?: boolean;
    isStudent?: boolean;
}

export interface UpdateUserInput {
    name?: string;
    username?: string;
    password?: string;

    bio?: string;
    addRole?: "admin" | "teacher";
    removeRole?: "admin" | "teacher";
}

export interface UpdateUserProfileInput {
    name?: string;
    file?: File;
    bio?: string;
}

// Fetch all users
export const fetchUsers = async (): Promise<User[]> => {
    const response = await api.get("/users");
    return response.data;
};

// Create a new user
export const createUser = async (newUser: CreateUserInput): Promise<User> => {
    const response = await api.post("/users", newUser);
    return response.data;
};

// Get a user by ID
export const getUserById = async (id: number): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
};

// Update a user
export const updateUser = async (id: number, updatedData: UpdateUserInput): Promise<User> => {
    const response = await api.put(`/users/${id}`, updatedData);
    return response.data;
};

// Delete a user
export const deleteUser = async (id: number): Promise<void> => {
    await api.delete(`/users/${id}`);
};

// Update user profile (including avatar upload)
export const updateUserProfile = async (
    id: number,
    updatedData: UpdateUserProfileInput 
): Promise<UserProfile> => {
    const response = await api.patch(`/users/${id}/profile`, updatedData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data.user; // Return the updated user profile from the response
};

// Get user profile by ID
export const getUserProfileById = async (id: number): Promise<UserProfile> => {
    const response = await api.get(`/users/${id}/profile`);
    return response.data;
};