import React from 'react';

const Footer = () => {
  return (
    <footer>
      <div className="footer-content">
        <h3>HabitTracker</h3>
        <p>Build better habits, build a better life</p>
        <div className="social-links">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
        </div>
        <p>&copy; 2024 HabitTracker. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;