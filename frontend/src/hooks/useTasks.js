import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

export const useTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(null);

    const fetchTasks = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get('/tasks');
            setTasks(response.data.data); // data.data because of API Resource
        } catch (err) {
            setErrors(err.response?.data?.message || 'Failed to fetch tasks');
        } finally {
            setLoading(false);
        }
    }, []);

    const createTask = async (taskData) => {
        setErrors(null);
        try {
            const response = await api.post('/tasks', taskData);
            setTasks((prev) => [response.data.data, ...prev]);
            return response.data.data;
        } catch (err) {
            setErrors(err.response?.data?.errors || 'Failed to create task');
            throw err; // Re-throw to handle in component
        }
    };

    const updateTask = async (id, taskData) => {
        setErrors(null);
        try {
            const response = await api.put(`/tasks/${id}`, taskData);
            setTasks((prev) => prev.map(t => t.id === id ? response.data.data : t));
            return response.data.data;
        } catch (err) {
            setErrors(err.response?.data?.errors || 'Failed to update task');
            throw err;
        }
    };

    const deleteTask = async (id) => {
        try {
            await api.delete(`/tasks/${id}`);
            setTasks((prev) => prev.filter(t => t.id !== id));
        } catch (err) {
            setErrors(err.response?.data?.message || 'Failed to delete task');
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    return {
        tasks,
        loading,
        errors,
        setErrors,
        refresh: fetchTasks,
        createTask,
        updateTask,
        deleteTask,
    };
};
