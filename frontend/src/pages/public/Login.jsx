// src/pages/public/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

const Login = () => {
  const [credentials, setCredentials] = useState({ identifier: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Later, we will connect this to Supabase
    console.log("Logging in with:", credentials);
    // navigate('/dashboard'); 
  };

  return (
    <section className="auth-section">
      <div className="auth-container">
        <div className="auth-card">
          
          {/* Left Side: Visual/Branding (Hidden on mobile) */}
          <div className="auth-image-side">
            <div className="auth-image-overlay">
              <h2>Welcome Back</h2>
              <p>Continue your spiritual journey with Pothik Bondhu.</p>
            </div>
          </div>

          {/* Right Side: Login Form */}
          <div className="auth-form-side">
            <div className="auth-header">
              <h2>Log In to Your Portal</h2>
              <p>Enter your phone number or email and password.</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label>Phone Number or Email</label>
                <input
                  type="text"
                  placeholder="e.g. +8801700000000 or email"
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