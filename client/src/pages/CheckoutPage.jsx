import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { bookingService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';
import { 
  BiCheckCircle, 
  BiCreditCard, 
  BiCheckShield, 
  BiQrScan, 
  BiPrinter, 
  BiArrowBack,
  BiCalendar,
  BiTime,
  BiMapPin 
} from 'react-icons/bi';
import { IoTicketOutline } from 'react-icons/io5';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [bookingData, setBookingData] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('demo_upi');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Load checkout session
  useEffect(() => {
    const saved = sessionStorage.getItem('imovies_checkout');
    if (!saved) {
      toast.error('No pending booking found. Please choose a show and seats first.');
      navigate('/movies');
      return;
    }
    setBookingData(JSON.parse(saved));
  }, [navigate]);

  const handleConfirmPayment = async (e) => {
    e.preventDefault();
    if (!bookingData) return;

    try {
      setIsSubmitting(true);

      const payload = {
        showId: bookingData.showId,
        seats: bookingData.selectedSeats.map((s) => s.seatNumber),
        paymentMethod: paymentMethod === 'demo_upi' ? 'Simulated UPI' : 'Simulated Credit/Debit Card',
      };

      const res = await bookingService.createBooking(payload);

      if (res.data?.success) {
        setConfirmedBooking(res.data.data);
        sessionStorage.removeItem('imovies_checkout');

        // Launch celebratory confetti effect!
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#8b5cf6', '#ec4899', '#38bdf8', '#10b981'],
        });

        toast.success('Hooray! Your tickets are confirmed!');
      }
    } catch (error) {
      console.error('Booking failed:', error);
      const msg = error.response?.data?.message || 'Booking confirmation failed. One of the seats may have been claimed.';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!bookingData && !confirmedBooking) {
    return null;
  }

  // --- VIEW: CONFIRMED BOOKING SUCCESS SCREEN ---
  if (confirmedBooking) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-7">
            <div className="cinema-card p-4 p-md-5 text-center mb-4 border-success border-opacity-50">
              <div 
                className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3 bg-success bg-opacity-20 text-success"
                style={{ width: '70px', height: '70px' }}
              >
                <BiCheckCircle size={40} />
              </div>

              <h2 className="text-white fw-bold mb-2">Booking Confirmed!</h2>
              <p className="text-secondary small mb-4">
                Your movie tickets have been reserved and saved to your account.
              </p>

              {/* Booking Reference Pill */}
              <div className="bg-dark p-3 rounded-3 border border-secondary mb-4 d-inline-block px-4">
                <span className="text-secondary small d-block mb-1">Booking Reference ID:</span>
                <span className="fs-4 fw-bold text-warning letter-spacing-1">
                  {confirmedBooking.bookingReference}
                </span>
              </div>

              {/* Ticket Details Summary Card */}
              <div className="ticket-wrapper p-4 text-start mb-4">
                <div className="d-flex gap-3 align-items-center border-bottom border-secondary pb-3 mb-3">
                  <img
                    src={confirmedBooking.movie?.posterUrl}
                    alt={confirmedBooking.movie?.title}
                    className="rounded-2 shadow-sm"
                    style={{ width: '60px', height: '85px', objectFit: 'cover' }}
                  />
                  <div>
                    <h5 className="text-white fw-bold mb-1">{confirmedBooking.movie?.title}</h5>
                    <p className="text-secondary small mb-0">
                      {confirmedBooking.movie?.language} • {confirmedBooking.movie?.duration} min • {confirmedBooking.movie?.certificate}
                    </p>
                  </div>
                </div>

                <div className="row g-2 text-secondary small mb-3">
                  <div className="col-12">
                    <BiMapPin className="text-primary me-1" />
                    <strong className="text-white">{confirmedBooking.theatre?.name}</strong> ({confirmedBooking.show?.screenName || 'Screen 1'})
                  </div>
                  <div className="col-6">
                    <BiCalendar className="text-primary me-1" /> {confirmedBooking.show?.date}
                  </div>
                  <div className="col-6">
                    <BiTime className="text-primary me-1" /> {confirmedBooking.show?.startTime}
                  </div>
                  <div className="col-12 mt-2">
                    Seats: {confirmedBooking.seats?.map((s) => (
                      <span key={s.seatNumber} className="badge bg-primary me-1">
                        {s.seatNumber} ({s.category})
                      </span>
                    ))}
                  </div>
                </div>

                {/* QR Code Demo Section */}
                <div className="text-center p-3 rounded-3 mt-3" style={{ background: '#0b0f19' }}>
                  <div className="mx-auto mb-2 bg-white p-2 rounded-2 d-inline-block" style={{ width: '100px', height: '100px' }}>
                    <svg viewBox="0 0 100 100" width="100%" height="100%">
                      <rect width="100" height="100" fill="#ffffff" />
                      <rect x="10" y="10" width="25" height="25" fill="#000000" />
                      <rect x="15" y="15" width="15" height="15" fill="#ffffff" />
                      <rect x="18" y="18" width="9" height="9" fill="#000000" />
                      <rect x="65" y="10" width="25" height="25" fill="#000000" />
                      <rect x="70" y="15" width="15" height="15" fill="#ffffff" />
                      <rect x="73" y="18" width="9" height="9" fill="#000000" />
                      <rect x="10" y="65" width="25" height="25" fill="#000000" />
                      <rect x="15" y="70" width="15" height="15" fill="#ffffff" />
                      <rect x="18" y="73" width="9" height="9" fill="#000000" />
                      <rect x="45" y="15" width="8" height="8" fill="#000000" />
                      <rect x="42" y="30" width="14" height="6" fill="#000000" />
                      <rect x="42" y="45" width="16" height="16" fill="#000000" />
                      <rect x="65" y="45" width="8" height="8" fill="#000000" />
                      <rect x="75" y="55" width="10" height="10" fill="#000000" />
                    </svg>
                  </div>
                  <div className="text-muted small" style={{ fontSize: '0.7rem' }}>
                    DEMO DIGITAL TICKET PASS
                  </div>
                  <small className="text-secondary">Amount Paid: ₹{confirmedBooking.pricing?.totalAmount}</small>
                </div>
              </div>

              {/* Navigation Action Buttons */}
              <div className="d-flex flex-wrap justify-content-center gap-3">
                <Link to="/my-bookings" className="btn btn-cinema-primary">
                  View in My Bookings
                </Link>
                <button onClick={() => window.print()} className="btn btn-cinema-outline d-flex align-items-center gap-1">
                  <BiPrinter /> Print / Save Voucher
                </button>
                <Link to="/movies" className="btn btn-dark text-secondary">
                  Browse More Movies
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- VIEW: CHECKOUT FORM ---
  return (
    <div className="container py-4">
      <div className="d-flex align-items-center gap-2 mb-4">
        <button onClick={() => navigate(-1)} className="btn btn-sm btn-cinema-outline">
          <BiArrowBack />
        </button>
        <div>
          <h2 className="text-white fw-bold mb-0">Review & Confirm Booking</h2>
          <small className="text-secondary">Complete your reservation and generate digital pass</small>
        </div>
      </div>

      <div className="row g-4">
        {/* Left Column: Demo Payment & Contact */}
        <div className="col-lg-7">
          {/* User Contact Info */}
          <div className="cinema-card p-4 mb-4">
            <h5 className="text-white fw-bold mb-3 d-flex align-items-center gap-2">
              <BiCheckShield className="text-primary" /> Contact Details for Ticket Delivery
            </h5>
            <div className="row g-3">
              <div className="col-sm-6">
                <label className="text-secondary small mb-1">Full Name</label>
                <input
                  type="text"
                  className="form-control bg-dark border-secondary text-white"
                  value={user?.name || ''}
                  readOnly
                />
              </div>
              <div className="col-sm-6">
                <label className="text-secondary small mb-1">Email Address</label>
                <input
                  type="email"
                  className="form-control bg-dark border-secondary text-white"
                  value={user?.email || ''}
                  readOnly
                />
              </div>
              <div className="col-12">
                <label className="text-secondary small mb-1">Mobile Number (SMS Updates)</label>
                <input
                  type="text"
                  className="form-control bg-dark border-secondary text-white"
                  placeholder="+91 9876543210"
                  defaultValue={user?.phone || '+91 9876543210'}
                />
              </div>
            </div>
          </div>

          {/* Simulated Demo Payment Method */}
          <div className="cinema-card p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="text-white fw-bold mb-0 d-flex align-items-center gap-2">
                <BiCreditCard className="text-primary" /> Payment Method
              </h5>
              <span className="badge bg-warning text-dark fw-bold" style={{ fontSize: '0.65rem' }}>
                DEMO MODE • ZERO COST
              </span>
            </div>

            <div className="alert alert-info bg-dark border-info text-info small mb-3">
              <strong>Evaluation Note:</strong> This is a student project demonstration payment flow. No real credit card or bank account will be charged.
            </div>

            <div className="d-flex flex-column gap-2 mb-4">
              <label 
                className={`p-3 rounded-3 border d-flex align-items-center gap-3 cursor-pointer ${
                  paymentMethod === 'demo_upi' ? 'border-primary bg-primary bg-opacity-10' : 'border-secondary bg-dark'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'demo_upi'}
                  onChange={() => setPaymentMethod('demo_upi')}
                  className="form-check-input"
                />
                <div>
                  <strong className="text-white d-block">Simulated Fast UPI / QR</strong>
                  <small className="text-secondary">Instant mock authorization via UPI Apps</small>
                </div>
              </label>

              <label 
                className={`p-3 rounded-3 border d-flex align-items-center gap-3 cursor-pointer ${
                  paymentMethod === 'demo_card' ? 'border-primary bg-primary bg-opacity-10' : 'border-secondary bg-dark'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'demo_card'}
                  onChange={() => setPaymentMethod('demo_card')}
                  className="form-check-input"
                />
                <div>
                  <strong className="text-white d-block">Simulated Credit / Debit Card</strong>
                  <small className="text-secondary">Mock gateway with test tokens</small>
                </div>
              </label>
            </div>

            <button
              onClick={handleConfirmPayment}
              disabled={isSubmitting}
              className="btn btn-cinema-primary w-100 py-3 fw-bold fs-6 d-flex align-items-center justify-content-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  Reserving Seats & Generating Pass...
                </>
              ) : (
                <>
                  <BiCheckCircle size={20} /> Pay ₹{bookingData.pricing?.totalAmount} & Confirm Booking
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="col-lg-5">
          <div className="cinema-card p-4">
            <h5 className="text-white fw-bold mb-3">Order Details</h5>

            {/* Movie Header */}
            <div className="d-flex gap-3 align-items-center pb-3 border-bottom border-secondary border-opacity-25 mb-3">
              <img
                src={bookingData.movie?.posterUrl}
                alt={bookingData.movie?.title}
                className="rounded-2"
                style={{ width: '60px', height: '85px', objectFit: 'cover' }}
              />
              <div>
                <h6 className="text-white fw-bold mb-1">{bookingData.movie?.title}</h6>
                <div className="text-secondary small mb-1">{bookingData.theatre?.name}</div>
                <div className="text-secondary small">{bookingData.date} • {bookingData.startTime}</div>
              </div>
            </div>

            {/* Seats detail */}
            <div className="mb-3">
              <div className="d-flex justify-content-between text-secondary small mb-2">
                <span>Selected Seats:</span>
                <span className="text-white fw-bold">{bookingData.selectedSeats?.length} Tickets</span>
              </div>
              <div className="d-flex flex-wrap gap-1">
                {bookingData.selectedSeats?.map((s) => (
                  <span key={s.seatNumber} className="badge bg-secondary">
                    {s.seatNumber} (₹{s.price})
                  </span>
                ))}
              </div>
            </div>

            {/* Price breakdown */}
            <div className="bg-dark p-3 rounded-3 border border-secondary small mb-3">
              <div className="d-flex justify-content-between text-secondary mb-1">
                <span>Base Subtotal:</span>
                <span className="text-white">₹{bookingData.pricing?.subtotal}</span>
              </div>
              <div className="d-flex justify-content-between text-secondary mb-1">
                <span>Convenience Fee:</span>
                <span className="text-white">₹{bookingData.pricing?.convenienceFee}</span>
              </div>
              <div className="d-flex justify-content-between text-secondary mb-2">
                <span>GST (18% on convenience fee):</span>
                <span className="text-white">₹{bookingData.pricing?.taxes}</span>
              </div>
              <div className="d-flex justify-content-between text-white fw-bold border-top border-secondary pt-2 fs-6">
                <span>Grand Total:</span>
                <span className="text-warning">₹{bookingData.pricing?.totalAmount}</span>
              </div>
            </div>

            <div className="text-muted small" style={{ fontSize: '0.72rem' }}>
              By confirming this booking, you acknowledge our cinema cancellation policy. You can cancel your booking for a ticket subtotal refund up until the show start time.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
