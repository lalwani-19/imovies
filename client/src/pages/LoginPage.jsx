import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BiEnvelope, BiLockAlt, BiMoviePlay, BiLogIn, BiInfoCircle } from 'react-icons/bi';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      navigate(from, { replace: true });
    }
  };

  const handleFillDemoUser = () => {
    setEmail('alex@example.com');
    setPassword('password123');
  };

  const handleFillDemoAdmin = () => {
    setEmail('admin@imovies.com');
    setPassword('adminpassword123');
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-7 col-lg-5">
          <div className="cinema-card p-4 p-md-5">
            {/* Header */}
            <div className="text-center mb-4">
              <div 
                className="d-inline-flex align-items-center justify-content-center rounded-3 mb-3"
                style={{ 
                  width: '48px', 
                  height: '48px', 
                  background: 'linear-gradient(135deg, #8b5cf6, #ec4899)' 
                }}
              >
                <BiMoviePlay size={28} className="text-white" />
              </div>
              <h3 className="text-white fw-bold mb-1">Welcome Back</h3>
              <p className="text-secondary small">Sign in to manage bookings and reserve your favorite seats</p>
            </div>

            {/* Quick Demo Credentials Autofill Helper */}
            <div className="bg-dark p-3 rounded-3 border border-secondary mb-4">
              <div className="d-flex align-items-center gap-1 text-warning small fw-semibold mb-2">
                <BiInfoCircle /> Quick Demo Test Accounts:
              </div>
              <div className="d-flex gap-2">
                <button
                  type="button"
                  onClick={handleFillDemoUser}
                  className="btn btn-sm btn-outline-secondary text-light flex-grow-1"
                  style={{ fontSize: '0.75rem' }}
                >
                  Fill Demo User
                </button>
                <button
                  type="button"
                  onClick={handleFillDemoAdmin}
                  className="btn btn-sm btn-outline-warning text-warning flex-grow-1"
                  style={{ fontSize: '0.75rem' }}
                >
                  Fill Demo Admin
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="text-secondary small fw-medium mb-1">Email Address</label>
                <div className="input-group">
                  <span className="input-group-text bg-dark border-secondary text-secondary">
                    <BiEnvelope />
                  </span>
                  <input
                    type="email"
                    className="form-control bg-dark border-secondary text-white"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="text-secondary small fw-medium mb-0">Password</label>
                </div>
                <div className="input-group">
                  <span className="input-group-text bg-dark border-secondary text-secondary">
                    <BiLockAlt />
                  </span>
                  <input
                    type="password"
                    className="form-control bg-dark border-secondary text-white"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-cinema-primary w-100 py-2 d-flex align-items-center justify-content-center gap-2 mb-3"
              >
                {isSubmitting ? (
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                ) : (
                  <>
                    <BiLogIn size={18} /> Sign In
                  </>
                )}
              </button>

              <div className="text-center text-secondary small">
                Don't have an account yet?{' '}
                <Link to="/register" className="text-primary text-decoration-none fw-semibold">
                  Create Account
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

