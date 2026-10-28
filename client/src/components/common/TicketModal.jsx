import React from 'react';
import { BiCalendar, BiTime, BiMapPin, BiQrScan, BiPrinter, BiCheckCircle } from 'react-icons/bi';
import { IoTicketOutline } from 'react-icons/io5';

const TicketModal = ({ booking, onClose }) => {
  if (!booking) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div 
      className="modal fade show d-block" 
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(8px)', zIndex: 1060 }}
      tabIndex="-1"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content bg-dark border-secondary text-light rounded-4 shadow-lg overflow-hidden">
          {/* Header */}
          <div className="modal-header border-secondary px-4 py-3" style={{ background: 'linear-gradient(135deg, #1e1b4b, #111827)' }}>
            <div className="d-flex align-items-center gap-2">
              <IoTicketOutline className="text-primary fs-4" />
              <div>
                <h5 className="modal-title fw-bold mb-0">E-Ticket Voucher</h5>
                <small className="text-secondary">Ref: {booking.bookingReference}</small>
              </div>
            </div>
            <button type="button" className="btn-close btn-close-white" onClick={onClose} aria-label="Close"></button>
          </div>

          {/* Ticket Body */}
          <div className="modal-body p-4">
            <div className="ticket-wrapper p-3 mb-3">
              {/* Movie info banner */}
              <div className="d-flex gap-3 align-items-center border-bottom border-secondary pb-3 mb-3">
                <img
                  src={booking.movie?.posterUrl || 'https://via.placeholder.com/150x225?text=No+Poster'}
                  alt={booking.movie?.title}
                  className="rounded-3 shadow-sm"
                  style={{ width: '65px', height: '95px', objectFit: 'cover' }}
                />
                <div>
                  <span className="badge bg-primary text-uppercase mb-1" style={{ fontSize: '0.65rem' }}>
                    {booking.movie?.certificate || 'UA'}
                  </span>
                  <h6 className="text-white fw-bold mb-1">{booking.movie?.title}</h6>
                  <p className="text-secondary small mb-1">
                    {booking.movie?.language} • {booking.movie?.duration} min
                  </p>
                  <small className="text-success d-flex align-items-center gap-1">
                    <BiCheckCircle /> Booking Status: {booking.status}
                  </small>
                </div>
              </div>

              {/* Theatre & Showtime */}
              <div className="row g-2 text-secondary small mb-3">
                <div className="col-12 d-flex align-items-center gap-2">
                  <BiMapPin className="text-primary" />
                  <span className="text-white fw-medium">{booking.theatre?.name}</span>
                  <span className="text-muted">({booking.theatre?.city})</span>
                </div>
                <div className="col-6 d-flex align-items-center gap-2">
                  <BiCalendar className="text-primary" />
                  <span>Date: <strong className="text-white">{booking.show?.date || 'N/A'}</strong></span>
                </div>
                <div className="col-6 d-flex align-items-center gap-2">
                  <BiTime className="text-primary" />
                  <span>Time: <strong className="text-white">{booking.show?.startTime || 'N/A'}</strong></span>
                </div>
                <div className="col-12 text-muted">
                  Auditorium: <span className="text-light">{booking.show?.screenName || 'Screen 1'}</span>
                </div>
              </div>

              {/* Seats list */}
              <div className="bg-dark p-2 rounded-3 border border-secondary mb-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className="text-secondary small">Confirmed Seats ({booking.seatCount}):</span>
                  <span className="text-warning small fw-bold">₹{booking.pricing?.totalAmount} Paid</span>
                </div>
                <div className="d-flex flex-wrap gap-2">
                  {booking.seats?.map((seat, idx) => (
                    <span key={idx} className="badge bg-secondary px-2 py-1 text-white">
                      {seat.seatNumber} ({seat.category})
                    </span>
                  ))}
                </div>
              </div>

              {/* QR Code Demo Section */}
              <div className="text-center p-3 rounded-3" style={{ background: '#0b0f19', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div 
                  className="mx-auto mb-2 bg-white p-2 rounded-2 d-inline-block"
                  style={{ width: '110px', height: '110px' }}
                >
                  {/* High fidelity SVG QR pattern */}
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
                    <rect x="65" y="75" width="12" height="12" fill="#000000" />
                    <rect x="45" y="75" width="8" height="8" fill="#000000" />
                  </svg>
                </div>
                <div className="text-secondary" style={{ fontSize: '0.7rem' }}>
                  Scan at cinema turnstile or usher checkpoint
                </div>
                <code className="text-warning small">{booking.bookingReference}</code>
              </div>
            </div>
          </div>

          {/* Footer actions */}
          <div className="modal-footer border-secondary px-4 py-2 d-flex justify-content-between">
            <button className="btn btn-sm btn-cinema-outline d-flex align-items-center gap-2" onClick={handlePrint}>
              <BiPrinter /> Print Ticket
            </button>
            <button className="btn btn-sm btn-cinema-primary" onClick={onClose}>
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketModal;

