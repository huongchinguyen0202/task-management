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
];

const TaskList: React.FC<TaskListProps> = ({ tasks, onEdit, onDelete }) => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const filteredTasks = useMemo(() => {
    let filtered = tasks;
    if (status) filtered = filtered.filter(t => t.status === status);
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
        <table className="min-w-full bg-white border rounded shadow text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Title</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Due Date</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-400">No tasks found.</td>
              </tr>
            ) : (
              filteredTasks.map(task => (
                <tr key={task.id} className="border-t hover:bg-gray-50">
                  <td className="p-2 font-medium">{task.title}</td>
                  <td className="p-2 capitalize">{task.status || (task.completed ? 'completed' : 'pending')}</td>
                  <td className="p-2">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}</td>
                  <td className="p-2 flex gap-2">
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() => onEdit(task)}
                    >Edit</button>
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => onDelete(task.id)}
                    >Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskList;
