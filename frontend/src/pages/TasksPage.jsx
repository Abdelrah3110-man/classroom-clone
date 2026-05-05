import React, { useState } from 'react';
import { useTasks } from '../hooks/useTasks';

const TasksPage = () => {
    const { tasks, loading, errors, createTask, deleteTask, updateTask } = useTasks();
    const [newTitle, setNewTitle] = useState('');

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await createTask({ 
                title: newTitle, 
                user_id: 1 // Example user ID
            });
            setNewTitle('');
        } catch (err) {
            // Errors are handled by the hook and exposed via 'errors'
        }
    };

    const toggleStatus = async (task) => {
        const newStatus = task.status === 'pending' ? 'completed' : 'pending';
        await updateTask(task.id, { status: newStatus });
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Task Management</h1>

            {/* Form */}
            <form onSubmit={handleCreate} className="mb-8 flex gap-2">
                <div className="flex-1">
                    <input 
                        type="text" 
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="What needs to be done?"
                        className="w-full border rounded px-4 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                    {errors?.title && (
                        <p className="text-red-500 text-sm mt-1">{errors.title[0]}</p>
                    )}
                </div>
                <button 
                    type="submit" 
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                >
                    Add
                </button>
            </form>

            {/* List */}
            {loading ? (
                <p>Loading tasks...</p>
            ) : (
                <ul className="space-y-3">
                    {tasks.map((task) => (
                        <li key={task.id} className="flex items-center justify-between p-4 bg-white border rounded shadow-sm">
                            <div className="flex items-center gap-3">
                                <input 
                                    type="checkbox" 
                                    checked={task.status === 'completed'}
                                    onChange={() => toggleStatus(task)}
                                    className="w-5 h-5"
                                />
                                <span className={task.status === 'completed' ? 'line-through text-gray-400' : ''}>
                                    {task.title}
                                </span>
                            </div>
                            <button 
                                onClick={() => deleteTask(task.id)}
                                className="text-red-500 hover:text-red-700"
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default TasksPage;
