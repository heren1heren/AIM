import api from "./api"; // Axios instance with baseURL and interceptors

export interface File {
    id: number;
    key: string;
    uploaded_by: number;
    filename: string;
    mimetype: string;
    size: number;
    signedUrl?: string; // Optional signed URL for accessing the file
}

// Upload a file
export const uploadFile = async (file: File): Promise<File> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post<File>("/files/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
};

// Upload an avatar file
export const uploadAvatarFile = async (avatar: File): Promise<File> => {
    const formData = new FormData();
    formData.append("avatar", avatar);

    const response = await api.post<File>("/files/upload/avatar", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
};

// Get all files
export const getAllFiles = async (): Promise<File[]> => {
    const response = await api.get<File[]>("/files");
    return response.data;
};

// Get a file by ID
export const getFileById = async (id: number): Promise<File> => {
    const response = await api.get<File>(`/files/${id}`);
    return response.data;
};

// Delete a file by ID
export const deleteFile = async (id: number): Promise<void> => {
    await api.delete(`/files/${id}`);
};

// Get files by content ID
export const getFilesByContentId = async (contentId: number): Promise<File[]> => {
    const response = await api.get<File[]>(`/files/content/${contentId}`);
    return response.data;
};

// Get a signed URL for accessing a file by file key
export const getFileAccessByFileKey = async (fileKey: string): Promise<{ signedUrl: string; expiresAt: string }> => {
    const response = await api.get<{ signedUrl: string; expiresAt: string }>(`/files/access`, {
        params: { fileKey },
    });
    return response.data;
};

// Update files by submission ID
export const updateFilesBySubmissionId = async (submissionId: number, fileIds: number[]): Promise<File[]> => {
    const response = await api.put<File[]>(`/files/submission/${submissionId}`, { fileIds });
    return response.data;
};

// Update file by content ID
export const updateFileByContentId = async (contentId: number, fileId: number): Promise<File> => {
    const response = await api.put<File>(`/files/content/${contentId}`, { fileId });
    return response.data;
};

// Update file by notification ID
export const updateFileByNotificationId = async (notificationId: number, fileId: number): Promise<File> => {
    const response = await api.put<File>(`/files/notification/${notificationId}`, { fileId });
    return response.data;
};

// Update file by assignment ID
export const updateFileByAssignmentId = async (assignmentId: number, fileId: number): Promise<File> => {
    const response = await api.put<File>(`/files/assignment/${assignmentId}`, { fileId });
    return response.data;
};

export default {
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
};