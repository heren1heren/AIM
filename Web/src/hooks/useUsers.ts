import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    fetchUsers as fetchUsersService,
    createUser as createUserService,
    getUserById as getUserByIdService,
    updateUser as updateUserService,
    deleteUser as deleteUserService,
    getUserProfileById as getUserProfileByIdService,
    updateUserProfile as updateUserProfileService,
    type User,
    type CreateUserInput,
    type UpdateUserInput,
    type UpdateUserProfileInput,
} from "../services/userService";

export const useUsers = () => {
    const queryClient = useQueryClient();

    // Fetch all users
    const { data: users, isLoading: usersLoading, isError: usersError } = useQuery({
        queryKey: ["users"],
        queryFn: fetchUsersService,
    });

    // Fetch user profile by ID
    const useUserProfile = (id: number) =>
        useQuery({
            queryKey: ["userProfile", id],
            queryFn: () => getUserProfileByIdService(id),
            staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
        });

    // Create a new user
    const createUser = useMutation({
        mutationFn: (newUser: CreateUserInput) => createUserService(newUser),
        onSuccess: (createdUser) => {
            queryClient.setQueryData(["users"], (oldUsers: User[] | undefined) => [
                ...(oldUsers || []),
                createdUser,
            ]);
        },
    });

    // Update user profile (including file upload)
    const updateUserProfile = useMutation({
        mutationFn: ({ id, updatedData }: { id: number; updatedData: UpdateUserProfileInput }) =>
            updateUserProfileService(id, updatedData),
        onSuccess: (updatedProfile, { id }) => {
            queryClient.setQueryData(["userProfile", id], (oldProfile: any) => ({
                ...oldProfile,
                ...updatedProfile,
            }));
        },
    });

    // Update a user
    const updateUser = useMutation({
        mutationFn: ({ id, updatedData }: { id: number; updatedData: UpdateUserInput }) =>
            updateUserService(id, updatedData),
        onSuccess: (updatedUser, { id }) => {
            queryClient.setQueryData(["users"], (oldUsers: User[] | undefined) =>
                (oldUsers || []).map((user) =>
                    user.id === id ? { ...user, ...updatedUser } : user
                )
            );
        },
    });

    // Delete a user
    const deleteUser = useMutation({
        mutationFn: (id: number) => deleteUserService(id),
        onSuccess: (_, id) => {
            queryClient.setQueryData(["users"], (oldUsers: User[] | undefined) =>
                (oldUsers || []).filter((user) => user.id !== id)
            );
        },
    });

    return {
        users,
        usersLoading,
        usersError,
        useUserProfile,
        createUser: createUser.mutateAsync,
        updateUserProfile: updateUserProfile.mutateAsync,
        updateUser: updateUser.mutateAsync,
        deleteUser: deleteUser.mutateAsync,
    };
};