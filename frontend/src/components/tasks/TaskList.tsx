import React, { useState, useMemo } from 'react';
import type { TaskListProps } from '../../types/task';

const statusOptions = [
  { value: '', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

const sortOptions = [
  { value: 'createdAt', label: 'Created' },
  { value: 'dueDate', label: 'Due Date' },
  { value: 'title', label: 'Title' },
  { value: 'status', label: 'Status' }, // Thêm sort theo status
];

const TaskList: React.FC<TaskListProps> = ({ tasks, onEdit, onDelete }) => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const filteredTasks = useMemo(() => {
    let filtered = tasks;
    // Lọc status: nếu không có status thì dùng completed
    if (status) filtered = filtered.filter(t => (t.status ? t.status === status : (status === 'completed' ? t.completed : !t.completed)));
    if (search) filtered = filtered.filter(t => t.title.toLowerCase().includes(search.toLowerCase()));
    filtered = [...filtered].sort((a, b) => {
      let aVal: string | number = '';
      let bVal: string | number = '';
      if (sortBy === 'createdAt') {
        aVal = a.createdAt || a.created_at || '';
        bVal = b.createdAt || b.created_at || '';
      } else if (sortBy === 'dueDate') {
        aVal = a.dueDate || a.due_date || '';
        bVal = b.dueDate || b.due_date || '';
      } else if (sortBy === 'title') {
        aVal = a.title;
        bVal = b.title;
      } else if (sortBy === 'status') {
        aVal = a.status || (typeof a.completed === 'boolean' ? (a.completed ? 'completed' : 'pending') : '');
        bVal = b.status || (typeof b.completed === 'boolean' ? (b.completed ? 'completed' : 'pending') : '');
      }
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return filtered;
  }, [tasks, search, status, sortBy, sortDir]);

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-2 mb-4">
        <input
          className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring"
          placeholder="Search tasks..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="border rounded px-3 py-2"
          value={status}
          onChange={e => setStatus(e.target.value)}
        >
          {statusOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <select
          className="border rounded px-3 py-2"
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
        >
          {sortOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <button
          className="border rounded px-3 py-2"
          onClick={() => setSortDir(d => (d === 'asc' ? 'desc' : 'asc'))}
        >
          {sortDir === 'asc' ? '↑' : '↓'}
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Due Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center text-secondary">No tasks found.</td>
              </tr>
            )}
            {filteredTasks.map(task => (
              <tr key={task.id}>
                <td>{task.title}</td>
                <td>{task.description}</td>
                <td>{task.status ? task.status.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase()) : (typeof task.completed === 'boolean' ? (task.completed ? 'Completed' : 'Pending') : '')}</td>
                <td>{task.priority}</td>
                <td>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : task.due_date ? new Date(task.due_date).toLocaleDateString() : ''}</td>
                <td>
                  <button className="btn btn-sm btn-outline-primary me-2" onClick={() => onEdit(task)}>Edit</button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(task.id!)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskList;
