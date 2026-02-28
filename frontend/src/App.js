import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Team from './pages/Team';
import Login from './pages/Login';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function App() {
  const [tasks, setTasks] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(
    sessionStorage.getItem('deployboard_auth') === 'true'
  );

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${API_URL}/tasks`);
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  useEffect(() => {
    if (isLoggedIn) fetchTasks();
  }, [isLoggedIn]);

  const handleLogout = () => {
    sessionStorage.removeItem('deployboard_auth');
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <Router>
      <div className="app">
        <div className="sidebar">
          <div className="logo">
            <span className="logo-icon">📋</span>
            <h1>DeployBoard</h1>
          </div>
          <nav>
            <NavLink to="/" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>🏠 Dashboard</NavLink>
            <NavLink to="/tasks" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>📝 Tasks</NavLink>
            <NavLink to="/team" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>👥 Team</NavLink>
          </nav>
          <div className="sidebar-footer">
            <button className="logout-btn" onClick={handleLogout}>🚪 Logout</button>
            <p>DeployBoard</p>
            <span>v1.0.0</span>
          </div>
        </div>

        <div className="main">
          <header className="topbar">
            <Routes>
              <Route path="/" element={<h2>Task Dashboard</h2>} />
              <Route path="/tasks" element={<h2>All Tasks</h2>} />
              <Route path="/team" element={<h2>Team Overview</h2>} />
            </Routes>
          </header>

          <Routes>
            <Route path="/" element={<Dashboard tasks={tasks} fetchTasks={fetchTasks} />} />
            <Route path="/tasks" element={<Tasks tasks={tasks} fetchTasks={fetchTasks} />} />
            <Route path="/team" element={<Team tasks={tasks} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;