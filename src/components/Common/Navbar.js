import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Menu, X, LogOut, Settings, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Button from './Button';
import './Navbar.css';

/**
 * Navbar Component
 * Top navigation bar with user menu
 */
const Navbar = ({ onToggleSidebar, user }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button
          className="navbar-toggle"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          <Menu size={24} />
        </button>
        <div className="navbar-brand">
          <h1>Smart Form AI</h1>
        </div>
      </div>

      <div className="navbar-right">
        <div className="navbar-menu">
          {user && (
            <div className="navbar-user">
              <span className="navbar-username">{user.full_name}</span>
            </div>
          )}

          <button
            className="navbar-menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {user?.full_name?.charAt(0) || 'U'}
          </button>

          {menuOpen && (
            <div className="navbar-dropdown">
              <a href="/profile" className="navbar-dropdown-item">
                <User size={18} />
                <span>Profile</span>
              </a>
              <a href="/settings" className="navbar-dropdown-item">
                <Settings size={18} />
                <span>Settings</span>
              </a>
              <button
                onClick={handleLogout}
                className="navbar-dropdown-item navbar-dropdown-item--danger"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

Navbar.propTypes = {
  onToggleSidebar: PropTypes.func,
  user: PropTypes.shape({
    full_name: PropTypes.string,
    email: PropTypes.string,
  }),
};

export default Navbar;
