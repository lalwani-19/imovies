import React from 'react';

const LoadingSpinner = ({ text = 'Loading...', fullScreen = false }) => {
  const content = (
    <div className="d-flex flex-column align-items-center justify-content-center py-5">
      <div 
        className="spinner-border text-primary" 
        style={{ width: '3rem', height: '3rem', borderWidth: '0.25em' }} 
        role="status"
      >
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-3 text-secondary fw-medium small mb-0">{text}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div 
        className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
        style={{ backgroundColor: 'rgba(9, 13, 22, 0.85)', backdropFilter: 'blur(8px)', zIndex: 9999 }}
      >
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;

