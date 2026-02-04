import React from 'react';
import './Footer.css';

const Footer = () => {
  const mapUrl = "https://www.google.com/maps?q=Musanze%20-%20Muhoza,%20Goico%20Plaza,%20Rwanda&output=embed";
  const googleMapsLink = "https://www.google.com/maps/search/?api=1&query=Musanze%20-%20Muhoza,%20Goico%20Plaza,%20Rwanda";

  return (
    <footer className="main-footer">
      <div className="footer-content">
        <div className="footer-section about">
          <h3>RUKARA SUPERMARKET</h3>
          <p>Your one-stop shop for all your grocery needs in Musanze. Quality products at the best prices.</p>
          <div className="contact-info">
            <p>📍 Goico Plaza, Musanze - Muhoza, Rwanda</p>
            <p>📞 +250 788 000 000</p>
            <p>✉️ info@rukarasupermarket.rw</p>
          </div>
        </div>

        <div className="footer-section links">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/products">Products</a></li>
            <li><a href="/cart">Cart</a></li>
            <li><a href="/login">Login</a></li>
          </ul>
        </div>

        <div className="footer-section map-container">
          <h3>Our Location</h3>
          <div className="map-wrapper" onClick={() => window.open(googleMapsLink, '_blank')}>
            <iframe
              title="Rukara Supermarket Location"
              src={mapUrl}
              width="100%"
              height="150"
              style={{ border: 0, borderRadius: '8px' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
            <div className="map-overlay">
              <span>Click to view on Google Maps</span>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Rukara Supermarket. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
