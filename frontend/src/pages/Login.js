import React, { useState } from 'react';

const APP_PASSWORD = process.env.REACT_APP_LOGIN_PASSWORD || 'deployboard2026';

function Login({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === APP_PASSWORD) {
      sessionStorage.setItem('deployboard_auth', 'true');
      onLogin();
    } else {
      setError('Wrong password. Try again.');
      setPassword('');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo">
          <span>📋</span>
          <h1>DeployBoard</h1>
        </div>
        <p className="login-subtitle">Enter password to continue</p>

        <form onSubmit={handleLogin}>
          <input
            type="password"
            className="login-input"
            placeholder="Enter password..."
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(''); }}
            autoFocus
          />
          {error && <p className="login-error">{error}</p>}
          <button type="submit" className="login-btn">🔓 Login</button>
        </form>

        <p className="login-footer">Task Management System</p>
      </div>
    </div>
  );
}

export default Login;