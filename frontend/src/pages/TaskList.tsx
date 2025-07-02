import React, { useState, useEffect } from 'react';
import TaskList from '../components/tasks/TaskList';
import TaskForm from '../components/tasks/TaskForm';
import { useTasks, useTaskOperations } from '../hooks/useTasks';
import type { Task } from '../types/task';

const TaskListPage: React.FC = () => {
  const { tasks, loadTasks } = useTasks();
  const { addTask, editTask, removeTask, loading } = useTaskOperations();
  const [showModal, setShowModal] = useState(false);
  const [editTaskData, setEditTaskData] = useState<Task | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'danger'; message: string } | null>(null);

  // Tự động load task khi vào trang
  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleAdd = async (data: Partial<Task>) => {
    try {
      await addTask(data);
      setShowModal(false); // Tắt popup ngay
      setAlert({ type: 'success', message: 'Task created successfully!' });
      loadTasks();
      setTimeout(() => {
        setAlert(null);
      }, 5000);
    } catch {
      setAlert({ type: 'danger', message: 'Failed to create task. Please try again.' });
      setTimeout(() => setAlert(null), 3000); // Hiển thị lỗi 10s
    }
  };
  const handleEdit = (task: Task) => {
    setEditTaskData(task);
    setShowModal(true);
  };
  const handleUpdate = async (data: Partial<Task>) => {
    if (editTaskData) {
      try {
        await editTask(editTaskData.id!, data);
        setShowModal(false); // Tắt popup ngay
        setAlert({ type: 'success', message: 'Task updated successfully!' });
        loadTasks();
        setTimeout(() => {
          setAlert(null);
        }, 5000);
      } catch {
        setAlert({ type: 'danger', message: 'Failed to update task. Please try again.' });
        setTimeout(() => setAlert(null), 3000);
      }
    }
  };
  const handleDelete = async (id: number) => {
    try {
      await removeTask(id);
      setAlert({ type: 'success', message: 'Task deleted successfully!' });
      loadTasks();
      setTimeout(() => setAlert(null), 5000);
    } catch {
      setAlert({ type: 'danger', message: 'Failed to delete task. Please try again.' });
      setTimeout(() => setAlert(null), 5000);
    }
  };
  const handleClose = () => {
    setShowModal(false);
    setEditTaskData(null);
  };

  return (
    <div className="card shadow-sm p-4 bg-white border-0 mx-auto position-relative" style={{ maxWidth: 900 }}>
      {alert && (
        <div
          className={`alert alert-${alert.type} text-center fw-bold position-fixed top-0 start-50 translate-middle-x mt-3 shadow-lg`}
          style={{ zIndex: 2000, minWidth: 320, maxWidth: 500 }}
          role="alert"
        >
          {alert.message}
        </div>
      )}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fs-3 fw-bold text-primary">Task List</h1>
        <button className="btn btn-success" onClick={() => { setShowModal(true); setEditTaskData(null); }}>
          + Add Task
        </button>
      </div>
      <TaskList tasks={tasks} onEdit={handleEdit} onDelete={handleDelete} />
      {/* Modal for Add/Edit Task */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex={-1} style={{ background: 'rgba(0,0,0,0.2)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editTaskData ? 'Edit Task' : 'Add Task'}</h5>
                <button type="button" className="btn-close" onClick={handleClose}></button>
              </div>
              <div className="modal-body">
                <TaskForm
                  initialTask={editTaskData || undefined}
                  onSubmit={editTaskData ? handleUpdate : handleAdd}
                  loading={loading}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskListPage;
