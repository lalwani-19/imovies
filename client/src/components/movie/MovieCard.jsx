import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BiStar, BiTime, BiMovie } from 'react-icons/bi';

const MovieCard = ({ movie }) => {
  const [imgError, setImgError] = useState(false);

  // Fallback poster generator with gradient if external URL fails
  const fallbackPoster = `https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=500&auto=format&fit=crop`;

  return (
    <div className="cinema-card movie-card h-100 d-flex flex-column overflow-hidden position-relative">
      {/* Poster Image */}
      <div className="poster-container">
        <img
          src={!imgError && movie.posterUrl ? movie.posterUrl : fallbackPoster}
          alt={movie.title}
          className="poster-img"
          onError={() => setImgError(true)}
          loading="lazy"
        />

        {/* Status Badge */}
        <div className="position-absolute top-0 start-0 p-2 d-flex gap-1">
          {movie.status === 'upcoming' ? (
            <span className="badge bg-warning text-dark fw-bold" style={{ fontSize: '0.65rem' }}>
              COMING SOON
            </span>
          ) : (
            <span className="badge bg-success text-white fw-bold" style={{ fontSize: '0.65rem' }}>
              NOW SHOWING
            </span>
          )}
          {movie.certificate && (
            <span className="badge bg-dark border border-secondary text-light fw-medium" style={{ fontSize: '0.65rem' }}>
              {movie.certificate}
            </span>
          )}
        </div>

        {/* Rating Badge */}
        {movie.rating > 0 && (
          <div className="position-absolute top-0 end-0 p-2">
            <span className="badge badge-rating d-flex align-items-center gap-1">
              <BiStar className="text-warning" />
              <span>{movie.rating.toFixed(1)}</span>
            </span>
          </div>
        )}

        {/* Hover Overlay with synopsis and quick action */}
        <div className="poster-overlay">
          <p className="text-light small mb-3 line-clamp-3" style={{ fontSize: '0.8rem', lineHeight: '1.4' }}>
            {movie.description?.length > 120 
              ? `${movie.description.substring(0, 120)}...` 
              : movie.description}
          </p>
          <div className="d-grid gap-2">
            <Link 
              to={`/movies/${movie._id}`} 
              className="btn btn-sm btn-cinema-primary"
            >
              {movie.status === 'upcoming' ? 'View Details' : 'Book Tickets'}
            </Link>
          </div>
        </div>
      </div>

      {/* Card Info Details */}
      <div className="p-3 d-flex flex-column flex-grow-1 justify-content-between">
        <div>
          <h6 className="text-white fw-bold text-truncate mb-1" title={movie.title}>
            <Link to={`/movies/${movie._id}`} className="text-white text-decoration-none hover-primary">
              {movie.title}
            </Link>
          </h6>

          <div className="d-flex align-items-center gap-2 text-secondary small mb-2" style={{ fontSize: '0.75rem' }}>
            <span>{movie.language}</span>
            <span>•</span>
            <span className="d-flex align-items-center gap-1">
              <BiTime size={12} /> {movie.duration}m
            </span>
          </div>

          {/* Genres */}
          <div className="d-flex flex-wrap gap-1 mb-2">
            {movie.genre?.slice(0, 2).map((g, idx) => (
              <span key={idx} className="badge badge-genre">
                {g}
              </span>
            ))}
            {movie.genre?.length > 2 && (
              <span className="badge badge-genre text-muted">
                +{movie.genre.length - 2}
              </span>
            )}
          </div>
        </div>

        {/* Footer Action */}
        <div className="pt-2 border-top border-secondary border-opacity-25 d-flex justify-content-between align-items-center">
          <span className="text-muted small" style={{ fontSize: '0.72rem' }}>
            {movie.status === 'upcoming' 
              ? `Releases ${new Date(movie.releaseDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}` 
              : 'Shows Available'}
          </span>
          <Link 
            to={`/movies/${movie._id}`} 
            className="text-decoration-none small fw-semibold" 
            style={{ color: '#8b5cf6', fontSize: '0.8rem' }}
          >
            Select &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;

