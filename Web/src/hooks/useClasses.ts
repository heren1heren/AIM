import { useEffect, useState } from "react";
import axios from "axios";

interface Class {
    id: number;
    name: string;
    description?: string;
    teacher_id: number;
    start_date: string;
    end_date: string;
    student_ids?: number[];
}

interface CreateClassInput {
    name: string;
    description?: string;
    teacher_id: number;
    start_date: string;
    end_date: string;
    student_ids?: number[];
}

interface AddStudentsByClassIdInput {
    class_id: number;
    student_ids: number[]
}
interface AddAttendancesByClassIdInput {
    class_id: number;
    attendance_ids: number[]
}
interface AddAssignmentsByClassIdInput {
    class_id: number;
    assignment_ids: number[]
}
interface UpdateClassInput extends Partial<CreateClassInput> { }

export const useClass = () => {
    const [classes, setClasses] = useState<Class[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch all classes
    const fetchClasses = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get<Class[]>("/classes");
            console.log("Fetched classes:", response.data); // Debugging log
            setClasses(response.data);
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to fetch classes");
        } finally {
            setLoading(false);
        }
    };

    // Create a new class
    const createClass = async (newClass: CreateClassInput) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post<Class>("/classes", newClass);
            setClasses((prev) => [...prev, response.data]);
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to create class");
        } finally {
            setLoading(false);
        }
    };

    // Update an existing class
    const updateClass = async (id: number, updatedClass: UpdateClassInput) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.put<Class>(`/classes/${id}`, updatedClass);
            setClasses((prev) =>
                prev.map((cls) => (cls.id === id ? response.data : cls))
            );
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to update class");
        } finally {
            setLoading(false);
        }
    };

    const addAttendancesByClassId = async (classId: number, attendanceData: any) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.put(`/classes/${classId}`, {
                attendance: attendanceData,
            });

            // Update the class in the state with the new attendance data
            setClasses((prev) =>
                prev.map((cls) =>
                    cls.id === classId ? { ...cls, attendance_ids: response.data.attendance_ids } : cls
                )
            );
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to add attendance to class");
        } finally {
            setLoading(false);
        }
    };


    const addStudentsByClassId = async (classId: number, studentIds: number[]) => {
        setLoading(true);
        setError(null);
        try {
            const classToUpdate = classes.find((cls) => cls.id === classId);
            if (!classToUpdate) {
                throw new Error("Class not found");
            }

            const updatedStudentIds = Array.from(
                new Set([...(classToUpdate.student_ids || []), ...studentIds])
            ); // Merge and deduplicate student IDs

            const response = await axios.put<Class>(`/classes/${classId}`, {
                student_ids: updatedStudentIds,
            });

            setClasses((prev) =>
                prev.map((cls) => (cls.id === classId ? response.data : cls))
            );
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to add students to class");
        } finally {
            setLoading(false);
        }
    };

    // Delete a class
    const deleteClass = async (id: number) => {
        setLoading(true);
        setError(null);
        try {
            await axios.delete(`/classes/${id}`);
            setClasses((prev) => prev.filter((cls) => cls.id !== id));
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to delete class");
        } finally {
            setLoading(false);
        }
    };

    // Transfer data between classes
    const transferDataClass = async (sourceClassId: number, newClassId: number) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post("/classes/transfer", {
                sourceClassId,
                newClassId,
            });
            return response.data;
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to transfer data between classes");
        } finally {
            setLoading(false);
        }
    };


    return {
        classes,
        loading,
        error,
        fetchClasses,
        createClass,
        updateClass,
        addStudentsByClassId,
        addAttendancesByClassId,
        deleteClass,
        transferDataClass,
    };
};