import React from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  CheckSquare,
  BarChart3,
  User,
  Settings,
  LogOut,
  X,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import './Sidebar.css';

/**
 * Sidebar Navigation Component
 * Left sidebar with navigation menu
 */
const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { logout, user } = useAuth();

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      path: '/',
    },
    {
      icon: FileText,
      label: 'Forms',
      path: '/forms',
    },
    {
      icon: CheckSquare,
      label: 'Submissions',
      path: '/submissions',
    },
    {
      icon: BarChart3,
      label: 'Analytics',
      path: '/analytics',
    },
    {
      icon: User,
      label: 'Profile',
      path: '/profile',
    },
    {
      icon: Settings,
      label: 'Settings',
      path: '/settings',
    },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      {isOpen && (
        <div className="sidebar-backdrop" onClick={onClose} />
      )}
      
      <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-title">Smart Form AI</h2>
          <button
            className="sidebar-close"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-menu">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`sidebar-menu-item ${active ? 'sidebar-menu-item--active' : ''}`}
                  onClick={onClose}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                  {active && <div className="sidebar-menu-item-indicator" />}
                </Link>
              );
            })}
          </div>

          <div className="sidebar-footer">
            <div className="sidebar-user">
              <div className="sidebar-user-avatar">
                {user?.full_name?.charAt(0) || 'U'}
              </div>
              <div className="sidebar-user-info">
                <p className="sidebar-user-name">{user?.full_name || 'User'}</p>
                <p className="sidebar-user-email">{user?.email || 'email@example.com'}</p>
              </div>
            </div>

            <button
              className="sidebar-logout"
              onClick={handleLogout}
              aria-label="Logout"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
};

Sidebar.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};

export default Sidebar;
