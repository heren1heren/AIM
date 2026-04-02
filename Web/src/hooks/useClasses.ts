import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getAllClasses,
    getClassById,
    createClass,
    updateClass,
    deleteClass,
    addStudentsByClassId,
    addAttendancesByClassId,
    transferDataBetweenClasses,
    type CreateClassInput,
    type UpdateClassInput,
} from "../services/classService";

export const useClasses = (fetchEnabled: boolean = false) => {
    const queryClient = useQueryClient();

    // Fetch all classes
    const { data: classes, isLoading: classesLoading, isError: classesError } = useQuery({
        queryKey: ["classes"],
        queryFn: getAllClasses,
        enabled: fetchEnabled,
        staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
    });

    // Fetch a class by ID
    const useClassById = (id: number) =>
        useQuery({
            queryKey: ["class", id],
            queryFn: () => getClassById(id),
            staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
        });

    // Create a new class
    const createClassMutation = useMutation({
        mutationFn: createClass,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["classes"] }); // Refresh class list
        },
    });

    // Update an existing class
    const updateClassMutation = useMutation({
        mutationFn: ({ id, updatedClass }: { id: number; updatedClass: UpdateClassInput }) =>
            updateClass(id, updatedClass),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["classes"] }); // Refresh class list
        },
    });

    // Delete a class
    const deleteClassMutation = useMutation({
        mutationFn: deleteClass,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["classes"] }); // Refresh class list
        },
    });

    return {
        classes,
        classesLoading,
        classesError,
        useClassById,
        createClass: createClassMutation.mutateAsync,
        updateClass: updateClassMutation.mutateAsync,
        deleteClass: deleteClassMutation.mutateAsync,
    };
};