import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { showService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import toast from 'react-hot-toast';
import { 
  BiMovie, 
  BiMapPin, 
  BiCalendar, 
  BiTime, 
  BiArrowBack, 
  BiInfoCircle, 
  BiX 
} from 'react-icons/bi';
import { IoTicketOutline } from 'react-icons/io5';

const SeatBookingPage = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [showData, setShowData] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]); // array of seat objects: { id, seatNumber, category, price }
  const [loading, setLoading] = useState(true);

  const MAX_SEATS = 10;

  // Fetch show seats & layout from backend API
  useEffect(() => {
    const fetchSeats = async () => {
      try {
        setLoading(true);
        const res = await showService.getShowSeats(showId);
        if (res.data?.success) {
          setShowData(res.data.data);
        }
      } catch (error) {
        console.error('Error fetching seat layout:', error);
        toast.error('Failed to load seat layout for this show.');
      } finally {
        setLoading(false);
      }
    };

    fetchSeats();
  }, [showId]);

  // Toggle seat selection
  const handleSeatClick = (seat) => {
    if (seat.isBooked) {
      toast.error(`Seat ${seat.seatNumber} is already booked.`);
      return;
    }

    const isAlreadySelected = selectedSeats.some((s) => s.seatNumber === seat.seatNumber);

    if (isAlreadySelected) {
      // Deselect
      setSelectedSeats(selectedSeats.filter((s) => s.seatNumber !== seat.seatNumber));
    } else {
      // Check max limit
      if (selectedSeats.length >= MAX_SEATS) {
        toast.error(`You can select a maximum of ${MAX_SEATS} seats per booking.`);
        return;
      }
      // Add seat
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  // Pricing calculations
  const subtotal = selectedSeats.reduce((sum, s) => sum + s.price, 0);
  const convenienceFee = selectedSeats.length > 0 ? selectedSeats.length * 20 : 0;
  const taxes = Math.round(convenienceFee * 0.18);
  const totalAmount = subtotal + convenienceFee + taxes;

  const handleProceedToCheckout = () => {
    if (selectedSeats.length === 0) {
      toast.error('Please select at least one seat to proceed.');
      return;
    }

    // Save selection in session storage or navigate with state
    const checkoutPayload = {
      showId: showData.showId,
      movie: showData.movie,
      theatre: showData.theatre,
      screenName: showData.screenName,
      date: showData.date,
      startTime: showData.startTime,
      selectedSeats,
      pricing: {
        subtotal,
        convenienceFee,
        taxes,
        totalAmount,
      },
    };

    sessionStorage.setItem('imovies_checkout', JSON.stringify(checkoutPayload));

    if (!isAuthenticated) {
      toast('Please log in or register to complete your reservation.', { icon: '🔐' });
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
    } else {
      navigate('/checkout');
    }
  };

  if (loading) {
    return <LoadingSpinner text="Retrieving real-time seating availability..." />;
  }

  if (!showData) {
    return (
      <div className="container py-5">
        <EmptyState
          title="Show Not Found"
          description="We couldn't load the seat configuration for this showtime."
          actionText="Back to Movies"
          actionLink="/movies"
        />
      </div>
    );
  }

  return (
    <div className="seat-booking-page pb-5">
      {/* Show Info Sticky Top Bar */}
      <div className="bg-dark border-bottom border-secondary py-3 mb-4">
        <div className="container">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div className="d-flex align-items-center gap-3">
              <button onClick={() => navigate(-1)} className="btn btn-sm btn-cinema-outline">
                <BiArrowBack />
              </button>
              <div>
                <h5 className="text-white fw-bold mb-0">{showData.movie?.title}</h5>
                <div className="d-flex flex-wrap align-items-center gap-2 text-secondary small" style={{ fontSize: '0.8rem' }}>
                  <span><BiMapPin className="text-primary" /> {showData.theatre?.name}</span>
                  <span>•</span>
                  <span>{showData.screenName}</span>
                  <span>•</span>
                  <span><BiCalendar className="text-primary" /> {showData.date}</span>
                  <span>•</span>
                  <span><BiTime className="text-primary" /> {showData.startTime}</span>
                </div>
              </div>
            </div>

            <div className="d-flex align-items-center gap-3">
              <span className="text-secondary small">
                Available: <strong className="text-success">{showData.availableSeats}</strong> / {showData.totalSeats} seats
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row g-4">
          {/* Main Seating Chart Area */}
          <div className="col-lg-8">
            <div className="cinema-card p-4 text-center">
              {/* Cinema Screen Indicator */}
              <div className="cinema-screen-wrap mb-5">
                <div className="cinema-screen"></div>
                <div className="cinema-screen-text">
                  SCREEN THIS WAY
                </div>
              </div>

              {/* Seating Grid with Horizontal Overflow for Mobile */}
              <div className="table-responsive py-2 mb-4" style={{ WebkitOverflowScrolling: 'touch' }}>
                <div className="d-inline-block text-center" style={{ minWidth: '460px' }}>
                  {showData.layout?.map((row) => (
                    <div key={row.rowLabel} className="d-flex align-items-center justify-content-center mb-2">
                      {/* Row Label (Left) */}
                      <span className="text-secondary fw-bold small me-3" style={{ width: '20px' }}>
                        {row.rowLabel}
                      </span>

                      {/* Row Seats */}
                      <div className="d-flex gap-1">
                        {row.seats?.map((seat, seatIdx) => {
                          const isSelected = selectedSeats.some((s) => s.seatNumber === seat.seatNumber);
                          let seatClass = 'seat-btn';

                          if (seat.isBooked) {
                            seatClass += ' seat-booked';
                          } else if (isSelected) {
                            seatClass += ' seat-selected';
                          } else if (seat.category === 'VIP') {
                            seatClass += ' seat-vip';
                          } else if (seat.category === 'Premium') {
                            seatClass += ' seat-premium';
                          }

                          return (
                            <React.Fragment key={seat.id}>
                              {/* Aisle gap between seat 5 and 6 */}
                              {seatIdx === 5 && <span className="mx-2"></span>}
                              <button
                                type="button"
                                className={seatClass}
                                onClick={() => handleSeatClick(seat)}
                                disabled={seat.isBooked}
                                title={`${seat.seatNumber} (${seat.category}) - ₹${seat.price}`}
                              >
                                {seat.number}
                              </button>
                            </React.Fragment>
                          );
                        })}
                      </div>

                      {/* Row Label (Right) */}
                      <span className="text-secondary fw-bold small ms-3" style={{ width: '20px' }}>
                        {row.rowLabel}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Seating Legend */}
              <div className="d-flex flex-wrap justify-content-center gap-4 pt-3 border-top border-secondary border-opacity-25 small text-secondary">
                <div className="d-flex align-items-center gap-2">
                  <span className="seat-btn m-0" style={{ cursor: 'default' }}>1</span>
                  <span>Available (₹180)</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className="seat-btn seat-premium m-0" style={{ cursor: 'default' }}>1</span>
                  <span>Premium (₹250)</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className="seat-btn seat-vip m-0" style={{ cursor: 'default' }}>1</span>
                  <span>VIP (₹350)</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className="seat-btn seat-selected m-0" style={{ cursor: 'default' }}>✓</span>
                  <span className="text-white fw-bold">Selected</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className="seat-btn seat-booked m-0" style={{ cursor: 'default' }}>✕</span>
                  <span>Booked</span>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Summary Sidebar */}
          <div className="col-lg-4">
            <div className="cinema-card p-4 position-sticky" style={{ top: '80px' }}>
              <h5 className="text-white fw-bold d-flex align-items-center gap-2 mb-3">
                <IoTicketOutline className="text-primary" /> Booking Summary
              </h5>

              {/* Movie snippet */}
              <div className="d-flex gap-3 align-items-center mb-3 pb-3 border-bottom border-secondary border-opacity-25">
                <img
                  src={showData.movie?.posterUrl}
                  alt={showData.movie?.title}
                  className="rounded-2"
                  style={{ width: '50px', height: '75px', objectFit: 'cover' }}
                />
                <div>
                  <h6 className="text-white fw-bold mb-1">{showData.movie?.title}</h6>
                  <small className="text-secondary d-block">{showData.theatre?.name}</small>
                  <small className="text-secondary d-block">{showData.date} • {showData.startTime}</small>
                </div>
              </div>

              {/* Selected Seats Chips */}
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-secondary small fw-medium">
                    Selected Seats ({selectedSeats.length}/{MAX_SEATS}):
                  </span>
                  {selectedSeats.length > 0 && (
                    <button
                      onClick={() => setSelectedSeats([])}
                      className="btn btn-link btn-sm text-danger text-decoration-none p-0 small"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {selectedSeats.length > 0 ? (
                  <div className="d-flex flex-wrap gap-2">
                    {selectedSeats.map((seat) => (
                      <span
                        key={seat.id}
                        className="badge bg-dark border border-secondary text-light px-2 py-1 d-flex align-items-center gap-1"
                      >
                        <span className="fw-bold text-white">{seat.seatNumber}</span>
                        <span className="text-muted" style={{ fontSize: '0.65rem' }}>({seat.category})</span>
                        <BiX 
                          className="cursor-pointer text-danger ms-1" 
                          onClick={() => handleSeatClick(seat)} 
                        />
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="alert alert-dark border-secondary small text-secondary mb-0 py-2">
                    Click on any available seat above to select.
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              {selectedSeats.length > 0 && (
                <div className="bg-dark p-3 rounded-3 border border-secondary mb-4 small">
                  <div className="d-flex justify-content-between text-secondary mb-1">
                    <span>Ticket Subtotal:</span>
                    <span className="text-white">₹{subtotal}</span>
                  </div>
                  <div className="d-flex justify-content-between text-secondary mb-1">
                    <span>Convenience Fee:</span>
                    <span className="text-white">₹{convenienceFee}</span>
                  </div>
                  <div className="d-flex justify-content-between text-secondary mb-2">
                    <span>GST (18% on fee):</span>
                    <span className="text-white">₹{taxes}</span>
                  </div>
                  <div className="d-flex justify-content-between text-white fw-bold border-top border-secondary pt-2 fs-6">
                    <span>Total Amount:</span>
                    <span className="text-warning">₹{totalAmount}</span>
                  </div>
                </div>
              )}

              {/* Continue to Checkout Button */}
              <button
                className="btn btn-cinema-primary w-100 py-2 d-flex align-items-center justify-content-center gap-2"
                onClick={handleProceedToCheckout}
                disabled={selectedSeats.length === 0}
              >
                Proceed to Checkout ({selectedSeats.length} {selectedSeats.length === 1 ? 'seat' : 'seats'}) &rarr;
              </button>

              <div className="text-center text-muted small mt-2" style={{ fontSize: '0.72rem' }}>
                <BiInfoCircle /> Cancellation available up to show start time
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatBookingPage;
