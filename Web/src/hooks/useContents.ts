import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getAllContents,
    getContentById,
    createContent,
    updateContent,
    deleteContent,
    getContentsByClassId,
} from "../services/contentService";

export const useContents = (fetchEnabled: boolean = false) => {
    const queryClient = useQueryClient();

    // Fetch all contents
    const { data: contents, isLoading: contentsLoading, isError: contentsError } = useQuery({
        queryKey: ["contents"],
        queryFn: getAllContents,
        enabled: fetchEnabled,
        staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
    });

    // Fetch content by ID
    const useContentById = (id: number) =>
        useQuery({
            queryKey: ["content", id],
            queryFn: () => getContentById(id),
            staleTime: 5 * 60 * 1000,
        });

    // Fetch contents by class ID
    const useContentsByClassId = (classId: number) =>
        useQuery({
            queryKey: ["contents", "class", classId],
            queryFn: () => getContentsByClassId(classId),
            staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
        });

    // Create content
    const createContentMutation = useMutation({
        mutationFn: createContent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["contents"] }); // Refresh contents list
        },
    });

    // Update content
    const updateContentMutation = useMutation({
        mutationFn: ({ id, updatedContent }: { id: number; updatedContent: any }) =>
            updateContent(id, updatedContent),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["contents"] }); // Refresh contents list
        },
    });

    // Delete content
    const deleteContentMutation = useMutation({
        mutationFn: deleteContent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["contents"] }); // Refresh contents list
        },
    });

    return {
        contents,
        contentsLoading,
        contentsError,
        useContentById,
        useContentsByClassId,
        createContent: createContentMutation.mutateAsync,
        updateContent: updateContentMutation.mutateAsync,
        deleteContent: deleteContentMutation.mutateAsync,
    };
};