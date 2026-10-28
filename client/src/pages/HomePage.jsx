import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { movieService } from '../services/api';
import MovieCard from '../components/movie/MovieCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import { 
  BiMoviePlay, 
  BiStar, 
  BiTime, 
  BiCalendar, 
  BiSearch, 
  BiCheckShield, 
  BiQrScan, 
  BiRefresh, 
  BiCrown 
} from 'react-icons/bi';
import { IoTicketOutline } from 'react-icons/io5';

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const res = await movieService.getMovies({ limit: 12 });
        if (res.data?.success) {
          setMovies(res.data.data);
          if (res.data.filterMeta?.genres) {
            setGenres(['All', ...res.data.filterMeta.genres]);
          }
        }
      } catch (error) {
        console.error('Error fetching homepage movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const nowShowingMovies = movies.filter((m) => m.status === 'now-showing');
  const upcomingMovies = movies.filter((m) => m.status === 'upcoming');
  const featuredMovie = movies.find((m) => m.featured) || movies[0];

  const filteredNowShowing = selectedGenre === 'All'
    ? nowShowingMovies
    : nowShowingMovies.filter((m) => m.genre?.includes(selectedGenre));

  return (
    <div className="home-page pb-5">
      {/* 1. Hero Showcase Banner */}
      {featuredMovie && (
        <section className="container pt-3 pb-5">
          <div 
            className="hero-backdrop shadow-2xl p-4 p-md-5"
            style={{ 
              backgroundImage: `url(${featuredMovie.backdropUrl || featuredMovie.posterUrl})`,
            }}
          >
            <div className="hero-overlay"></div>
            <div className="position-relative text-white col-lg-7 col-md-9 z-1">
              <div className="d-flex align-items-center gap-2 mb-2">
                <span className="badge bg-danger text-uppercase fw-bold px-2 py-1" style={{ fontSize: '0.7rem' }}>
                  FEATURED PREMIERE
                </span>
                <span className="badge badge-rating d-flex align-items-center gap-1">
                  <BiStar className="text-warning" /> {featuredMovie.rating?.toFixed(1) || '8.8'}
                </span>
                <span className="text-secondary small">
                  {featuredMovie.certificate || 'UA'} • {featuredMovie.duration} mins
                </span>
              </div>

              <h1 className="display-4 fw-extrabold text-white mb-3" style={{ lineHeight: '1.1' }}>
                {featuredMovie.title}
              </h1>

              <p className="text-light opacity-75 mb-4 d-none d-md-block line-clamp-3" style={{ fontSize: '0.95rem', maxWidth: '580px' }}>
                {featuredMovie.description}
              </p>

              {/* Cast and Genres */}
              <div className="d-flex flex-wrap gap-2 mb-4">
                {featuredMovie.genre?.map((g, i) => (
                  <span key={i} className="badge bg-dark bg-opacity-75 border border-secondary text-light">
                    {g}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="d-flex flex-wrap gap-3">
                <Link to={`/movies/${featuredMovie._id}`} className="btn btn-cinema-primary d-flex align-items-center gap-2 px-4 py-2">
                  <IoTicketOutline size={20} /> Book Tickets Now
                </Link>
                {featuredMovie.trailerUrl && (
                  <a 
                    href={featuredMovie.trailerUrl} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="btn btn-cinema-outline d-flex align-items-center gap-2"
                  >
                    <BiMoviePlay size={18} /> Watch Trailer
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 2. Value Proposition Perks */}
      <section className="container mb-5">
        <div className="row g-3">
          <div className="col-md-3 col-6">
            <div className="cinema-card p-3 d-flex align-items-center gap-3">
              <div className="rounded-3 p-2 bg-primary bg-opacity-10 text-primary fs-3">
                <BiCheckShield />
              </div>
              <div>
                <h6 className="text-white fw-bold mb-0" style={{ fontSize: '0.9rem' }}>100% Safe Checkout</h6>
                <small className="text-secondary">Simulated demo payments</small>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-6">
            <div className="cinema-card p-3 d-flex align-items-center gap-3">
              <div className="rounded-3 p-2 bg-success bg-opacity-10 text-success fs-3">
                <BiQrScan />
              </div>
              <div>
                <h6 className="text-white fw-bold mb-0" style={{ fontSize: '0.9rem' }}>Instant E-Tickets</h6>
                <small className="text-secondary">Direct QR gate entry</small>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-6">
            <div className="cinema-card p-3 d-flex align-items-center gap-3">
              <div className="rounded-3 p-2 bg-warning bg-opacity-10 text-warning fs-3">
                <BiRefresh />
              </div>
              <div>
                <h6 className="text-white fw-bold mb-0" style={{ fontSize: '0.9rem' }}>Easy Cancellation</h6>
                <small className="text-secondary">Instant seat release</small>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-6">
            <div className="cinema-card p-3 d-flex align-items-center gap-3">
              <div className="rounded-3 p-2 bg-info bg-opacity-10 text-info fs-3">
                <BiCrown />
              </div>
              <div>
                <h6 className="text-white fw-bold mb-0" style={{ fontSize: '0.9rem' }}>Dolby Atmos & IMAX</h6>
                <small className="text-secondary">Luxury cinema sound</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Now Showing Movies */}
      <section className="container mb-5">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <span className="text-primary fw-semibold small text-uppercase letter-spacing-1">
              CURRENTLY IN CINEMAS
            </span>
            <h2 className="text-white fw-bold mb-0">Now Showing</h2>
          </div>

          {/* Genre Filter Pills */}
          <div className="d-flex gap-2 overflow-auto pb-2 pb-md-0" style={{ maxWidth: '100%' }}>
            {genres.slice(0, 6).map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGenre(g)}
                className={`btn btn-sm text-nowrap rounded-pill px-3 ${
                  selectedGenre === g
                    ? 'btn-cinema-primary'
                    : 'btn-cinema-outline text-secondary'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <LoadingSpinner text="Fetching movie showtimes..." />
        ) : filteredNowShowing.length > 0 ? (
          <div className="row g-4 row-cols-2 row-cols-md-3 row-cols-lg-4">
            {filteredNowShowing.map((movie) => (
              <div key={movie._id} className="col">
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No Now Showing Movies"
            description={`No movies currently listed under the "${selectedGenre}" genre.`}
            actionText="Clear Filter"
            onActionClick={() => setSelectedGenre('All')}
          />
        )}
      </section>

      {/* 4. Upcoming Releases Banner & Grid */}
      <section className="container mb-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <span className="text-warning fw-semibold small text-uppercase letter-spacing-1">
              COMING SOON
            </span>
            <h2 className="text-white fw-bold mb-0">Upcoming Blockbusters</h2>
          </div>
          <Link to="/movies?status=upcoming" className="text-primary text-decoration-none fw-medium small hover-underline">
            View All Upcoming &rarr;
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : upcomingMovies.length > 0 ? (
          <div className="row g-4 row-cols-2 row-cols-md-3 row-cols-lg-4">
            {upcomingMovies.slice(0, 4).map((movie) => (
              <div key={movie._id} className="col">
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="No upcoming movies" description="Check back soon for upcoming theatrical releases." />
        )}
      </section>

      {/* 5. Promotional Call-to-Action Card */}
      <section className="container">
        <div 
          className="cinema-card p-4 p-md-5 text-center position-relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #1e1b4b, #0f172a)', borderColor: 'rgba(139, 92, 246, 0.3)' }}
        >
          <div className="position-relative z-1 max-w-lg mx-auto">
            <span className="badge bg-primary bg-opacity-25 text-primary border border-primary border-opacity-50 px-3 py-1 mb-3">
              PREMIER REWARDS
            </span>
            <h3 className="text-white fw-bold mb-2">Book Your Next Movie Night in Seconds</h3>
            <p className="text-secondary small mb-4 mx-auto" style={{ maxWidth: '520px' }}>
              Choose your preferred theatre, pick the perfect recliner or VIP seat with live seat views, and enjoy instant paperless confirmation.
            </p>
            <Link to="/movies" className="btn btn-cinema-primary px-4 py-2">
              Explore All Movies & Showtimes
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
