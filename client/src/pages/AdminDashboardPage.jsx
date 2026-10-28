import React, { useState, useEffect } from 'react';
import { movieService, theatreService, showService, bookingService } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { 
  BiShieldQuarter, 
  BiMovie, 
  BiCameraMovie, 
  BiCalendar, 
  BiTrash, 
  BiPlus, 
  BiSearch, 
  BiRefresh,
  BiCheckCircle 
} from 'react-icons/bi';
import { IoTicketOutline } from 'react-icons/io5';

const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('movies');
  const [loading, setLoading] = useState(true);

  // Data states
  const [movies, setMovies] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [shows, setShows] = useState([]);
  const [bookings, setBookings] = useState([]);

  // New Movie Form State
  const [newMovie, setNewMovie] = useState({
    title: '',
    description: '',
    posterUrl: '',
    backdropUrl: '',
    genre: 'Action, Sci-Fi',
    duration: 140,
    language: 'English',
    releaseDate: new Date().toISOString().split('T')[0],
    rating: 8.5,
    status: 'now-showing',
    certificate: 'UA',
    director: '',
    cast: 'Lead Actor, Supporting Actor',
    trailerUrl: '',
  });

  // New Show Form State
  const [newShow, setNewShow] = useState({
    movie: '',
    theatre: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '19:30',
    screenName: 'Screen 1 - Dolby Atmos',
  });

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [moviesRes, theatresRes, showsRes, bookingsRes] = await Promise.all([
        movieService.getMovies({ limit: 50 }),
        theatreService.getTheatres(),
        showService.getShows(),
        bookingService.getAllBookings(),
      ]);

      if (moviesRes.data?.success) setMovies(moviesRes.data.data);
      if (theatresRes.data?.success) setTheatres(theatresRes.data.data);
      if (showsRes.data?.success) setShows(showsRes.data.data);
      if (bookingsRes.data?.success) setBookings(bookingsRes.data.data);

      // Default dropdown values
      if (moviesRes.data?.data?.length > 0 && !newShow.movie) {
        setNewShow((prev) => ({ ...prev, movie: moviesRes.data.data[0]._id }));
      }
      if (theatresRes.data?.data?.length > 0 && !newShow.theatre) {
        setNewShow((prev) => ({ ...prev, theatre: theatresRes.data.data[0]._id }));
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast.error('Could not load all administrative records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  // Handle Add Movie
  const handleCreateMovie = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newMovie,
        genre: newMovie.genre.split(',').map((g) => g.trim()),
        cast: newMovie.cast.split(',').map((c) => c.trim()),
        duration: Number(newMovie.duration),
        rating: Number(newMovie.rating),
      };

      const res = await movieService.createMovie(payload);
      if (res.data?.success) {
        toast.success(`Movie "${newMovie.title}" added successfully!`);
        setNewMovie({
          title: '',
          description: '',
          posterUrl: '',
          backdropUrl: '',
          genre: 'Action, Sci-Fi',
          duration: 140,
          language: 'English',
          releaseDate: new Date().toISOString().split('T')[0],
          rating: 8.5,
          status: 'now-showing',
          certificate: 'UA',
          director: '',
          cast: '',
          trailerUrl: '',
        });
        fetchAdminData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create movie.');
    }
  };

  // Handle Delete Movie
  const handleDeleteMovie = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      const res = await movieService.deleteMovie(id);
      if (res.data?.success) {
        toast.success(`Movie "${title}" removed.`);
        fetchAdminData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete movie.');
    }
  };

  // Handle Create Show
  const handleCreateShow = async (e) => {
    e.preventDefault();
    try {
      const res = await showService.createShow(newShow);
      if (res.data?.success) {
        toast.success('New showtime scheduled successfully!');
        fetchAdminData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to schedule show.');
    }
  };

  // Handle Delete Show
  const handleDeleteShow = async (id) => {
    if (!window.confirm('Delete this show schedule?')) return;
    try {
      const res = await showService.deleteShow(id);
      if (res.data?.success) {
        toast.success('Showtime removed.');
        fetchAdminData();
      }
    } catch (error) {
      toast.error('Failed to delete show.');
    }
  };

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="badge bg-danger text-uppercase fw-bold">Admin Console</span>
          </div>
          <h1 className="h2 text-white fw-bold mb-0 d-flex align-items-center gap-2">
            <BiShieldQuarter className="text-warning" /> Cinema Management Control
          </h1>
        </div>

        <button onClick={fetchAdminData} className="btn btn-sm btn-cinema-outline d-flex align-items-center gap-1">
          <BiRefresh /> Refresh Data
        </button>
      </div>

      {/* Metrics Row */}
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-lg-3">
          <div className="cinema-card p-3 d-flex align-items-center gap-3">
            <div className="p-2 rounded-3 bg-primary bg-opacity-20 text-primary fs-3">
              <BiMovie />
            </div>
            <div>
              <div className="text-secondary small">Total Movies</div>
              <h4 className="text-white fw-bold mb-0">{movies.length}</h4>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="cinema-card p-3 d-flex align-items-center gap-3">
            <div className="p-2 rounded-3 bg-info bg-opacity-20 text-info fs-3">
              <BiCameraMovie />
            </div>
            <div>
              <div className="text-secondary small">Cinemas / Theatres</div>
              <h4 className="text-white fw-bold mb-0">{theatres.length}</h4>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="cinema-card p-3 d-flex align-items-center gap-3">
            <div className="p-2 rounded-3 bg-warning bg-opacity-20 text-warning fs-3">
              <BiCalendar />
            </div>
            <div>
              <div className="text-secondary small">Active Showtimes</div>
              <h4 className="text-white fw-bold mb-0">{shows.length}</h4>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="cinema-card p-3 d-flex align-items-center gap-3">
            <div className="p-2 rounded-3 bg-success bg-opacity-20 text-success fs-3">
              <IoTicketOutline />
            </div>
            <div>
              <div className="text-secondary small">Total Bookings</div>
              <h4 className="text-white fw-bold mb-0">{bookings.length}</h4>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <ul className="nav nav-pills gap-2 mb-4">
        <li className="nav-item">
          <button
            className={`btn btn-sm ${activeTab === 'movies' ? 'btn-cinema-primary' : 'btn-cinema-outline text-secondary'}`}
            onClick={() => setActiveTab('movies')}
          >
            Manage Movies ({movies.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`btn btn-sm ${activeTab === 'shows' ? 'btn-cinema-primary' : 'btn-cinema-outline text-secondary'}`}
            onClick={() => setActiveTab('shows')}
          >
            Schedule Shows ({shows.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`btn btn-sm ${activeTab === 'bookings' ? 'btn-cinema-primary' : 'btn-cinema-outline text-secondary'}`}
            onClick={() => setActiveTab('bookings')}
          >
            Booking Records ({bookings.length})
          </button>
        </li>
      </ul>

      {loading ? (
        <LoadingSpinner text="Synchronizing admin state..." />
      ) : (
        <>
          {/* TAB 1: MOVIES */}
          {activeTab === 'movies' && (
            <div className="row g-4">
              {/* Add Movie Form */}
              <div className="col-lg-5">
                <div className="cinema-card p-4">
                  <h5 className="text-white fw-bold mb-3 d-flex align-items-center gap-2">
                    <BiPlus className="text-primary" /> Add New Movie Listing
                  </h5>
                  <form onSubmit={handleCreateMovie} className="small">
                    <div className="mb-2">
                      <label className="text-secondary mb-1">Movie Title</label>
                      <input
                        type="text"
                        className="form-control form-control-sm bg-dark border-secondary text-white"
                        value={newMovie.title}
                        onChange={(e) => setNewMovie({ ...newMovie, title: e.target.value })}
                        required
                      />
                    </div>
                    <div className="mb-2">
                      <label className="text-secondary mb-1">Poster URL (Image Link)</label>
                      <input
                        type="url"
                        className="form-control form-control-sm bg-dark border-secondary text-white"
                        placeholder="https://image.tmdb.org/..."
                        value={newMovie.posterUrl}
                        onChange={(e) => setNewMovie({ ...newMovie, posterUrl: e.target.value })}
                        required
                      />
                    </div>
                    <div className="mb-2">
                      <label className="text-secondary mb-1">Backdrop URL (Optional)</label>
                      <input
                        type="url"
                        className="form-control form-control-sm bg-dark border-secondary text-white"
                        value={newMovie.backdropUrl}
                        onChange={(e) => setNewMovie({ ...newMovie, backdropUrl: e.target.value })}
                      />
                    </div>
                    <div className="row g-2 mb-2">
                      <div className="col-6">
                        <label className="text-secondary mb-1">Status</label>
                        <select
                          className="form-select form-select-sm bg-dark border-secondary text-white"
                          value={newMovie.status}
                          onChange={(e) => setNewMovie({ ...newMovie, status: e.target.value })}
                        >
                          <option value="now-showing">Now Showing</option>
                          <option value="upcoming">Upcoming</option>
                        </select>
                      </div>
                      <div className="col-6">
                        <label className="text-secondary mb-1">Certificate</label>
                        <select
                          className="form-select form-select-sm bg-dark border-secondary text-white"
                          value={newMovie.certificate}
                          onChange={(e) => setNewMovie({ ...newMovie, certificate: e.target.value })}
                        >
                          <option value="U">U (Universal)</option>
                          <option value="UA">UA (Parental Guidance)</option>
                          <option value="A">A (Adults Only)</option>
                        </select>
                      </div>
                    </div>
                    <div className="row g-2 mb-2">
                      <div className="col-6">
                        <label className="text-secondary mb-1">Duration (mins)</label>
                        <input
                          type="number"
                          className="form-control form-control-sm bg-dark border-secondary text-white"
                          value={newMovie.duration}
                          onChange={(e) => setNewMovie({ ...newMovie, duration: e.target.value })}
                          required
                        />
                      </div>
                      <div className="col-6">
                        <label className="text-secondary mb-1">Rating (0 - 10)</label>
                        <input
                          type="number"
                          step="0.1"
                          className="form-control form-control-sm bg-dark border-secondary text-white"
                          value={newMovie.rating}
                          onChange={(e) => setNewMovie({ ...newMovie, rating: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="mb-2">
                      <label className="text-secondary mb-1">Genres (comma separated)</label>
                      <input
                        type="text"
                        className="form-control form-control-sm bg-dark border-secondary text-white"
                        value={newMovie.genre}
                        onChange={(e) => setNewMovie({ ...newMovie, genre: e.target.value })}
                        required
                      />
                    </div>
                    <div className="mb-2">
                      <label className="text-secondary mb-1">Director</label>
                      <input
                        type="text"
                        className="form-control form-control-sm bg-dark border-secondary text-white"
                        value={newMovie.director}
                        onChange={(e) => setNewMovie({ ...newMovie, director: e.target.value })}
                      />
                    </div>
                    <div className="mb-2">
                      <label className="text-secondary mb-1">YouTube Trailer URL</label>
                      <input
                        type="url"
                        className="form-control form-control-sm bg-dark border-secondary text-white"
                        placeholder="https://www.youtube.com/watch?v=..."
                        value={newMovie.trailerUrl}
                        onChange={(e) => setNewMovie({ ...newMovie, trailerUrl: e.target.value })}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="text-secondary mb-1">Synopsis</label>
                      <textarea
                        rows="3"
                        className="form-control form-control-sm bg-dark border-secondary text-white"
                        value={newMovie.description}
                        onChange={(e) => setNewMovie({ ...newMovie, description: e.target.value })}
                        required
                      ></textarea>
                    </div>
                    <button type="submit" className="btn btn-cinema-primary w-100 py-2">
                      Publish Movie
                    </button>
                  </form>
                </div>
              </div>

              {/* Movies Table */}
              <div className="col-lg-7">
                <div className="cinema-card p-4">
                  <h5 className="text-white fw-bold mb-3">Live Movie Catalog</h5>
                  <div className="table-responsive">
                    <table className="table table-dark table-hover align-middle small mb-0">
                      <thead>
                        <tr className="text-secondary">
                          <th>Movie</th>
                          <th>Status</th>
                          <th>Rating</th>
                          <th>Language</th>
                          <th className="text-end">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {movies.map((m) => (
                          <tr key={m._id}>
                            <td>
                              <div className="d-flex align-items-center gap-2">
                                <img
                                  src={m.posterUrl}
                                  alt={m.title}
                                  className="rounded"
                                  style={{ width: '32px', height: '46px', objectFit: 'cover' }}
                                />
                                <div>
                                  <strong className="text-white">{m.title}</strong>
                                  <div className="text-muted" style={{ fontSize: '0.7rem' }}>{m.duration} mins</div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className={`badge ${m.status === 'now-showing' ? 'bg-success' : 'bg-warning text-dark'}`}>
                                {m.status}
                              </span>
                            </td>
                            <td className="text-warning fw-bold">★ {m.rating}</td>
                            <td className="text-secondary">{m.language}</td>
                            <td className="text-end">
                              <button
                                onClick={() => handleDeleteMovie(m._id, m.title)}
                                className="btn btn-sm btn-outline-danger p-1"
                                title="Delete movie"
                              >
                                <BiTrash size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SHOWTIMES */}
          {activeTab === 'shows' && (
            <div className="row g-4">
              {/* Schedule Show Form */}
              <div className="col-lg-4">
                <div className="cinema-card p-4">
                  <h5 className="text-white fw-bold mb-3 d-flex align-items-center gap-2">
                    <BiCalendar className="text-primary" /> Schedule Showtime
                  </h5>
                  <form onSubmit={handleCreateShow} className="small">
                    <div className="mb-3">
                      <label className="text-secondary mb-1">Select Movie</label>
                      <select
                        className="form-select form-select-sm bg-dark border-secondary text-white"
                        value={newShow.movie}
                        onChange={(e) => setNewShow({ ...newShow, movie: e.target.value })}
                        required
                      >
                        {movies.map((m) => (
                          <option key={m._id} value={m._id}>{m.title}</option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="text-secondary mb-1">Select Theatre</label>
                      <select
                        className="form-select form-select-sm bg-dark border-secondary text-white"
                        value={newShow.theatre}
                        onChange={(e) => setNewShow({ ...newShow, theatre: e.target.value })}
                        required
                      >
                        {theatres.map((t) => (
                          <option key={t._id} value={t._id}>{t.name} ({t.city})</option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="text-secondary mb-1">Screen / Auditorium Name</label>
                      <input
                        type="text"
                        className="form-control form-control-sm bg-dark border-secondary text-white"
                        value={newShow.screenName}
                        onChange={(e) => setNewShow({ ...newShow, screenName: e.target.value })}
                        required
                      />
                    </div>

                    <div className="row g-2 mb-3">
                      <div className="col-6">
                        <label className="text-secondary mb-1">Date</label>
                        <input
                          type="date"
                          className="form-control form-control-sm bg-dark border-secondary text-white"
                          value={newShow.date}
                          onChange={(e) => setNewShow({ ...newShow, date: e.target.value })}
                          required
                        />
                      </div>
                      <div className="col-6">
                        <label className="text-secondary mb-1">Start Time (HH:mm)</label>
                        <input
                          type="text"
                          className="form-control form-control-sm bg-dark border-secondary text-white"
                          placeholder="18:30"
                          value={newShow.startTime}
                          onChange={(e) => setNewShow({ ...newShow, startTime: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <button type="submit" className="btn btn-cinema-primary w-100 py-2">
                      Schedule Show
                    </button>
                  </form>
                </div>
              </div>

              {/* Scheduled Shows Table */}
              <div className="col-lg-8">
                <div className="cinema-card p-4">
                  <h5 className="text-white fw-bold mb-3">Active Schedules</h5>
                  <div className="table-responsive">
                    <table className="table table-dark table-hover align-middle small mb-0">
                      <thead>
                        <tr className="text-secondary">
                          <th>Movie</th>
                          <th>Theatre</th>
                          <th>Date</th>
                          <th>Time</th>
                          <th>Available</th>
                          <th className="text-end">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {shows.map((s) => (
                          <tr key={s._id}>
                            <td>
                              <strong className="text-white">{s.movie?.title}</strong>
                            </td>
                            <td className="text-secondary">{s.theatre?.name}</td>
                            <td>{s.date}</td>
                            <td className="text-primary fw-bold">{s.startTime}</td>
                            <td>
                              <span className="badge bg-secondary">
                                {s.availableSeats} / {s.totalSeats}
                              </span>
                            </td>
                            <td className="text-end">
                              <button
                                onClick={() => handleDeleteShow(s._id)}
                                className="btn btn-sm btn-outline-danger p-1"
                                title="Remove Show"
                              >
                                <BiTrash size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BOOKINGS LOG */}
          {activeTab === 'bookings' && (
            <div className="cinema-card p-4">
              <h5 className="text-white fw-bold mb-3">Master Booking Audit Log</h5>
              <div className="table-responsive">
                <table className="table table-dark table-hover align-middle small mb-0">
                  <thead>
                    <tr className="text-secondary">
                      <th>Booking Ref</th>
                      <th>User</th>
                      <th>Movie</th>
                      <th>Theatre</th>
                      <th>Date / Time</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b) => (
                      <tr key={b._id}>
                        <td>
                          <span className="badge bg-dark border border-secondary text-warning">
                            {b.bookingReference}
                          </span>
                        </td>
                        <td>
                          <div className="text-white fw-medium">{b.user?.name || 'Customer'}</div>
                          <div className="text-muted" style={{ fontSize: '0.7rem' }}>{b.user?.email}</div>
                        </td>
                        <td className="text-white">{b.movie?.title}</td>
                        <td className="text-secondary">{b.theatre?.name}</td>
                        <td>{b.show?.date} • {b.show?.startTime}</td>
                        <td className="text-warning fw-bold">₹{b.pricing?.totalAmount}</td>
                        <td>
                          <span className={`badge ${b.status === 'CONFIRMED' ? 'bg-success' : 'bg-danger'}`}>
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminDashboardPage;
