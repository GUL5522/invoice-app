import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Home.css';
import mp from '../../assets/mp.jpg';

const HomePage = () => {
  const { logout } = useAuth();
  const isLoggedIn = localStorage.getItem('user');
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for toggling menu

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Function to handle smooth scrolling to sections
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = document.querySelector('.header').offsetHeight;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    toggleMenu();
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", backgroundColor: "#f5f5f5", margin: 0, padding: 0 }}>
      <header className="header">
        <div className="header-content">
          <div className="logo-container">
            <img src={mp} alt="logo" className="image" />
          </div>

          <nav className="navbar">
            <div className="nav-container">
              <button className="hamburger" onClick={toggleMenu}>
                <span className="bar"></span>
                <span className="bar"></span>
                <span className="bar"></span>
              </button>
              <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
                <li><a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}>Home</a></li>
                <li><a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>About</a></li>
                <li><a href="#products" onClick={(e) => { e.preventDefault(); scrollToSection('products'); }}>Products</a></li>
                <li><a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}>Contact</a></li>
                {!isLoggedIn ? (
                  <li><Link to="/login" onClick={toggleMenu}>Login</Link></li>
                ) : (
                  <>
                    <li><Link to="/bill" onClick={toggleMenu}>Bill Generate</Link></li>
                    <li><Link to="/invoices" onClick={toggleMenu}>View Invoices</Link></li>
                    <li><Link to="/update-profile" onClick={toggleMenu}>Update Profile</Link></li>
                    <li><a href="#" onClick={() => { logout(); toggleMenu(); }}>Logout</a></li>
                  </>
                )}
              </ul>
            </div>
          </nav>
          <div className="text-container">
            <h1>XYZ Coal Suppliers</h1>
            <p>Quality Coal. On-Time Delivery. Trusted Partner.</p>
          </div>
        </div>
      </header>

      <section id="home" className="hero" style={{ background: "url('coal-banner.jpg') center/cover no-repeat", color: "white", padding: "80px 20px", textAlign: "center" }}>
        <h1>Reliable Coal Supply for Your Industry</h1>
        <p>We deliver high-quality coal across the region with efficiency and trust.</p>
        <button style={{ padding: "10px 20px", fontSize: "1em", margin: "10px", cursor: "pointer" }}>
          Get a Quote
        </button>
        <button style={{ padding: "10px 20px", fontSize: "1em", margin: "10px", cursor: "pointer" }}>
          Contact Us
        </button>
      </section>

      <section id="about" style={sectionStyle}>
        <h2 style={h2Style}>About Us</h2>
        <p>
          XYZ Coal Suppliers has been providing coal for over 15 years to power plants, factories, and industrial clients. Our focus is quality, timely delivery, and customer satisfaction.
        </p>
        <h2>Why Choose Us</h2>
        <ul>
          <li>Quality Assured</li>
          <li>Timely Delivery</li>
          <li>Competitive Pricing</li>
          <li>Bulk Orders & Custom Solutions</li>
        </ul>
      </section>

      <section id="products" style={sectionStyle}>
        <h2 style={h2Style}>Our Products</h2>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-around" }}>
          {["Steam Coal", "Anthracite Coal", "Bituminous Coal", "Peat Coal", "Wet Coal", "Dry Coal", "Cooking", "Lignite"].map((product, idx) => (
            <div key={idx} style={{ width: "200px", margin: "10px", padding: "10px", backgroundColor: "#eee", textAlign: "center", borderRadius: "5px" }}>
              {product}
            </div>
          ))}
        </div>
      </section>

      <section id="contact" style={sectionStyle}>
        <h2 style={h2Style}>Contact Us</h2>
        <p>📍 123 Coal Street, Industrial City, Country</p>
        <p>📞 +91-12345-67890</p>
        <p>📧 info@xyzcoal.com</p>
        <p>Additional Contact: madanprasad.92814@gmail.com | +91 8235826679</p>
      </section>

      <footer style={{ backgroundColor: "#333", color: "white", textAlign: "center", padding: "20px" }}>
        <p>© 2025 XYZ Coal Suppliers. All rights reserved.</p>
      </footer>
    </div>
  );
};

const sectionStyle = {
  padding: "40px 20px",
  maxWidth: "1000px",
  margin: "auto",
  backgroundColor: "white",
  marginBottom: "20px"
};

const h2Style = {
  textAlign: "center",
  marginBottom: "20px"
};

export default HomePage;
