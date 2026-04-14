import React, { FormEvent, useEffect, useMemo, useState } from "react";
import "./Home.css";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";


const products = ["Steam Coal", "Hardcoke Coal", "Softcoke Coal", "Imported Coal"];

const reasons = ["Quality Assured", "Timely Delivery", "Competitive Pricing", "Bulk and Custom Supply"];

export default function App() {
  const [loginOpen, setLoginOpen] = useState(false);
  const { user, login, logout } = useAuth();
  const isLoggedIn = !!user;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  // Removed dead code for localStorage login check
  //   const checkLogin = () => setIsLoggedIn(Boolean(localStorage.getItem("user")));
  //   checkLogin();
  //   window.addEventListener("storage", checkLogin);
  //   return () => window.removeEventListener("storage", checkLogin);
  // }, []);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();

  const existingUser = sessionStorage.getItem("user");

  if (existingUser) {
    alert("User already logged in. Please logout first.");
    return;
  }


  const success = await login({ username, password });

  if (success) {
    setLoginOpen(false);
  } else {
    alert("Invalid username or password");
  }
};

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    setLoginOpen(false);
  };

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (!section) return;

    const headerHeight = document.querySelector(".site-header")?.clientHeight ?? 72;
    const top = section.getBoundingClientRect().top + window.scrollY - headerHeight;

    window.scrollTo({ top, behavior: "smooth" });
    setIsMenuOpen(false);
  };

  const closeMobileMenu = () => setIsMenuOpen(false);

  interface SectionTab {
    type: 'section';
    name: string;
    id: string;
  }

  interface PathTab {
    type: 'path';
    name: string;
    path: string;
  }

  interface ActionTab {
    type: 'action';
    name: string;
    onClick: () => void;
  }

  type NavTab = SectionTab | PathTab | ActionTab;

  const sectionTabs = useMemo<SectionTab[]>(() => [
    { type: 'section', name: "Home", id: "home" },
    { type: 'section', name: "About", id: "about" },
    { type: 'section', name: "Image", id: "products" },
    { type: 'section', name: "Map", id: "map" },
    { type: 'section', name: "Contact", id: "contact" }
  ], []);

  const authTabs = useMemo<NavTab[]>(() => !isLoggedIn
    ? [{ type: 'action', name: "Login", onClick: () => setLoginOpen(true) }]
    : [
      { type: 'path', name: "Indian Custom", path: "/bill" },
      { type: 'path', name: "Indian Invoices", path: "/invoices" },
      { type: 'path', name: "Nepal Custom", path: "/nepal-bill" },
      { type: 'path', name: "Nepal Invoices", path: "/nepal-invoices" },
      { type: 'path', name: "Update Profile", path: "/update-profile" },
      { type: 'action', name: "Logout", onClick: handleLogout }
    ]
    , [isLoggedIn, handleLogout, setLoginOpen]);

  const navTabs: NavTab[] = useMemo(() => isLoggedIn ? authTabs : [...sectionTabs, ...authTabs], [sectionTabs, authTabs, isLoggedIn]);

  const renderNavItem = (
    tab: NavTab,
    onAction?: () => void
  ) => {
    const className = tab.name === "Login" || tab.name === "Logout" ? "login-link" : "";

    switch (tab.type) {
      case 'section':
        return (
          <li key={tab.name}>
            <button
              className={className}
              onClick={() => {
                scrollToSection(tab.id);
                onAction?.();
              }}
            >
              {tab.name}
            </button>
          </li>
        );

      case 'path':
        return (
          <li key={tab.name}>
            <a className={className} href={tab.path} onClick={onAction}>
              {tab.name}
            </a>
          </li>
        );

      case 'action':
        return (
          <li key={tab.name}>
            <button
              className={className}
              onClick={() => {
                tab.onClick();
                onAction?.();
              }}
            >
              {tab.name}
            </button>
          </li>
        );
    }
  };

  return (
    <div className="site">
      <header className="site-header">
        <div className="container nav-wrap">
          <button className="brand" onClick={() => scrollToSection("home")} type="button">
            <img src="./m.p.png" alt="M.P. Enterprises logo" className="brand-logo" />
            <span className="brand-text">
              <span className="brand-title">M.P. Enterprises</span>
              <span className="brand-subtitle">Quality Coal. On-Time Delivery.</span>
            </span>
          </button>

          <nav className="nav-desktop" aria-label="Desktop navigation">
            <ul className="nav-links">{navTabs.map((tab) => renderNavItem(tab))}</ul>
          </nav>

          <button
            className="menu-toggle"
            type="button"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            <span />
            <span />
            <span />
          </button>

          <nav className={`nav-mobile ${isMenuOpen ? "open" : ""}`} aria-label="Mobile navigation">
            <ul className="nav-links">{navTabs.map((tab) => renderNavItem(tab, closeMobileMenu))}</ul>
          </nav>
        </div>
      </header>

      <section id="home" className="hero" style={{ backgroundImage: "url('/images/coal-yard-hero.jpg')" }}>
        <div className="hero-overlay" />
        <div className="container hero-content">
          <p className="eyebrow fade-up">35+ YEARS OF TRUSTED SUPPLY</p>
          <h1 className="fade-up delay-1">M.P. Enterprises</h1>
          <p className="hero-copy fade-up delay-2">
            Reliable coal sourcing and on-time industrial delivery for factories and plants across the region.
          </p>
          <div className="cta-row fade-up delay-3">
            {!isLoggedIn ? (
              <button className="btn btn-primary" onClick={() => setLoginOpen(true)}>
                Login
              </button>
            ) : (
              <button className="btn btn-primary" onClick={handleLogout}>
                Logout
              </button>
            )}
            <a className="btn btn-primary" href="tel:+918235826679">
              Call Now
            </a>
            <a
              className="btn btn-secondary"
              href="https://wa.me/918235826679?text=Hi,%20I%20have%20a%20question%20about%20coal%20supply."
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp
            </a>
            <a className="btn btn-secondary" href="mailto:madanprasad.92814@gmail.com">
              Email
            </a>
            <button className="btn btn-secondary" onClick={() => scrollToSection("contact")} type="button">
              Contact Us
            </button>
          </div>
        </div>
      </section>

      <section id="about" className="section">
        <div className="container">
          <h2>About Us</h2>
          <p>
            M.P. Enterprises supplies coal to plants, factories, and industrial businesses with a focus on dependable operations.
            Every shipment is managed for consistency, timing, and clear communication.
          </p>
        </div>
      </section>

      <section id="products" className="section section-muted">
        <div className="container split">
          <div>
            <h2>Our Products</h2>
            <p>Supply options designed for different industrial heat and energy requirements.</p>
          </div>
          <ul className="line-list">
            {products.map((product) => (
              <li key={product}>{product}</li>
            ))}
          </ul>
        </div>
      </section>

      <section id="map" className="section">
        <div className="container">
          <h2>Our Location Map</h2>
          <div className="map-wrap">
            <a href="https://www.google.com/maps/place/Duncan+Rd,+Raxaul,+Bihar+845305/@26.9909763,84.8482381,686m/data=!3m2!1e3!4b1!4m6!3m5!1s0x399356ac01485a21:0x5c46ff51320e1ec3!8m2!3d26.9909715!4d84.850813!16s%2Fg%2F12hm16s3g?entry=ttu" target="_blank" rel="noopener noreferrer" className="map-link">
              <div className="map-placeholder">
                <h3>📍 Raxaul</h3>
                <p>Main Road, East Champaran, Bihar<br />845305, India</p>
                <button className="view-map-btn">View on Google Maps</button>
              </div>
            </a>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>Why Choose Us</h2>
          <ul className="reason-grid">
            {reasons.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
        </div>
      </section>

      <section id="contact" className="section section-muted">
        <div className="container">
          <div>
            <h2>Contact</h2>
            <p>Main Road Raxaul, East Champaran, Bihar 845305, India</p>
            <p>Phone: +91 82358 26679</p>
            <p>Email: madanprasad.92814@gmail.com</p>
          </div>
        </div>
      </section>

      <footer className="site-footer">Copyright 2026 M.P. Enterprises. All rights reserved.</footer>

      {loginOpen && (
        <div className="modal-backdrop" onClick={() => setLoginOpen(false)}>
          <div className="login-modal" onClick={(event) => event.stopPropagation()}>
            <h3>Login</h3>
            <p>Use your account credentials to access invoices and custom bill tools.</p>

            <form onSubmit={handleLogin}>
              <label htmlFor="email">Username</label>
              <input
                type="text"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{
                  textTransform: "none",
                }}
              />

              <label htmlFor="password">Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    paddingRight: "70px",
                    border: "1px solid #ccc",
                    borderRadius: "6px",
                  }}
                  required
                />

                <span
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer"
                  }}
                >
                  {showPassword ? "🙈" : "👁️"}
                </span>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setLoginOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Log In
                </button>
              </div>

              <p style={{ marginTop: "15px", textAlign: "center" }}>
                Don't have an account?{" "}
                <span
                  style={{
                    color: "blue",
                    cursor: "pointer",
                    textDecoration: "underline"
                  }}
                  onClick={() => {
                    setLoginOpen(false);
                    navigate("/signup");
                  }}
                >
                  Sign up here
                </span>
              </p>

            </form>

            ...
          </div>
        </div>
      )}
    </div>
  );
}
