import { useState, useEffect } from "react";
import {
    fetchUsers as fetchUsersService,
    createUser as createUserService,
    getUserById as getUserByIdService,
    updateUser as updateUserService,
    deleteUser as deleteUserService,
    getUserProfileById as getUserProfileByIdService,
    updateUserProfile as updateUserProfileService,
    type User,
    type UserProfile,
    type CreateUserInput,
    type UpdateUserInput,
} from "../services/userService";

export const useUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null); // State for user profile
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch all users
    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchUsersService();
            setUsers(data);
        } catch (err) {
            setError("Failed to fetch users");
            console.error("Fetch Users Error:", err);
        } finally {
            setLoading(false);
        }
    };

    // Create a new user
    const createUser = async (newUser: CreateUserInput) => {
        setLoading(true);
        setError(null);
        try {
            const createdUser = await createUserService(newUser);
            setUsers((prev) => [...prev, createdUser]);
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
            return await getUserByIdService(id);
        } catch (err) {
            setError("Failed to fetch user");
            console.error(err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Fetch user profile by ID (only name, bias, and avatarUrl)
    const getUserProfileById = async (id: number) => {
        setLoading(true);
        setError(null);
        try {
            const profile = await getUserProfileByIdService(id);
            setUserProfile(profile); // Store the profile in state
            return profile;
        } catch (err) {
            setError("Failed to fetch user profile");
            console.error(err);
            return null;
        } finally {
            setLoading(false);
        }
    };


    const updateUserProfile = async (
        id: number,
        updatedProfile: UserProfile
    ) => {
        setLoading(true);
        setError(null);
        try {
            const updatedUser = await updateUserProfileService(id, updatedProfile);
            setUserProfile((prev) => ({ ...prev, ...updatedProfile }));
            setUsers((prev) =>
                prev.map((user) =>
                    user.id === id
                        ? { ...user, ...updatedProfile }
                        : user
                )
            );
            return updatedUser;
        } catch (err) {
            setError("Failed to update user profile");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Update a user
    const updateUser = async (id: number, updatedData: UpdateUserInput) => {
        setLoading(true);
        setError(null);
        try {
            const updatedUser = await updateUserService(id, updatedData);
            setUsers((prev) =>
                prev.map((user) => (user.id === id ? { ...user, ...updatedUser } : user))
            );
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
            await deleteUserService(id);
            setUsers((prev) => prev.filter((user) => user.id !== id));
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
        userProfile, // Expose userProfile state
        loading,
        error,
        fetchUsers,
        createUser,
        getUserById,
        getUserProfileById,
        updateUser,
        updateUserProfile,
        deleteUser,
    };
};