import React from 'react';
import { BiFilm } from 'react-icons/bi';
import { Link } from 'react-router-dom';

const EmptyState = ({
  icon: Icon = BiFilm,
  title = 'No Results Found',
  description = 'We couldn\'t find anything matching your search or filters.',
  actionText,
  actionLink,
  onActionClick,
}) => {
  return (
    <div className="text-center py-5 px-3 my-4 cinema-card border-dashed">
      <div 
        className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
        style={{ width: '64px', height: '64px', backgroundColor: 'rgba(255, 255, 255, 0.05)', color: '#8b5cf6' }}
      >
        <Icon size={32} />
      </div>
      <h5 className="text-white fw-bold mb-2">{title}</h5>
      <p className="text-secondary small mx-auto mb-4" style={{ maxWidth: '420px' }}>
        {description}
      </p>
      {actionText && actionLink && (
        <Link to={actionLink} className="btn btn-sm btn-cinema-primary">
          {actionText}
        </Link>
      )}
      {actionText && onActionClick && (
        <button onClick={onActionClick} className="btn btn-sm btn-cinema-outline">
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;

