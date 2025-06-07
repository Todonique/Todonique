import React from "react";
import "./AuthNav.css";

const AuthNav = ({ links }) => {
  return (
    <div className="auth-card">
      <nav className="auth-nav">
        <ul className="auth-nav-list">
          {links.map((link, index) => (
            <li key={index} className="auth-nav-item">
              <a href={link.to} className="auth-nav-link">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default AuthNav;