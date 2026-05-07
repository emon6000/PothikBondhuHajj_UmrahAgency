// src/pages/public/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

const Login = () => {
  const [credentials, setCredentials] = useState({ identifier: '', password: '' });
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Use credentials.identifier (which holds the email/phone) and credentials.password
        body: JSON.stringify({ 
          email: credentials.identifier, 
          password: credentials.password 
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Save the token and user info to localStorage
        localStorage.setItem('pothik_token', data.token);
        localStorage.setItem('pothik_user', JSON.stringify(data.user));

        alert(`Welcome back, ${data.user.name}!`);
        
        // Redirect based on role
        if (data.user.role === 'ADMIN') {
           navigate('/admin-dashboard'); 
        } else {
           navigate('/client-dashboard');
        }

      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Could not connect to the server.");
    }
  };

  return (
    <section className="auth-section">
      <div className="auth-container">
        <div className="auth-card">
          
          <div className="auth-image-side">
            <div className="auth-image-overlay">
              <h2>Welcome Back</h2>
              <p>Continue your spiritual journey with Pothik Bondhu.</p>
            </div>
          </div>

          <div className="auth-form-side">
            <div className="auth-header">
              <h2>Log In to Your Portal</h2>
              <p>Enter your phone number or email and password.</p>
            </div>

            <form onSubmit={handleLoginSubmit} className="auth-form">
              <div className="form-group">
                <label>Phone Number or Email</label>
                <input
                  type="text"
                  placeholder="e.g. +880 or email"
                  required
                  value={credentials.identifier}
                  onChange={(e) => setCredentials({...credentials, identifier: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  required
                  value={credentials.password}
                  onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                />
              </div>

              <button type="submit" className="auth-submit-btn">
                Secure Log In
              </button>
            </form>

            {/* Helpline Box (Replaces 'Forgot Password') */}
            <div className="auth-help-box">
              <p className="help-title">Forgot your password?</p>
              <p className="help-desc">For security reasons, please contact our helpline to reset your credentials:</p>
              <div className="help-contacts">
                <span><FaPhoneAlt className="small-icon" /> +880 1234 567 890</span>
                <span><FaEnvelope className="small-icon" /> info@pothikbondhu.com</span>
              </div>
            </div>

            
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;