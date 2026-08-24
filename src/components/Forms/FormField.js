import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { X, Copy, Settings2 } from 'lucide-react';
import Input from '../Common/Input';
import Button from '../Common/Button';
import { FIELD_TYPE_CONFIGS } from '../../constants/fieldTypes';
import './FormField.css';

/**
 * Form Field Component
 * Displays individual form field with options
 */
const FormField = ({
  field,
  onUpdate,
  onDelete,
  onShowOptions,
  editable = false,
  showValues = false,
}) => {
  const config = FIELD_TYPE_CONFIGS[field.field_type];

  if (!config) return null;

  const getFieldPreview = () => {
    switch (field.field_type) {
      case 'text':
      case 'email':
      case 'number':
      case 'url':
      case 'phone':
        return (
          <Input
            type={field.field_type}
            placeholder={field.placeholder || config.placeholder}
            disabled
          />
        );

      case 'textarea':
        return (
          <textarea
            placeholder={field.placeholder || config.placeholder}
            disabled
            rows="4"
            className="form-field-textarea-preview"
          />
        );

      case 'date':
        return <input type="date" disabled />;

      case 'checkbox':
      case 'radio':
        return (
          <div className="form-field-options-preview">
            {field.options?.slice(0, 2).map((option) => (
              <label key={option} className="form-field-option-label">
                <input
                  type={field.field_type}
                  disabled
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );

      case 'dropdown':
        return (
          <select disabled>
            <option>{field.placeholder || 'Select an option'}</option>
            {field.options?.slice(0, 2).map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        );

      default:
        return <Input type="text" placeholder="Field preview" disabled />;
    }
  };

  return (
    <div className={`form-field ${editable ? 'form-field--editable' : ''}`}>
      <div className="form-field-header">
        <div className="form-field-info">
          <h4 className="form-field-label">
            {field.label || 'Untitled Field'}
            {field.is_required && <span className="form-field-required">*</span>}
          </h4>
          <p className="form-field-type">{config.label}</p>
        </div>

        {editable && (
          <div className="form-field-actions">
            <Button
              variant="ghost"
              size="sm"
              icon={Settings2}
              onClick={() => onShowOptions?.(field)}
              disabled
            />
            <Button
              variant="danger"
              size="sm"
              icon={X}
              onClick={() => onDelete?.(field.id)}
              disabled
            />
          </div>
        )}
      </div>

      <div className="form-field-preview">
        {getFieldPreview()}
      </div>

      {field.character_limit && (
        <p className="form-field-hint">
          Max {field.character_limit} characters
        </p>
      )}

      {field.help_text && (
        <p className="form-field-help">{field.help_text}</p>
      )}
    </div>
  );
};

FormField.propTypes = {
  field: PropTypes.shape({
    id: PropTypes.number,
    label: PropTypes.string,
    field_type: PropTypes.string,
    placeholder: PropTypes.string,
    is_required: PropTypes.bool,
    character_limit: PropTypes.number,
    help_text: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  onUpdate: PropTypes.func,
  onDelete: PropTypes.func,
  onShowOptions: PropTypes.func,
  editable: PropTypes.bool,
  showValues: PropTypes.bool,
};

export default FormField;
