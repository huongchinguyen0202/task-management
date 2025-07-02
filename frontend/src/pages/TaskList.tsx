import React from 'react';
import TaskList from '../components/tasks/TaskList';
import { useTasks } from '../hooks/useTasks';

const TaskListPage: React.FC = () => {
  const { tasks } = useTasks();
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Task List</h1>
      <TaskList tasks={tasks} onEdit={() => {}} onDelete={() => {}} />
    </div>
  );
};

export default TaskListPage;
