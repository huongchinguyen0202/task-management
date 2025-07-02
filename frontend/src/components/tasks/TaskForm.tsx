import React, { useState, useEffect } from 'react';
import type { TaskFormProps } from '../../types/task';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>(initialTask?.priority || 'medium');
  const [status, setStatus] = useState<"pending" | "in_progress" | "completed">(initialTask?.status || 'pending');
  const [dueDate, setDueDate] = useState<Date | null>(initialTask?.dueDate ? new Date(initialTask.dueDate) : initialTask?.due_date ? new Date(initialTask.due_date) : null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setTitle(initialTask?.title || '');
    setDescription(initialTask?.description || '');
    setPriority(initialTask?.priority || 'medium');
    setStatus(initialTask?.status || 'pending');
    setDueDate(initialTask?.dueDate ? new Date(initialTask.dueDate) : initialTask?.due_date ? new Date(initialTask.due_date) : null);
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
    // Chỉ truyền các field backend hỗ trợ
    const payload: any = {
      title: title.trim(),
      description: description.trim(),
      due_date: dueDate ? dueDate.toISOString() : undefined,
      priority,
      status, // Ensure status is sent to backend
    };
    if (initialTask?.id) payload.id = initialTask.id;
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="p-3">
      <div className="mb-3">
        <label className="form-label fw-semibold">Title<span className="text-danger">*</span></label>
        <input
          className="form-control"
          value={title}
          onChange={e => setTitle(e.target.value)}
          maxLength={100}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label fw-semibold">Description</label>
        <textarea
          className="form-control"
          value={description}
          onChange={e => setDescription(e.target.value)}
          maxLength={500}
        />
      </div>
      <div className="mb-3 row">
        <div className="col-md-6 mb-2 mb-md-0">
          <label className="form-label fw-semibold">Status</label>
          <select
            className="form-select"
            value={status}
            onChange={e => setStatus(e.target.value as any)}
          >
            {statusOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label fw-semibold">Priority</label>
          <select
            className="form-select"
            value={priority}
            onChange={e => setPriority(e.target.value as any)}
          >
            {priorityOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="mb-3">
        <label className="form-label fw-semibold">Due Date<span className="text-danger">*</span></label>
        <DatePicker
          selected={dueDate}
          onChange={(date: Date | null) => setDueDate(date)}
          className="form-control"
          dateFormat="yyyy-MM-dd"
          placeholderText="Select due date"
          required
        />
      </div>
      {error && <div className="alert alert-danger py-2 text-center mb-3">{error}</div>}
      <button
        type="submit"
        className="btn btn-primary w-100 fw-bold"
        disabled={loading}
      >
        {initialTask ? 'Update Task' : 'Create Task'}
      </button>
    </form>
  );
};

export default TaskForm;
