import { useState, useCallback } from "react";
import {
    uploadFile,
    uploadAvatarFile,
    getAllFiles,
    getFileById,
    deleteFile,
    getFilesByContentId,
    getFileAccessByFileKey,
    updateFilesBySubmissionId,
    updateFileByContentId,
    updateFileByNotificationId,
    updateFileByAssignmentId,
    type File,
} from "../services/fileService";

export const useFile = () => {
    const [files, setFiles] = useState<File[]>([]); // State for all files
    const [file, setFile] = useState<File | null>(null); // State for a single file
    const [loading, setLoading] = useState(false); // Loading state
    const [error, setError] = useState<string | null>(null); // Error state

    // Upload a file
    const handleUploadFile = useCallback(async (file: File) => {
        setLoading(true);
        setError(null);
        try {
            const uploadedFile = await uploadFile(file);
            setFiles((prev) => [...prev, uploadedFile]); // Add the uploaded file to the state
            return uploadedFile;
        } catch (err) {
            setError("Failed to upload file");
            console.error(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Upload an avatar file
    const handleUploadAvatarFile = useCallback(async (avatar: File) => {
        setLoading(true);
        setError(null);
        try {
            const uploadedAvatar = await uploadAvatarFile(avatar);
            return uploadedAvatar;
        } catch (err) {
            setError("Failed to upload avatar");
            console.error(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch all files
    const fetchAllFiles = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const allFiles = await getAllFiles();
            setFiles(allFiles); // Update the state with all files
            return allFiles;
        } catch (err) {
            setError("Failed to fetch files");
            console.error(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch a file by ID
    const fetchFileById = useCallback(async (id: number) => {
        setLoading(true);
        setError(null);
        try {
            const fetchedFile = await getFileById(id);
            setFile(fetchedFile); // Update the state with the fetched file
            return fetchedFile;
        } catch (err) {
            setError("Failed to fetch file");
            console.error(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Delete a file
    const handleDeleteFile = useCallback(async (id: number) => {
        setLoading(true);
        setError(null);
        try {
            await deleteFile(id);
            setFiles((prev) => prev.filter((file) => file.id !== id)); // Remove the deleted file from the state
        } catch (err) {
            setError("Failed to delete file");
            console.error(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch files by content ID
    const fetchFilesByContentId = useCallback(async (contentId: number) => {
        setLoading(true);
        setError(null);
        try {
            const contentFiles = await getFilesByContentId(contentId);
            setFiles(contentFiles); // Update the state with files for the content ID
            return contentFiles;
        } catch (err) {
            setError("Failed to fetch files by content ID");
            console.error(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Get a signed URL for a file
    const fetchFileAccessByFileKey = useCallback(async (fileKey: string) => {
        setLoading(true);
        setError(null);
        try {
            const { signedUrl, expiresAt } = await getFileAccessByFileKey(fileKey);
            return { signedUrl, expiresAt };
        } catch (err) {
            setError("Failed to fetch file access");
            console.error(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Update files by submission ID
    const handleUpdateFilesBySubmissionId = useCallback(async (submissionId: number, fileIds: number[]) => {
        setLoading(true);
        setError(null);
        try {
            const updatedFiles = await updateFilesBySubmissionId(submissionId, fileIds);
            return updatedFiles;
        } catch (err) {
            setError("Failed to update files by submission ID");
            console.error(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Update file by content ID
    const handleUpdateFileByContentId = useCallback(async (contentId: number, fileId: number) => {
        setLoading(true);
        setError(null);
        try {
            const updatedFile = await updateFileByContentId(contentId, fileId);
            return updatedFile;
        } catch (err) {
            setError("Failed to update file by content ID");
            console.error(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Update file by notification ID
    const handleUpdateFileByNotificationId = useCallback(async (notificationId: number, fileId: number) => {
        setLoading(true);
        setError(null);
        try {
            const updatedFile = await updateFileByNotificationId(notificationId, fileId);
            return updatedFile;
        } catch (err) {
            setError("Failed to update file by notification ID");
            console.error(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Update file by assignment ID
    const handleUpdateFileByAssignmentId = useCallback(async (assignmentId: number, fileId: number) => {
        setLoading(true);
        setError(null);
        try {
            const updatedFile = await updateFileByAssignmentId(assignmentId, fileId);
            return updatedFile;
        } catch (err) {
            setError("Failed to update file by assignment ID");
            console.error(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch avatar URL
    const fetchAvatarUrl = async () => {
        if (userProfile?.avatarKey) {
            try {
                console.log("Fetching signed URL for fileKey:", userProfile.avatarKey); // Debugging
                const { signedUrl } = await fetchFileAccessByFileKey(userProfile.avatarKey);
                console.log("Signed URL fetched:", signedUrl); // Debugging
                setAvatarUrl(signedUrl);
            } catch (error) {
                console.error("Error in fetchFileAccessByFileKey:", error);
            }
        }
    };

    return {
        files,
        file,
        loading,
        error,
        handleUploadFile,
        handleUploadAvatarFile,
        fetchAllFiles,
        fetchFileById,
        handleDeleteFile,
        fetchFilesByContentId,
        fetchFileAccessByFileKey,
        handleUpdateFilesBySubmissionId,
        handleUpdateFileByContentId,
        handleUpdateFileByNotificationId,
        handleUpdateFileByAssignmentId,
        fetchAvatarUrl,
    };
};