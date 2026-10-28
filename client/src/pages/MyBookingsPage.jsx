import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingService } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import TicketModal from '../components/common/TicketModal';
import toast from 'react-hot-toast';
import { 
  BiCalendar, 
  BiTime, 
  BiMapPin, 
  BiXCircle, 
  BiQrScan, 
  BiCheckCircle,
  BiMovie 
} from 'react-icons/bi';
import { IoTicketOutline } from 'react-icons/io5';

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await bookingService.getMyBookings();
      if (res.data?.success) {
        setBookings(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      toast.error('Failed to load your booking history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    const confirmCancel = window.confirm(
      'Are you sure you want to cancel this booking? Your seats will be released back to the cinema.'
    );
    if (!confirmCancel) return;

    try {
      setCancellingId(bookingId);
      const res = await bookingService.cancelBooking(bookingId, 'User requested cancellation');
      if (res.data?.success) {
        toast.success('Booking cancelled successfully. Seats have been released.');
        // Refresh bookings
        await fetchBookings();
      }
    } catch (error) {
      console.error('Cancellation error:', error);
      const msg = error.response?.data?.message || 'Failed to cancel booking.';
      toast.error(msg);
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h2 text-white fw-bold mb-1 d-flex align-items-center gap-2">
            <IoTicketOutline className="text-primary" /> My Booking History
          </h1>
          <p className="text-secondary small mb-0">
            View your upcoming movie tickets, access digital gate passes, or manage cancellations.
          </p>
        </div>
        <Link to="/movies" className="btn btn-sm btn-cinema-primary d-none d-md-inline-block">
          Book Another Movie
        </Link>
      </div>

      {/* Bookings List */}
      {loading ? (
        <LoadingSpinner text="Loading your reservations..." />
      ) : bookings.length > 0 ? (
        <div className="row g-4">
          {bookings.map((booking) => {
            const isCancelled = booking.status === 'CANCELLED';
            const showTime = booking.show?.showDateTime ? new Date(booking.show.showDateTime).getTime() : 0;
            const hasShowPassed = showTime > 0 && showTime < Date.now();
            const canCancel = !isCancelled && !hasShowPassed;

            return (
              <div key={booking._id} className="col-12">
                <div className={`cinema-card p-4 ${isCancelled ? 'opacity-75 border-secondary' : 'border-subtle'}`}>
                  <div className="row g-3 align-items-center">
                    {/* Poster */}
                    <div className="col-auto">
                      <img
                        src={booking.movie?.posterUrl || 'https://via.placeholder.com/80x120?text=Movie'}
                        alt={booking.movie?.title}
                        className="rounded-3 shadow"
                        style={{ width: '80px', height: '115px', objectFit: 'cover' }}
                      />
                    </div>

                    {/* Movie & Show Info */}
                    <div className="col">
                      <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
                        <span className={`badge ${isCancelled ? 'bg-danger' : 'bg-success'} text-uppercase`} style={{ fontSize: '0.65rem' }}>
                          {booking.status}
                        </span>
                        <span className="badge bg-dark border border-secondary text-secondary" style={{ fontSize: '0.65rem' }}>
                          REF: {booking.bookingReference}
                        </span>
                        <span className="text-muted small ms-auto" style={{ fontSize: '0.72rem' }}>
                          Booked on {new Date(booking.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>

                      <h4 className="text-white fw-bold mb-1">
                        <Link to={`/movies/${booking.movie?._id}`} className="text-white text-decoration-none hover-primary">
                          {booking.movie?.title}
                        </Link>
                      </h4>

                      <div className="d-flex flex-wrap align-items-center gap-3 text-secondary small mb-2">
                        <span className="d-flex align-items-center gap-1">
                          <BiMapPin className="text-primary" /> {booking.theatre?.name} ({booking.show?.screenName || 'Screen 1'})
                        </span>
                        <span>•</span>
                        <span className="d-flex align-items-center gap-1">
                          <BiCalendar className="text-primary" /> {booking.show?.date}
                        </span>
                        <span>•</span>
                        <span className="d-flex align-items-center gap-1">
                          <BiTime className="text-primary" /> {booking.show?.startTime}
                        </span>
                      </div>

                      {/* Seats & Price */}
                      <div className="d-flex flex-wrap align-items-center gap-2">
                        <span className="text-secondary small">Seats ({booking.seatCount}):</span>
                        {booking.seats?.map((s) => (
                          <span key={s.seatNumber} className="badge bg-secondary">
                            {s.seatNumber}
                          </span>
                        ))}
                        <span className="text-warning small fw-bold ms-2">
                          Total: ₹{booking.pricing?.totalAmount}
                        </span>
                      </div>
                    </div>

                    {/* Actions Column */}
                    <div className="col-lg-auto col-12 d-flex flex-lg-column gap-2 justify-content-end">
                      <button
                        onClick={() => setSelectedTicket(booking)}
                        className="btn btn-sm btn-cinema-primary d-flex align-items-center justify-content-center gap-2"
                      >
                        <BiQrScan /> View E-Ticket
                      </button>

                      {canCancel && (
                        <button
                          onClick={() => handleCancelBooking(booking._id)}
                          disabled={cancellingId === booking._id}
                          className="btn btn-sm btn-cinema-outline text-danger border-danger border-opacity-50 hover-danger"
                        >
                          {cancellingId === booking._id ? 'Cancelling...' : 'Cancel Booking'}
                        </button>
                      )}

                      {isCancelled && (
                        <div className="text-danger small text-center" style={{ fontSize: '0.75rem' }}>
                          Cancelled & Refunded
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="No Bookings Found"
          description="You haven't booked any movie tickets yet. Explore our latest movies and pick your seats!"
          actionText="Browse Now Showing"
          actionLink="/movies"
        />
      )}

      {/* Ticket Modal popup */}
      {selectedTicket && (
        <TicketModal
          booking={selectedTicket}
          onClose={() => setSelectedTicket(null)}
        />
      )}
    </div>
  );
};

export default MyBookingsPage;
