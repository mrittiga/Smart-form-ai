import React from 'react';
import PropTypes from 'prop-types';
import './Loading.css';

/**
 * Loading Component
 * Displays loading spinner with optional message
 */
const Loading = ({
  fullScreen = false,
  message = 'Loading...',
  size = 'md',
  overlay = false,
}) => {
  const spinnerClass = `
    loading
    loading--${size}
    ${fullScreen ? 'loading--fullscreen' : ''}
    ${overlay ? 'loading--overlay' : ''}
  `.trim();

  return (
    <div className={spinnerClass}>
      <div className="loading-spinner">
        <div className="loading-spinner-ring" />
      </div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
};

Loading.propTypes = {
  fullScreen: PropTypes.bool,
  message: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  overlay: PropTypes.bool,
};

export default Loading;
