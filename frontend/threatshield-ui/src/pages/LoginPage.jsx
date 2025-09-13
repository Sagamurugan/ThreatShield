import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginPage.css'; 

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Login attempt:', { email, password });
    
    // Simulate a successful login
    alert(`Login Successful! Redirecting to dashboard...`);
    
    // 3. Navigate to the dashboard
    navigate('/dashboard'); 
  };

  return (
    <div className="login-page-container">
      <div className="login-form-card">
        
        <div className="login-header">
          <h2>Sign in to ThreatShield</h2>
          <p>Securely access your dashboard</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          
          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <button type="submit" className="submit-button">
            Sign In
          </button>
        </form>
        
        <p className="login-footer">
          Don't have an account?{' '}
          <Link to="/register">Sign Up</Link>
        </p>

      </div>
    </div>
  );
}

export default LoginPage;