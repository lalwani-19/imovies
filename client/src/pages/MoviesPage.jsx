import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { movieService } from '../services/api';
import MovieCard from '../components/movie/MovieCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import { BiSearch, BiFilterAlt, BiSort, BiX } from 'react-icons/bi';

const MoviesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter and sort state initialized from URL params if present
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedGenre, setSelectedGenre] = useState(searchParams.get('genre') || 'All');
  const [selectedLanguage, setSelectedLanguage] = useState(searchParams.get('language') || 'All');
  const [selectedStatus, setSelectedStatus] = useState(searchParams.get('status') || 'All');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'release_newest');

  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Sync state when URL params change (e.g. from navbar search)
  useEffect(() => {
    const urlSearch = searchParams.get('search');
    const urlStatus = searchParams.get('status');
    const urlGenre = searchParams.get('genre');

    if (urlSearch !== null) setSearchQuery(urlSearch);
    if (urlStatus !== null) setSelectedStatus(urlStatus);
    if (urlGenre !== null) setSelectedGenre(urlGenre);
  }, [searchParams]);

  // Fetch movies from API
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const params = {
          search: searchQuery,
          genre: selectedGenre,
          language: selectedLanguage,
          status: selectedStatus,
          sort: sortBy,
        };

        const res = await movieService.getMovies(params);
        if (res.data?.success) {
          setMovies(res.data.data);
          setTotal(res.data.total);
          if (res.data.filterMeta) {
            setGenres(['All', ...res.data.filterMeta.genres]);
            setLanguages(['All', ...res.data.filterMeta.languages]);
          }
        }
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [searchQuery, selectedGenre, selectedLanguage, selectedStatus, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedGenre('All');
    setSelectedLanguage('All');
    setSelectedStatus('All');
    setSortBy('release_newest');
    setSearchParams({});
  };

  const hasActiveFilters = searchQuery !== '' || selectedGenre !== 'All' || selectedLanguage !== 'All' || selectedStatus !== 'All';

  return (
    <div className="container py-4">
      {/* Header Bar */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h1 className="h2 text-white fw-bold mb-1">Explore Movies</h1>
          <p className="text-secondary small mb-0">
            Discover the latest blockbusters, critically acclaimed features, and upcoming premieres.
          </p>
        </div>

        {/* Search Bar */}
        <div className="input-group" style={{ maxWidth: '340px' }}>
          <span className="input-group-text bg-dark border-secondary text-secondary">
            <BiSearch />
          </span>
          <input
            type="text"
            className="form-control bg-dark border-secondary text-white"
            placeholder="Search by title, director, cast..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              className="btn btn-dark border-secondary text-secondary"
              type="button"
              onClick={() => setSearchQuery('')}
            >
              <BiX />
            </button>
          )}
        </div>
      </div>

      {/* Filter and Sort Control Bar */}
      <div className="cinema-card p-3 mb-4">
        <div className="row g-3 align-items-center">
          {/* Status Filter */}
          <div className="col-lg-3 col-sm-6">
            <label className="text-secondary small fw-medium mb-1 d-flex align-items-center gap-1">
              <BiFilterAlt /> Release Status
            </label>
            <select
              className="form-select form-select-sm bg-dark border-secondary text-light"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="All">All Movies</option>
              <option value="now-showing">Now Showing</option>
              <option value="upcoming">Upcoming</option>
            </select>
          </div>

          {/* Genre Filter */}
          <div className="col-lg-3 col-sm-6">
            <label className="text-secondary small fw-medium mb-1">Genre</label>
            <select
              className="form-select form-select-sm bg-dark border-secondary text-light"
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
            >
              {genres.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          {/* Language Filter */}
          <div className="col-lg-3 col-sm-6">
            <label className="text-secondary small fw-medium mb-1">Language</label>
            <select
              className="form-select form-select-sm bg-dark border-secondary text-light"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
            >
              {languages.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="col-lg-3 col-sm-6">
            <label className="text-secondary small fw-medium mb-1 d-flex align-items-center gap-1">
              <BiSort /> Sort By
            </label>
            <select
              className="form-select form-select-sm bg-dark border-secondary text-light"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="release_newest">Newest Releases</option>
              <option value="rating_desc">Top Rated (High to Low)</option>
              <option value="rating_asc">Lowest Rated</option>
              <option value="title_asc">Title (A - Z)</option>
              <option value="title_desc">Title (Z - A)</option>
            </select>
          </div>
        </div>

        {/* Active Filter Clear indicator */}
        {hasActiveFilters && (
          <div className="d-flex align-items-center justify-content-between mt-3 pt-2 border-top border-secondary border-opacity-25">
            <div className="d-flex align-items-center gap-2 small text-secondary">
              <span>Showing results for active filters</span>
              {selectedStatus !== 'All' && <span className="badge bg-secondary">{selectedStatus}</span>}
              {selectedGenre !== 'All' && <span className="badge bg-secondary">{selectedGenre}</span>}
              {selectedLanguage !== 'All' && <span className="badge bg-secondary">{selectedLanguage}</span>}
            </div>
            <button
              onClick={handleResetFilters}
              className="btn btn-sm btn-link text-warning text-decoration-none p-0 small"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>

      {/* Movies Grid */}
      {loading ? (
        <LoadingSpinner text="Searching movie archives..." />
      ) : movies.length > 0 ? (
        <>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="text-secondary small">
              Found <strong>{total}</strong> {total === 1 ? 'movie' : 'movies'}
            </span>
          </div>
          <div className="row g-4 row-cols-2 row-cols-md-3 row-cols-lg-4">
            {movies.map((movie) => (
              <div key={movie._id} className="col">
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        </>
      ) : (
        <EmptyState
          title="No Movies Match Your Criteria"
          description="Try modifying your search term or reset your filters to view all available movies."
          actionText="Reset Filters"
          onActionClick={handleResetFilters}
        />
      )}
    </div>
  );
};

export default MoviesPage;
