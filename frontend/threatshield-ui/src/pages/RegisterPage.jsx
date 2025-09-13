import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Use Link for navigation
// We reuse the exact same CSS file from the Login Page for a consistent design
import './LoginPage.css'; 

function RegisterPage() {
  // Add state for the new fields
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mobile, setMobile] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    
    // Simple validation check
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    console.log('Registering account:', { username, email, password, mobile });
    alert(`Account creation submitted for: ${username}`);
    // In the next phase, you'll send this data to your backend API
  };

  return (
    <div className="login-page-container">
      <div className="login-form-card">
        
        <div className="login-header">
          <h2>Create Account</h2>
          <p>Join ThreatShield Today</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>

            <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              required
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          
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
            <label htmlFor="mobile">Mobile No</label>
            <input
              id="mobile"
              type="tel" // Use type="tel" for mobile numbers
              required
              placeholder="+91 XXXXX XXXXX"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
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

          <div className="input-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              required
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          
          <button type="submit" className="submit-button">
            Sign Up
          </button>
        </form>
        
        <p className="login-footer">
          Already have an account?{' '}
          {/* Use the <Link> component for fast, client-side navigation */}
          <Link to="/login">Sign In</Link>
        </p>

      </div>
    </div>
  );
}

export default RegisterPage;