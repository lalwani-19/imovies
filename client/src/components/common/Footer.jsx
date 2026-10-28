import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BiMoviePlay, BiEnvelope, BiPhone, BiMapPin, BiCheckCircle } from 'react-icons/bi';
import { FaHeart, FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Footer = () => {
  const [emailSub, setEmailSub] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (emailSub) {
      toast.success('Thank you for subscribing to iMovies Premiere newsletter!');
      setEmailSub('');
    }
  };

  return (
    <footer className="pt-5 pb-4 mt-5 border-top" style={{ backgroundColor: '#070a12', borderColor: 'rgba(255,255,255,0.06)' }}>
      <div className="container">
        <div className="row g-4 mb-4">
          {/* Brand Info */}
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div 
                className="d-flex align-items-center justify-content-center rounded-3"
                style={{ 
                  width: '36px', 
                  height: '36px', 
                  background: 'linear-gradient(135deg, #8b5cf6, #ec4899)'
                }}
              >
                <BiMoviePlay size={22} className="text-white" />
              </div>
              <span className="brand-font fw-bold fs-4 text-white">i<span style={{ color: '#8b5cf6' }}>Movies</span></span>
            </div>
            <p className="text-secondary small pe-lg-3">
              Your premier destination for instant movie ticket reservations. Experience seamless seat selections, real-time availability, and best-in-class cinema sound and projection experiences.
            </p>
            <div className="d-flex gap-3 text-secondary fs-5 mt-3">
              <span className="hover-white cursor-pointer"><FaTwitter /></span>
              <span className="hover-white cursor-pointer"><FaGithub /></span>
              <span className="hover-white cursor-pointer"><FaLinkedin /></span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6 col-6">
            <h6 className="text-white fw-bold mb-3">Explore</h6>
            <ul className="list-unstyled text-secondary small d-flex flex-column gap-2 mb-0">
              <li><Link to="/movies" className="text-secondary text-decoration-none hover-white">Now Showing</Link></li>
              <li><Link to="/movies?status=upcoming" className="text-secondary text-decoration-none hover-white">Upcoming Releases</Link></li>
              <li><Link to="/theatres" className="text-secondary text-decoration-none hover-white">Cinemas & IMAX</Link></li>
              <li><Link to="/my-bookings" className="text-secondary text-decoration-none hover-white">My Bookings</Link></li>
              <li><Link to="/profile" className="text-secondary text-decoration-none hover-white">Account Settings</Link></li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div className="col-lg-2 col-md-6 col-6">
            <h6 className="text-white fw-bold mb-3">Support & Policies</h6>
            <ul className="list-unstyled text-secondary small d-flex flex-column gap-2 mb-0">
              <li><span className="text-secondary text-decoration-none cursor-pointer" data-bs-toggle="modal" data-bs-target="#helpFaqModal">Help & FAQs</span></li>
              <li><span className="text-secondary text-decoration-none cursor-pointer" data-bs-toggle="modal" data-bs-target="#termsModal">Terms of Service</span></li>
              <li><span className="text-secondary text-decoration-none cursor-pointer" data-bs-toggle="modal" data-bs-target="#privacyModal">Privacy Policy</span></li>
              <li><span className="text-secondary text-decoration-none cursor-pointer" data-bs-toggle="modal" data-bs-target="#cancellationModal">Cancellation Policy</span></li>
              <li><a href="#contact" className="text-secondary text-decoration-none hover-white">Contact Support</a></li>
            </ul>
          </div>

          {/* Newsletter & Contact info */}
          <div className="col-lg-4 col-md-6">
            <h6 className="text-white fw-bold mb-3">Stay Updated</h6>
            <p className="text-secondary small mb-3">
              Subscribe to get exclusive early-bird movie ticket discounts and blockbuster trailer alerts.
            </p>
            <form onSubmit={handleSubscribe} className="mb-3">
              <div className="input-group input-group-sm">
                <input
                  type="email"
                  className="form-control bg-dark border-secondary text-white"
                  placeholder="Enter your email"
                  value={emailSub}
                  onChange={(e) => setEmailSub(e.target.value)}
                  required
                />
                <button className="btn btn-cinema-primary" type="submit">
                  Join
                </button>
              </div>
            </form>
            <div className="text-secondary small d-flex flex-column gap-1">
              <div className="d-flex align-items-center gap-2">
                <BiEnvelope className="text-primary" /> support@imovies.com
              </div>
              <div className="d-flex align-items-center gap-2">
                <BiPhone className="text-primary" /> +91 (800) 466-8437 (10 AM - 10 PM)
              </div>
            </div>
          </div>
        </div>

        <hr style={{ borderColor: 'rgba(255,255,255,0.06)' }} />

        {/* Bottom copyright & attribution */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center text-secondary small pt-2">
          <div>
            &copy; {new Date().getFullYear()} <strong>iMovies</strong> — All rights reserved. Built for SkillWallet Mentor Evaluation.
          </div>
          <div className="mt-2 mt-md-0 d-flex align-items-center gap-1">
            Engineered with <FaHeart className="text-danger mx-1" size={12} /> using MERN Stack & Bootstrap 5
          </div>
        </div>
      </div>

      {/* FAQs Modal */}
      <div className="modal fade" id="helpFaqModal" tabIndex="-1" aria-labelledby="helpFaqModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content bg-dark border-secondary text-light">
            <div className="modal-header border-secondary">
              <h5 className="modal-title" id="helpFaqModalLabel">Frequently Asked Questions</h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="accordion accordion-flush" id="faqAccordion">
                <div className="accordion-item bg-transparent text-light border-secondary">
                  <h2 className="accordion-header">
                    <button className="accordion-button collapsed bg-dark text-light border-0" type="button" data-bs-toggle="collapse" data-bs-target="#faq1">
                      How does the demo payment flow work?
                    </button>
                  </h2>
                  <div id="faq1" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                    <div className="accordion-body text-secondary small">
                      This application implements a complete simulated demo checkout flow. You can choose any payment method (Credit Card, UPI, Net Banking) and click Confirm. No real financial credentials or charges are made.
                    </div>
                  </div>
                </div>
                <div className="accordion-item bg-transparent text-light border-secondary">
                  <h2 className="accordion-header">
                    <button className="accordion-button collapsed bg-dark text-light border-0" type="button" data-bs-toggle="collapse" data-bs-target="#faq2">
                      What is the ticket cancellation policy?
                    </button>
                  </h2>
                  <div id="faq2" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                    <div className="accordion-body text-secondary small">
                      You can cancel your booking anytime before the show start time from the "My Bookings" page. Upon cancellation, your seats are immediately released back to the live cinema inventory and marked refunded.
                    </div>
                  </div>
                </div>
                <div className="accordion-item bg-transparent text-light border-secondary">
                  <h2 className="accordion-header">
                    <button className="accordion-button collapsed bg-dark text-light border-0" type="button" data-bs-toggle="collapse" data-bs-target="#faq3">
                      How is double-booking prevented?
                    </button>
                  </h2>
                  <div id="faq3" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                    <div className="accordion-body text-secondary small">
                      The server uses atomic conditional operations in MongoDB with <code>$nin</code> seat collision guards. If two users select the same seat at the exact same moment, only one succeeds and the second receives an instant conflict warning.
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer border-secondary">
              <button type="button" className="btn btn-secondary btn-sm" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>

      {/* Cancellation Policy Modal */}
      <div className="modal fade" id="cancellationModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content bg-dark border-secondary text-light">
            <div className="modal-header border-secondary">
              <h5 className="modal-title">Cancellation Policy</h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body small text-secondary">
              <ul className="mb-0 ps-3 d-flex flex-column gap-2">
                <li>Bookings can be cancelled up to show start time.</li>
                <li>The ticket subtotal will be credited back via simulated refund.</li>
                <li>Convenience fees are non-refundable as per standard cinema ticketing rules.</li>
                <li>Once cancelled, the reserved seats are instantly made available for other moviegoers.</li>
              </ul>
            </div>
            <div className="modal-footer border-secondary">
              <button type="button" className="btn btn-secondary btn-sm" data-bs-dismiss="modal">Understood</button>
            </div>
          </div>
        </div>
      </div>

      {/* Terms & Privacy Modals */}
      <div className="modal fade" id="termsModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content bg-dark border-secondary text-light">
            <div className="modal-header border-secondary">
              <h5 className="modal-title">Terms of Service</h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body small text-secondary">
              <p>Welcome to iMovies. By using this service, you agree to comply with our seat reservation and cinema guidelines. All bookings are subject to theatre seating availability and admission rules.</p>
            </div>
            <div className="modal-footer border-secondary">
              <button type="button" className="btn btn-secondary btn-sm" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="privacyModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content bg-dark border-secondary text-light">
            <div className="modal-header border-secondary">
              <h5 className="modal-title">Privacy Policy</h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body small text-secondary">
              <p>Your privacy is important to us. Passwords are securely hashed with bcryptjs and sensitive tokens are encrypted using JWT standards. We never sell personal information.</p>
            </div>
            <div className="modal-footer border-secondary">
              <button type="button" className="btn btn-secondary btn-sm" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
