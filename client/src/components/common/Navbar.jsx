import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  BiMoviePlay, 
  BiSearch, 
  BiUser, 
  BiLogOut, 
  BiBookmarkHeart, 
  BiShieldQuarter 
} from 'react-icons/bi';
import { IoTicketOutline } from 'react-icons/io5';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [navExpanded, setNavExpanded] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/movies?search=${encodeURIComponent(searchQuery.trim())}`);
      setNavExpanded(false);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-cinema py-2">
      <div className="container">
        {/* Brand Logo */}
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <div 
            className="d-flex align-items-center justify-content-center rounded-3"
            style={{ 
              width: '38px', 
              height: '38px', 
              background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
              boxShadow: '0 0 15px rgba(139, 92, 246, 0.5)'
            }}
          >
            <BiMoviePlay size={24} className="text-white" />
          </div>
          <div>
            <span className="brand-font fw-bold fs-4 text-white">i<span style={{ color: '#8b5cf6' }}>Movies</span></span>
            <span className="d-block text-secondary" style={{ fontSize: '0.65rem', marginTop: '-4px', letterSpacing: '0.05em' }}>
              TICKET BOOKING MADE SIMPLE
            </span>
          </div>
        </Link>

        {/* Mobile Toggle Button */}
        <button
          className="navbar-toggler border-0 shadow-none"
          type="button"
          onClick={() => setNavExpanded(!navExpanded)}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Content */}
        <div className={`collapse navbar-collapse ${navExpanded ? 'show' : ''}`} id="navbarContent">
          {/* Main Links */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-3 gap-1">
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link px-3 ${isActive ? 'text-white fw-semibold' : 'text-secondary'}`} to="/" onClick={() => setNavExpanded(false)}>
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link px-3 ${isActive ? 'text-white fw-semibold' : 'text-secondary'}`} to="/movies" onClick={() => setNavExpanded(false)}>
                Movies
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link px-3 ${isActive ? 'text-white fw-semibold' : 'text-secondary'}`} to="/theatres" onClick={() => setNavExpanded(false)}>
                Theatres
              </NavLink>
            </li>
            {isAuthenticated && (
              <li className="nav-item">
                <NavLink className={({ isActive }) => `nav-link px-3 ${isActive ? 'text-white fw-semibold' : 'text-secondary'}`} to="/my-bookings" onClick={() => setNavExpanded(false)}>
                  My Bookings
                </NavLink>
              </li>
            )}
            {isAdmin && (
              <li className="nav-item">
                <NavLink className={({ isActive }) => `nav-link px-3 text-warning ${isActive ? 'fw-bold' : ''}`} to="/admin" onClick={() => setNavExpanded(false)}>
                  <BiShieldQuarter className="me-1" /> Admin Panel
                </NavLink>
              </li>
            )}
          </ul>

          {/* Search Bar */}
          <form className="d-flex me-lg-3 my-2 my-lg-0" onSubmit={handleSearchSubmit}>
            <div className="input-group input-group-sm" style={{ maxWidth: '280px' }}>
              <span className="input-group-text bg-dark border-secondary text-secondary">
                <BiSearch />
              </span>
              <input
                type="text"
                className="form-control bg-dark text-white border-secondary border-start-0"
                placeholder="Search movies, genre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>

          {/* User Auth Section */}
          <div className="d-flex align-items-center gap-2 mt-2 mt-lg-0">
            {isAuthenticated ? (
              <div className="dropdown">
                <button
                  className="btn btn-outline-secondary dropdown-toggle d-flex align-items-center gap-2 py-1 px-3 border-subtle text-light"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{ borderRadius: '10px' }}
                >
                  <div 
                    className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                    style={{ width: '26px', height: '26px', fontSize: '0.8rem' }}
                  >
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="small fw-medium">{user?.name?.split(' ')[0]}</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end dropdown-menu-dark bg-dark border-secondary shadow-lg">
                  <li className="px-3 py-2 border-bottom border-secondary">
                    <p className="mb-0 fw-semibold text-white">{user?.name}</p>
                    <small className="text-secondary">{user?.email}</small>
                    <div className="mt-1">
                      <span className={`badge ${user?.role === 'admin' ? 'bg-danger' : 'bg-primary'} text-uppercase`} style={{ fontSize: '0.65rem' }}>
                        {user?.role}
                      </span>
                    </div>
                  </li>
                  <li>
                    <Link className="dropdown-item py-2 d-flex align-items-center gap-2" to="/profile">
                      <BiUser /> My Profile
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item py-2 d-flex align-items-center gap-2" to="/my-bookings">
                      <IoTicketOutline /> My Bookings
                    </Link>
                  </li>
                  {isAdmin && (
                    <li>
                      <Link className="dropdown-item py-2 d-flex align-items-center gap-2 text-warning" to="/admin">
                        <BiShieldQuarter /> Admin Dashboard
                      </Link>
                    </li>
                  )}
                  <li><hr className="dropdown-divider border-secondary" /></li>
                  <li>
                    <button 
                      className="dropdown-item py-2 d-flex align-items-center gap-2 text-danger" 
                      onClick={logout}
                    >
                      <BiLogOut /> Log Out
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex gap-2">
                <Link to="/login" className="btn btn-sm btn-cinema-outline">
                  Log In
                </Link>
                <Link to="/register" className="btn btn-sm btn-cinema-primary">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

