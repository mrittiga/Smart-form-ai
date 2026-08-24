import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Plus, Trash2, Edit2, Eye } from 'lucide-react';
import Card from '../Common/Card';
import Button from '../Common/Button';
import { formatDate, formatDateRelative } from '../../utils/formatters';
import './FormList.css';

/**
 * Forms List Component
 * Displays list of forms with actions
 */
const FormList = ({
  forms = [],
  onCreateForm,
  onEditForm,
  onViewForm,
  onDeleteForm,
  loading = false,
  empty = false,
}) => {
  const [filter, setFilter] = useState('all');

  const filteredForms = useMemo(() => {
    if (filter === 'all') return forms;
    return forms.filter(f => f.status === filter);
  }, [forms, filter]);

  if (empty) {
    return (
      <div className="form-list-empty">
        <div className="form-list-empty-icon">📝</div>
        <h3>No forms yet</h3>
        <p>Create your first form to get started</p>
        <Button 
          variant="primary" 
          icon={Plus}
          onClick={onCreateForm}
        >
          Create Form
        </Button>
      </div>
    );
  }

  return (
    <div className="form-list">
      <div className="form-list-filters">
        <button
          className={`form-list-filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({forms.length})
        </button>
        <button
          className={`form-list-filter-btn ${filter === 'active' ? 'active' : ''}`}
          onClick={() => setFilter('active')}
        >
          Active ({forms.filter(f => f.status === 'active').length})
        </button>
        <button
          className={`form-list-filter-btn ${filter === 'draft' ? 'active' : ''}`}
          onClick={() => setFilter('draft')}
        >
          Draft ({forms.filter(f => f.status === 'draft').length})
        </button>
      </div>

      <div className="form-list-container">
        {filteredForms.map(form => (
          <Card
            key={form.id}
            title={form.title}
            subtitle={form.description}
            hover
            onClick={() => onViewForm?.(form.id)}
            actions={
              <div className="form-list-actions">
                <Button
                  variant="ghost"
                  size="sm"
                  icon={Edit2}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditForm?.(form.id);
                  }}
                  aria-label="Edit form"
                />
                <Button
                  variant="danger"
                  size="sm"
                  icon={Trash2}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteForm?.(form.id);
                  }}
                  aria-label="Delete form"
                />
              </div>
            }
          >
            <div className="form-list-meta">
              <span className={`form-list-status form-list-status--${form.status}`}>
                {form.status}
              </span>
              <span className="form-list-date">
                {formatDateRelative(form.created_at)}
              </span>
              {form.fields_count !== undefined && (
                <span className="form-list-fields">
                  {form.fields_count} fields
                </span>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

FormList.propTypes = {
  forms: PropTypes.arrayOf(PropTypes.object),
  onCreateForm: PropTypes.func,
  onEditForm: PropTypes.func,
  onViewForm: PropTypes.func,
  onDeleteForm: PropTypes.func,
  loading: PropTypes.bool,
  empty: PropTypes.bool,
};

export default FormList;
