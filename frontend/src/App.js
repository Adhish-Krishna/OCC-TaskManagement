import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [assignee, setAssignee] = useState('');

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${API_URL}/tasks`);
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  const createTask = async () => {
    if (!title.trim()) return;
    await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, assignee }),
    });
    setTitle(''); setAssignee(''); fetchTasks();
  };

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

  const pending = tasks.filter(t => !t.completed);
  const completed = tasks.filter(t => t.completed);

  return (
    <div className="app">
      <div className="sidebar">
        <div className="logo">
          <span className="logo-icon">📋</span>
          <h1>DeployBoard</h1>
        </div>
        <nav>
          <a href="#tasks" className="nav-item active">🏠 Dashboard</a>
          <a href="#tasks" className="nav-item">📝 Tasks</a>
          <a href="#tasks" className="nav-item">👥 Team</a>
        </nav>
        <div className="sidebar-footer">
          <p>Dev 2 Build</p>
          <span>v1.0.0</span>
        </div>
      </div>

      <div className="main">
        <header className="topbar">
          <h2>Task Dashboard</h2>

        </header>

        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-number">{tasks.length}</div>
            <div className="stat-label">Total Tasks</div>
          </div>
          <div className="stat-card stat-pending">
            <div className="stat-number">{pending.length}</div>
            <div className="stat-label">Pending</div>
          </div>
          <div className="stat-card stat-done">
            <div className="stat-number">{completed.length}</div>
            <div className="stat-label">Completed</div>
          </div>
        </div>

        <div className="form-card">
          <h3>➕ Create New Task</h3>
          <div className="form-row">
            <input
              type="text"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && createTask()}
            />
            <input
              type="text"
              placeholder="Assign to..."
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
            />
            <button className="btn-add" onClick={createTask}>Add Task</button>
          </div>
        </div>

        <div className="task-section" id="tasks">
          <h3>🔵 Pending ({pending.length})</h3>
          {pending.length === 0 && <p className="empty-msg">All caught up! No pending tasks 🎉</p>}
          {pending.map((task) => (
            <div key={task._id} className="task-card">
              <div className="task-left">
                <div className="task-dot pending-dot"></div>
                <div>
                  <div className="task-title">{task.title}</div>
                  <div className="task-meta">👤 {task.assignee || 'Unassigned'}</div>
                </div>
              </div>
              <div className="task-actions">
                <button className="btn-complete" onClick={() => markComplete(task._id)}>✅ Complete</button>
                <button className="btn-remove" onClick={() => deleteTask(task._id)}>✕</button>
              </div>
            </div>
          ))}
        </div>

        <div className="task-section">
          <h3>✅ Completed ({completed.length})</h3>
          {completed.length === 0 && <p className="empty-msg">No completed tasks yet</p>}
          {completed.map((task) => (
            <div key={task._id} className="task-card done">
              <div className="task-left">
                <div className="task-dot done-dot"></div>
                <div>
                  <div className="task-title">{task.title}</div>
                  <div className="task-meta">👤 {task.assignee || 'Unassigned'}</div>
                </div>
              </div>
              <div className="task-actions">
                <button className="btn-remove" onClick={() => deleteTask(task._id)}>✕</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;