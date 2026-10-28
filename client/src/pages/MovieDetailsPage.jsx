import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { movieService } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import { 
  BiStar, 
  BiTime, 
  BiCalendar, 
  BiMoviePlay, 
  BiMapPin, 
  BiArrowBack,
  BiCameraMovie 
} from 'react-icons/bi';
import { IoTicketOutline } from 'react-icons/io5';

const MovieDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableDates, setAvailableDates] = useState([]);

  useEffect(() => {
    const fetchMovieAndShows = async () => {
      try {
        setLoading(true);
        // Fetch movie details
        const movieRes = await movieService.getMovieById(id);
        if (movieRes.data?.success) {
          setMovie(movieRes.data.data);
        }

        // Fetch available shows for this movie
        const showsRes = await movieService.getMovieShows(id);
        if (showsRes.data?.success) {
          const fetchedShows = showsRes.data.data;
          setShows(fetchedShows);

          // Extract unique dates from the shows
          const uniqueDates = [...new Set(fetchedShows.map((s) => s.date))].sort();
          setAvailableDates(uniqueDates);
          if (uniqueDates.length > 0) {
            setSelectedDate(uniqueDates[0]);
          }
        }
      } catch (error) {
        console.error('Error loading movie details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieAndShows();
  }, [id]);

  if (loading) {
    return <LoadingSpinner text="Loading movie information and cinema showtimes..." />;
  }

  if (!movie) {
    return (
      <div className="container py-5">
        <EmptyState
          title="Movie Not Found"
          description="The requested movie could not be located in our system."
          actionText="Back to Movies"
          actionLink="/movies"
        />
      </div>
    );
  }

  // Group shows on selected date by Theatre
  const showsOnSelectedDate = shows.filter((s) => s.date === selectedDate);
  const showsByTheatre = showsOnSelectedDate.reduce((acc, show) => {
    const theatreId = show.theatre?._id;
    if (!theatreId) return acc;
    if (!acc[theatreId]) {
      acc[theatreId] = {
        theatre: show.theatre,
        screenName: show.screenName,
        shows: [],
      };
    }
    acc[theatreId].shows.push(show);
    return acc;
  }, {});

  // YouTube trailer helper
  const getEmbedUrl = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=0&rel=0` : null;
  };
  const embedUrl = getEmbedUrl(movie.trailerUrl);

  return (
    <div className="movie-details-page pb-5">
      {/* 1. Backdrop Header */}
      <div 
        className="position-relative text-white py-5"
        style={{
          backgroundImage: `url(${movie.backdropUrl || movie.posterUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div 
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{ background: 'linear-gradient(to bottom, rgba(9, 13, 22, 0.85) 0%, rgba(9, 13, 22, 0.98) 100%)' }}
        ></div>

        <div className="container position-relative z-1">
          <button 
            onClick={() => navigate(-1)} 
            className="btn btn-sm btn-cinema-outline mb-4 d-inline-flex align-items-center gap-1"
          >
            <BiArrowBack /> Back
          </button>

          <div className="row g-4 align-items-start">
            {/* Poster column */}
            <div className="col-md-4 col-lg-3 text-center text-md-start">
              <div className="poster-container shadow-2xl mx-auto mx-md-0" style={{ maxWidth: '280px' }}>
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="poster-img rounded-3"
                />
              </div>
            </div>

            {/* Movie metadata column */}
            <div className="col-md-8 col-lg-9">
              <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                <span className="badge bg-primary text-uppercase px-2 py-1 fw-bold">
                  {movie.certificate || 'UA'}
                </span>
                <span className="badge badge-rating d-flex align-items-center gap-1 px-2 py-1">
                  <BiStar className="text-warning" /> {movie.rating?.toFixed(1) || 'N/A'}
                  <span className="text-muted fw-normal" style={{ fontSize: '0.7rem' }}>
                    ({movie.voteCount || 0} reviews)
                  </span>
                </span>
                <span className="badge bg-dark border border-secondary text-light">
                  {movie.language}
                </span>
              </div>

              <h1 className="display-5 fw-bold text-white mb-2">{movie.title}</h1>

              <div className="d-flex flex-wrap align-items-center gap-3 text-secondary small mb-3">
                <span className="d-flex align-items-center gap-1">
                  <BiTime className="text-primary" /> {movie.duration} minutes
                </span>
                <span>•</span>
                <span className="d-flex align-items-center gap-1">
                  <BiCalendar className="text-primary" /> Released {new Date(movie.releaseDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                </span>
              </div>

              {/* Genre Pills */}
              <div className="d-flex flex-wrap gap-2 mb-4">
                {movie.genre?.map((g, idx) => (
                  <span key={idx} className="badge bg-secondary bg-opacity-25 border border-secondary text-light px-3 py-2">
                    {g}
                  </span>
                ))}
              </div>

              {/* Synopsis */}
              <h6 className="text-white fw-bold mb-2">Synopsis</h6>
              <p className="text-secondary small mb-4" style={{ lineHeight: '1.7', maxWidth: '780px' }}>
                {movie.description}
              </p>

              {/* Cast & Crew Info */}
              <div className="row g-3 text-secondary small border-top border-secondary border-opacity-25 pt-3">
                {movie.director && (
                  <div className="col-sm-6">
                    <strong className="text-light">Director:</strong> {movie.director}
                  </div>
                )}
                {movie.cast && movie.cast.length > 0 && (
                  <div className="col-sm-12">
                    <strong className="text-light">Cast:</strong> {movie.cast.join(', ')}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Embedded Trailer Section (if available) */}
      {embedUrl && (
        <div className="container py-4">
          <div className="cinema-card p-4">
            <h5 className="text-white fw-bold d-flex align-items-center gap-2 mb-3">
              <BiMoviePlay className="text-primary" /> Official Trailer
            </h5>
            <div className="ratio ratio-16x9 rounded-3 overflow-hidden shadow-lg border border-secondary">
              <iframe
                src={embedUrl}
                title={`${movie.title} Trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}

      {/* 3. Theatres & Showtimes Section */}
      <div className="container py-4" id="showtimes-section">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <h3 className="text-white fw-bold mb-1 d-flex align-items-center gap-2">
              <IoTicketOutline className="text-primary" /> Select Cinema & Showtime
            </h3>
            <p className="text-secondary small mb-0">
              Pick your preferred show date and time to reserve seats.
            </p>
          </div>

          {/* Date Picker Pills */}
          {availableDates.length > 0 && (
            <div className="d-flex gap-2 overflow-auto pb-2 pb-md-0">
              {availableDates.map((dateStr) => {
                const dateObj = new Date(dateStr);
                const dayName = dateObj.toLocaleDateString(undefined, { weekday: 'short' });
                const dayNum = dateObj.getDate();
                const monthName = dateObj.toLocaleDateString(undefined, { month: 'short' });

                const isSelected = selectedDate === dateStr;

                return (
                  <button
                    key={dateStr}
                    onClick={() => setSelectedDate(dateStr)}
                    className={`btn text-center px-3 py-2 rounded-3 transition-all ${
                      isSelected
                        ? 'btn-cinema-primary shadow-lg'
                        : 'btn-cinema-outline text-secondary'
                    }`}
                    style={{ minWidth: '78px' }}
                  >
                    <div className="small text-uppercase fw-bold" style={{ fontSize: '0.65rem' }}>
                      {dayName}
                    </div>
                    <div className="fs-5 fw-bold text-white">{dayNum}</div>
                    <div className="small opacity-75" style={{ fontSize: '0.65rem' }}>
                      {monthName}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Theatres with shows list */}
        {Object.keys(showsByTheatre).length > 0 ? (
          <div className="d-flex flex-column gap-3">
            {Object.values(showsByTheatre).map(({ theatre, shows }) => (
              <div key={theatre._id} className="cinema-card p-4">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-start gap-2 border-bottom border-secondary border-opacity-25 pb-3 mb-3">
                  <div>
                    <h5 className="text-white fw-bold mb-1">{theatre.name}</h5>
                    <div className="d-flex align-items-center gap-2 text-secondary small">
                      <BiMapPin className="text-primary" />
                      <span>{theatre.address}, {theatre.city}</span>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="d-flex flex-wrap gap-1">
                    {theatre.amenities?.map((amenity, i) => (
                      <span key={i} className="badge bg-dark text-secondary border border-secondary" style={{ fontSize: '0.65rem' }}>
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Showtimes for this Theatre */}
                <div>
                  <div className="small text-secondary mb-2">Available Showtimes:</div>
                  <div className="d-flex flex-wrap gap-3">
                    {shows.map((show) => (
                      <Link
                        key={show._id}
                        to={`/book/${show._id}`}
                        className="btn btn-outline-secondary border-secondary text-light px-3 py-2 rounded-3 text-decoration-none transition-all hover-glow"
                        style={{ background: '#111827', minWidth: '130px' }}
                      >
                        <div className="fw-bold fs-6 text-white text-center">
                          {show.startTime}
                        </div>
                        <div className="text-center text-muted" style={{ fontSize: '0.7rem' }}>
                          {show.screenName}
                        </div>
                        <div className="text-center text-success mt-1 fw-medium" style={{ fontSize: '0.68rem' }}>
                          {show.availableSeats} seats left
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No Shows Scheduled"
            description={
              movie.status === 'upcoming'
                ? 'Advance ticket sales for this upcoming movie have not opened yet. Check back closer to the release date!'
                : 'No active showtimes currently available for this selected date. Try selecting another date above.'
            }
          />
        )}
      </div>
    </div>
  );
};

export default MovieDetailsPage;

