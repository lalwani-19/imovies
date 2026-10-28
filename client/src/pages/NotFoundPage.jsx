import React from 'react';
import { Link } from 'react-router-dom';
import { BiErrorCircle, BiHomeAlt } from 'react-icons/bi';

const NotFoundPage = () => {
  return (
    <div className="container py-5 text-center my-5">
      <div 
        className="d-inline-flex align-items-center justify-content-center rounded-circle mb-4"
        style={{ width: '80px', height: '80px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}
      >
        <BiErrorCircle size={48} />
      </div>

      <h1 className="display-4 fw-bold text-white mb-2">404</h1>
      <h3 className="text-white fw-semibold mb-3">Page Not Found</h3>
      <p className="text-secondary small mx-auto mb-4" style={{ maxWidth: '440px' }}>
        The cinematic scene you are looking for has been cut from the final reel or does not exist.
      </p>

      <Link to="/" className="btn btn-cinema-primary d-inline-flex align-items-center gap-2 px-4 py-2">
        <BiHomeAlt /> Return to Homepage
      </Link>
    </div>
  );
};

export default NotFoundPage;

