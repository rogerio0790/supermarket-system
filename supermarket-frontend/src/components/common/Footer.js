import React from 'react';
import './Footer.css';

const Footer = () => {
  const googleMapsLink = "https://www.google.com/maps/search/?api=1&query=Goico+Plaza,+Musanze,+Rwanda";

  return (
    <footer className="main-footer">
      <div className="footer-top">
        <div className="footer-container">
          <div className="footer-grid">
            <div className="footer-column about">
              <h3>RUKARA SUPERMARKET</h3>
              <p>Your one-stop shop for fresh produce and household essentials in Musanze. Quality products at the best prices.</p>
              <div className="contact-details">
                <p>📍 Goico Plaza, Musanze - Muhoza, Rwanda</p>
                <p>📞 +250 788 000 000</p>
                <p>✉️ info@rukarasupermarket.rw</p>
              </div>
            </div>

            <div className="footer-column">
              <h3>Quick Links</h3>
              <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/products">All Products</a></li>
                <li><a href="/cart">Your Cart</a></li>
                <li><a href="/account">My Account</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h3>Customer Service</h3>
              <ul>
                <li><a href="/help">Help Center</a></li>
                <li><a href="/returns">Returns & Refunds</a></li>
                <li><a href="/shipping">Shipping Info</a></li>
                <li><a href="/contact">Contact Us</a></li>
              </ul>
            </div>

            <div className="footer-column map-section">
              <h3>Find Us</h3>
              <div className="map-container" onClick={() => window.open(googleMapsLink, '_blank')}>
                <iframe
                  title="Rukara Supermarket Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.754826184511!2d29.63466157577543!3d-1.503286035650146!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19dc5a9539316089%3A0x633454807469796!2sGoico%20Plaza!5e0!3m2!1sen!2srw!4v1700000000000!5m2!1sen!2srw"
                  width="100%"
                  height="180"
                  style={{ border: 0, borderRadius: '4px' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
                <div className="map-overlay">
                  <span>View Larger Map</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="footer-container">
          <p>&copy; {new Date().getFullYear()} Rukara Supermarket. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
