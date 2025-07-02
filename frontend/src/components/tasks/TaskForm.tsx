import React, { useState, useEffect } from 'react';
import type { TaskFormProps } from '../../types/task';

const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

const TaskForm: React.FC<TaskFormProps> = ({ initialTask, onSubmit, loading }) => {
  const [title, setTitle] = useState(initialTask?.title || '');
  const [description, setDescription] = useState(initialTask?.description || '');
  const [status, setStatus] = useState<"pending" | "in_progress" | "completed">(
    initialTask?.status || 'pending'
  );
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>(initialTask?.priority || 'medium');
  const [dueDate, setDueDate] = useState(initialTask?.dueDate ? initialTask.dueDate.slice(0, 10) : '');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setTitle(initialTask?.title || '');
    setDescription(initialTask?.description || '');
    setStatus(initialTask?.status || 'pending');
    setPriority(initialTask?.priority || 'medium');
    setDueDate(initialTask?.dueDate ? initialTask.dueDate.slice(0, 10) : '');
    setError(null);
  }, [initialTask]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required.');
      return;
    }
    if (title.length > 100) {
      setError('Title must be less than 100 characters.');
      return;
    }
    if (description.length > 500) {
      setError('Description must be less than 500 characters.');
      return;
    }
    if (!dueDate) {
      setError('Due date is required.');
      return;
    }
    setError(null);
    onSubmit({
      ...initialTask,
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto p-4 bg-white rounded shadow">
      <div>
        <label className="block mb-1 font-medium">Title<span className="text-red-500">*</span></label>
        <input
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
          value={title}
          onChange={e => setTitle(e.target.value)}
          maxLength={100}
          required
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Description</label>
        <textarea
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={3}
          maxLength={500}
        />
      </div>
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block mb-1 font-medium">Status</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={status}
            onChange={e => setStatus(e.target.value as "pending" | "in_progress" | "completed")}
          >
            {statusOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="block mb-1 font-medium">Priority</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={priority}
            onChange={e => setPriority(e.target.value as 'low' | 'medium' | 'high')}
          >
            {priorityOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="block mb-1 font-medium">Due Date<span className="text-red-500">*</span></label>
        <input
          type="date"
          className="w-full border rounded px-3 py-2"
          value={dueDate}
          onChange={e => setDueDate(e.target.value)}
          required
        />
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? 'Saving...' : initialTask ? 'Update Task' : 'Create Task'}
      </button>
    </form>
  );
};

export default TaskForm;
