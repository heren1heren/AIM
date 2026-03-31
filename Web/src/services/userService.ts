import api from "./api"; // Axios instance with interceptors

export interface User {
    id: number;
    name: string; // User's name
    username: string; // User's username
    avatarKey?: string; // User's avatar key (replaces avatarUrl)
    bio?: string; // User's bio
    isAdmin: boolean;
    isTeacher: boolean;
    isStudent: boolean;
}

export interface UserProfile {
    name: string;
    avatarKey?: string; // Avatar key for fetching signed URL
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
    avatarKey?: string; // Optional avatar key
    bio?: string;
    addRole?: "admin" | "teacher";
    removeRole?: "admin" | "teacher";
}

export interface UpdateUserProfileInput {
    name?: string;
    avatarKey?: string; // Optional avatar key
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

// Update user profile (name, bio, or avatarKey)
export const updateUserProfile = async (
    id: number,
    updatedData: UpdateUserProfileInput
): Promise<User> => {
    const response = await api.patch(`/users/${id}/profile`, updatedData); // Use PATCH for partial updates
    return response.data;
};

// Get user profile by ID (only name, bio, and avatarKey)
export const getUserProfileById = async (id: number): Promise<UserProfile> => {
    const response = await api.get(`/users/${id}/profile`);
    return response.data;
};