import React from 'react';
import './Footer.css';

const Footer = () => {
  const mapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.4623456789!2d29.6333!3d-1.5000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19dc50f8c8b8b8b9%3A0x1234567890abcdef!2sGoico%20Plaza%2C%20Musanze!5e0!3m2!1sen!2srw!4v1234567890123";
  // Note: The above is a placeholder coordinates. I'll use a better search or standard embed link.
  // Actually, for a real interactive map that redirects, I'll use a link around the iframe or a dedicated button.
  
  const googleMapsLink = "https://www.google.com/maps/search/?api=1&query=Goico+Plaza,+Musanze,+Rwanda";

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
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.754826184511!2d29.63466157577543!3d-1.503286035650146!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19dc5a9539316089%3A0x633454807469796!2sGoico%20Plaza!5e0!3m2!1sen!2srw!4v1700000000000!5m2!1sen!2srw"
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
