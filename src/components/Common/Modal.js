import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { X } from 'lucide-react';
import Button from './Button';
import './Modal.css';

/**
 * Reusable Modal Component
 * Displays dialog boxes with custom content
 */
const Modal = ({
  isOpen = false,
  onClose,
  title,
  children,
  actions,
  size = 'md',
  closeOnEscape = true,
  closeOnBackdropClick = true,
  className = '',
}) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (closeOnEscape && e.key === 'Escape' && isOpen) {
        onClose?.();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, closeOnEscape, onClose]);

  const handleBackdropClick = (e) => {
    if (closeOnBackdropClick && e.target === e.currentTarget) {
      onClose?.();
    }
  };

  if (!isOpen) return null;

  const modalClass = `
    modal
    modal--${size}
    ${className}
  `.trim();

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className={modalClass}>
        {title && (
          <div className="modal-header">
            <h2 className="modal-title">{title}</h2>
            <button
              className="modal-close"
              onClick={onClose}
              aria-label="Close modal"
            >
              <X size={24} />
            </button>
          </div>
        )}

        <div className="modal-content">
          {children}
        </div>

        {actions && (
          <div className="modal-footer">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  title: PropTypes.string,
  children: PropTypes.node,
  actions: PropTypes.node,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  closeOnEscape: PropTypes.bool,
  closeOnBackdropClick: PropTypes.bool,
  className: PropTypes.string,
};

export default Modal;
