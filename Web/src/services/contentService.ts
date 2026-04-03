import api from "./api";

const API_BASE_URL = "/contents";

// Fetch all contents
export const getAllContents = async () => {
    const response = await api.get(`${API_BASE_URL}`);
    return response.data;
};

// Fetch content by ID
export const getContentById = async (id: number) => {
    const response = await api.get(`${API_BASE_URL}/${id}`);
    return response.data;
};

// Fetch contents by class ID
export const getContentsByClassId = async (classId: number) => {
    const response = await api.get(`${API_BASE_URL}/classes/${classId}`);
    return response.data;
};

// Create content
export const createContent = async (newContent: any) => {
    const response = await api.post(`${API_BASE_URL}`, newContent);
    return response.data;
};

// Update content
export const updateContent = async (id: number, updatedContent: any) => {
    const response = await api.put(`${API_BASE_URL}/${id}`, updatedContent);
    return response.data;
};

// Delete content
export const deleteContent = async (id: number) => {
    const response = await api.delete(`${API_BASE_URL}/${id}`);
    return response.data;
};