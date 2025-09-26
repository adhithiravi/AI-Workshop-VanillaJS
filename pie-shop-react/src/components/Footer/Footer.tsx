/**
 * Footer Component - Application footer
 */

import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; 2024 Bethany's Pie Shop - React + TypeScript Version</p>
        <p>Handmade pies, served with love.</p>
      </div>
    </footer>
  );
};

export default Footer;
