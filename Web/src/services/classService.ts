import api from "./api";

export interface Class {
    id: number;
    name: string;
    description?: string;
    teacher_id: number;
    start_date: string;
    end_date: string;
    created_at: string;
    teacher: {
        id: number;
        user_id: number;
        name: string;
    };
    students: {
        id: number;
        user_id: number;
        class_id: number;
    }[];
}

export interface CreateClassInput {
    name: string;
    description?: string;
    teacher_id: number;
    start_date: string;
    end_date: string;
    student_ids?: number[];
}

export interface UpdateClassInput extends Partial<CreateClassInput> { }

// Fetch all classes
export const getAllClasses = async (): Promise<Class[]> => {
    const response = await api.get<Class[]>("/classes");
    return response.data;
};

// Fetch a class by ID
export const getClassById = async (id: number): Promise<Class> => {
    const response = await api.get<Class>(`/classes/${id}`);
    return response.data;
};

// Create a new class
export const createClass = async (newClass: CreateClassInput): Promise<Class> => {
    const response = await api.post<Class>("/classes", newClass);
    return response.data;
};

// Update an existing class
export const updateClass = async (id: number, updatedClass: UpdateClassInput): Promise<Class> => {
    const response = await api.put<Class>(`/classes/${id}`, updatedClass);
    return response.data;
};

// Delete a class
export const deleteClass = async (id: number): Promise<void> => {
    await api.delete(`/classes/${id}`);
};

// Add students to a class
export const addStudentsByClassId = async (classId: number, studentIds: number[]): Promise<Class> => {
    const response = await api.put<Class>(`/classes/${classId}/students`, { student_ids: studentIds });
    return response.data;
};

// Add attendances to a class
export const addAttendancesByClassId = async (classId: number, attendanceIds: number[]): Promise<Class> => {
    const response = await api.put<Class>(`/classes/${classId}/attendances`, { attendance_ids: attendanceIds });
    return response.data;
};

// Transfer data between classes
export const transferDataBetweenClasses = async (sourceClassId: number, targetClassId: number): Promise<void> => {
    await api.post("/classes/transfer", { sourceClassId, targetClassId });
};