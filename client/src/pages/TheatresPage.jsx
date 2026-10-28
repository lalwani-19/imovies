import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { theatreService, showService } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import { BiMapPin, BiCameraMovie, BiCheckCircle, BiCalendar } from 'react-icons/bi';

const TheatresPage = () => {
  const [theatres, setTheatres] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTheatres = async () => {
      try {
        setLoading(true);
        const res = await theatreService.getTheatres({ city: selectedCity });
        if (res.data?.success) {
          setTheatres(res.data.data);
          if (res.data.cities) {
            setCities(['All', ...res.data.cities]);
          }
        }
      } catch (error) {
        console.error('Error fetching theatres:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTheatres();
  }, [selectedCity]);

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h1 className="h2 text-white fw-bold mb-1">Cinemas & Theatres</h1>
          <p className="text-secondary small mb-0">
            Find the nearest partner cinemas equipped with IMAX, 4DX, and Dolby Atmos audio systems.
          </p>
        </div>

        {/* City Filter Pills */}
        <div className="d-flex gap-2 overflow-auto pb-2 pb-md-0">
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`btn btn-sm rounded-pill px-3 ${
                selectedCity === city
                  ? 'btn-cinema-primary'
                  : 'btn-cinema-outline text-secondary'
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* Theatres List */}
      {loading ? (
        <LoadingSpinner text="Locating cinemas..." />
      ) : theatres.length > 0 ? (
        <div className="row g-4">
          {theatres.map((theatre) => (
            <div key={theatre._id} className="col-lg-6">
              <div className="cinema-card p-4 h-100 d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="text-white fw-bold mb-0">{theatre.name}</h5>
                    <span className="badge bg-secondary bg-opacity-25 border border-secondary text-primary">
                      {theatre.city}
                    </span>
                  </div>

                  <p className="text-secondary small d-flex align-items-center gap-2 mb-3">
                    <BiMapPin className="text-primary" /> {theatre.address}
                  </p>

                  {/* Screens */}
                  <div className="mb-3">
                    <div className="text-muted small mb-1">Screens & Auditoriums:</div>
                    <div className="d-flex flex-wrap gap-2">
                      {theatre.screens?.map((screen, idx) => (
                        <div key={idx} className="bg-dark p-2 rounded-2 border border-secondary small text-light">
                          <strong className="text-white">{screen.name}</strong>
                          <span className="text-muted ms-2">({screen.totalSeats} seats)</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="mb-3">
                    <div className="text-muted small mb-1">Cinema Amenities:</div>
                    <div className="d-flex flex-wrap gap-1">
                      {theatre.amenities?.map((amenity, i) => (
                        <span key={i} className="badge bg-dark text-secondary border border-secondary" style={{ fontSize: '0.7rem' }}>
                          ✓ {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-top border-secondary border-opacity-25 d-flex justify-content-between align-items-center">
                  <span className="text-success small fw-medium">
                    ✓ Open for online booking
                  </span>
                  <Link to={`/movies`} className="btn btn-sm btn-cinema-primary">
                    Browse Shows
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Theatres Found"
          description={`No cinema locations currently listed for "${selectedCity}".`}
          actionText="View All Cities"
          onActionClick={() => setSelectedCity('All')}
        />
      )}
    </div>
  );
};

export default TheatresPage;

