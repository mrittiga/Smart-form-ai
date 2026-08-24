import React from 'react';
import PropTypes from 'prop-types';
import { useUI } from '../../store/useUI';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import './Layout.css';

/**
 * Layout Component
 * Main layout wrapper for app pages
 */
const Layout = ({ children, title, description }) => {
  const { sidebarOpen, toggleSidebar, setSidebarOpen } = useUI();

  React.useEffect(() => {
    if (title) {
      document.title = `${title} - Smart Form AI`;
    }
  }, [title]);

  return (
    <div className="layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="layout-container">
        <Navbar onToggleSidebar={toggleSidebar} />
        
        <main className="layout-main">
          {title && (
            <div className="layout-header">
              <div>
                <h1 className="layout-title">{title}</h1>
                {description && (
                  <p className="layout-description">{description}</p>
                )}
              </div>
            </div>
          )}
          
          <div className="layout-content">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
};

export default Layout;
