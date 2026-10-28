import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import toast from 'react-hot-toast';
import { 
  BiUser, 
  BiEnvelope, 
  BiPhone, 
  BiCheckShield, 
  BiCalendar, 
  BiLogOut, 
  BiCheckCircle 
} from 'react-icons/bi';
import { IoTicketOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  const { user, logout, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Name cannot be empty.');
      return;
    }

    try {
      setIsUpdating(true);
      const res = await authService.updateProfile({ name, phone });
      if (res.data?.success) {
        updateUser(res.data.user);
        toast.success('Profile details updated successfully!');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          {/* Profile Header Card */}
          <div className="cinema-card p-4 mb-4">
            <div className="d-flex flex-column flex-sm-row align-items-center gap-4 text-center text-sm-start">
              <div 
                className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-lg"
                style={{
                  width: '84px',
                  height: '84px',
                  fontSize: '2rem',
                  background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                }}
              >
                {user?.name?.charAt(0).toUpperCase()}
              </div>

              <div>
                <div className="d-flex align-items-center justify-content-center justify-content-sm-start gap-2 mb-1">
                  <h3 className="text-white fw-bold mb-0">{user?.name}</h3>
                  <span className={`badge ${user?.role === 'admin' ? 'bg-danger' : 'bg-primary'} text-uppercase`} style={{ fontSize: '0.65rem' }}>
                    {user?.role}
                  </span>
                </div>
                <p className="text-secondary small mb-2">{user?.email}</p>
                <div className="d-flex align-items-center justify-content-center justify-content-sm-start gap-3 text-muted small">
                  <span>
                    <BiCalendar className="me-1" /> Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Profile Form */}
          <div className="cinema-card p-4 mb-4">
            <h5 className="text-white fw-bold mb-3 d-flex align-items-center gap-2">
              <BiUser className="text-primary" /> Edit Account Details
            </h5>

            <form onSubmit={handleUpdate}>
              <div className="row g-3 mb-4">
                <div className="col-sm-6">
                  <label className="text-secondary small fw-medium mb-1">Full Name</label>
                  <div className="input-group">
                    <span className="input-group-text bg-dark border-secondary text-secondary">
                      <BiUser />
                    </span>
                    <input
                      type="text"
                      className="form-control bg-dark border-secondary text-white"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="col-sm-6">
                  <label className="text-secondary small fw-medium mb-1">Email Address</label>
                  <div className="input-group">
                    <span className="input-group-text bg-dark border-secondary text-secondary">
                      <BiEnvelope />
                    </span>
                    <input
                      type="email"
                      className="form-control bg-dark border-secondary text-muted"
                      value={user?.email || ''}
                      disabled
                    />
                  </div>
                  <small className="text-muted" style={{ fontSize: '0.7rem' }}>
                    Email cannot be changed directly for security reasons.
                  </small>
                </div>

                <div className="col-12">
                  <label className="text-secondary small fw-medium mb-1">Contact Phone Number</label>
                  <div className="input-group">
                    <span className="input-group-text bg-dark border-secondary text-secondary">
                      <BiPhone />
                    </span>
                    <input
                      type="text"
                      className="form-control bg-dark border-secondary text-white"
                      placeholder="+91 9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-center">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="btn btn-cinema-primary d-flex align-items-center gap-2"
                >
                  <BiCheckCircle /> {isUpdating ? 'Saving Changes...' : 'Save Profile'}
                </button>

                <button
                  type="button"
                  onClick={logout}
                  className="btn btn-cinema-outline text-danger border-danger border-opacity-50 d-flex align-items-center gap-2"
                >
                  <BiLogOut /> Log Out
                </button>
              </div>
            </form>
          </div>

          {/* Quick Shortcuts */}
          <div className="cinema-card p-4">
            <h5 className="text-white fw-bold mb-3">Quick Shortcuts</h5>
            <div className="row g-3">
              <div className="col-sm-6">
                <Link to="/my-bookings" className="text-decoration-none">
                  <div className="p-3 bg-dark rounded-3 border border-secondary hover-glow">
                    <div className="d-flex align-items-center gap-2 text-white fw-bold mb-1">
                      <IoTicketOutline className="text-primary fs-5" /> View Tickets
                    </div>
                    <small className="text-secondary">Access past & upcoming booking passes</small>
                  </div>
                </Link>
              </div>
              <div className="col-sm-6">
                <Link to="/movies" className="text-decoration-none">
                  <div className="p-3 bg-dark rounded-3 border border-secondary hover-glow">
                    <div className="d-flex align-items-center gap-2 text-white fw-bold mb-1">
                      <BiCheckShield className="text-success fs-5" /> Browse Movies
                    </div>
                    <small className="text-secondary">Discover movies now showing near you</small>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
