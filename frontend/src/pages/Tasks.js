import React, { useState } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function Tasks({ tasks, fetchTasks }) {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const markComplete = async (id) => {
    await fetch(`${API_URL}/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: true }),
    });
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await fetch(`${API_URL}/tasks/${id}`, { method: 'DELETE' });
    fetchTasks();
  };

  let filtered = tasks;
  if (filter === 'pending') filtered = tasks.filter(t => !t.completed);
  if (filter === 'completed') filtered = tasks.filter(t => t.completed);
  if (search.trim()) {
    filtered = filtered.filter(t =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      (t.assignee && t.assignee.toLowerCase().includes(search.toLowerCase()))
    );
  }

  return (
    <>
      <div className="page-header">
        <span className="badge">{filtered.length} tasks</span>
      </div>

      <div className="filter-bar">
        <input
          type="text"
          className="search-input"
          placeholder="🔍 Search tasks or assignees..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="filter-tabs">
          <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
          <button className={`filter-btn ${filter === 'pending' ? 'active' : ''}`} onClick={() => setFilter('pending')}>Pending</button>
          <button className={`filter-btn ${filter === 'completed' ? 'active' : ''}`} onClick={() => setFilter('completed')}>Completed</button>
        </div>
      </div>

      <div className="task-section">
        {filtered.length === 0 && <p className="empty-msg">No tasks found</p>}
        {filtered.map((task) => (
          <div key={task._id} className={`task-card ${task.completed ? 'done' : ''}`}>
            <div className="task-left">
              <div className={`task-dot ${task.completed ? 'done-dot' : 'pending-dot'}`}></div>
              <div>
                <div className="task-title">{task.title}</div>
                <div className="task-meta">
                  👤 {task.assignee || 'Unassigned'}
                  <span className={`status-badge ${task.completed ? 'status-done' : 'status-pending'}`}>
                    {task.completed ? 'Completed' : 'Pending'}
                  </span>
                </div>
              </div>
            </div>
            <div className="task-actions">
              {!task.completed && (
                <button className="btn-complete" onClick={() => markComplete(task._id)}>✅ Complete</button>
              )}
              <button className="btn-remove" onClick={() => deleteTask(task._id)}>✕</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Tasks;