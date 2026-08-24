import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Plus,
  Save,
  ArrowLeft,
  Eye,
  Trash2,
  Copy,
  Settings,
} from 'lucide-react';
import Layout from '../components/Common/Layout';
import Card from '../components/Common/Card';
import Button from '../components/Common/Button';
import Input from '../components/Common/Input';
import FormField from '../components/Forms/FormField';
import Modal from '../components/Common/Modal';
import Loading from '../components/Common/Loading';
import { useForms } from '../hooks/useForms';
import { getFieldTypesList } from '../constants/fieldTypes';
import toast from 'react-hot-toast';
import '../styles/forms.css';

/**
 * Form Builder Page
 * Advanced form creation with drag-drop support
 */
const FormBuilderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getForm, currentForm, createForm, updateForm, deleteField, loading } = useForms();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'general',
  });

  const [fields, setFields] = useState([]);
  const [showFieldModal, setShowFieldModal] = useState(false);
  const [selectedFieldType, setSelectedFieldType] = useState('text');
  const [editingField, setEditingField] = useState(null);
  const [isSaving, setSaving] = useState(false);

  // Load existing form if editing
  useEffect(() => {
    if (id) {
      const loadForm = async () => {
        try {
          const form = await getForm(id);
          setFormData({
            title: form.title,
            description: form.description,
            category: form.category,
          });
          setFields(form.fields || []);
        } catch (error) {
          toast.error('Failed to load form');
          navigate('/forms');
        }
      };
      loadForm();
    }
  }, [id, getForm, navigate]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddField = () => {
    const newField = {
      id: Math.random(),
      label: 'New Field',
      field_type: selectedFieldType,
      placeholder: '',
      is_required: false,
      character_limit: null,
      help_text: '',
      position: fields.length,
    };

    setFields(prev => [...prev, newField]);
    setShowFieldModal(false);
    toast.success('Field added');
  };

  const handleUpdateField = (fieldId, updates) => {
    setFields(prev =>
      prev.map(f => (f.id === fieldId ? { ...f, ...updates } : f))
    );
  };

  const handleDeleteField = (fieldId) => {
    setFields(prev => prev.filter(f => f.id !== fieldId));
    toast.success('Field deleted');
  };

  const handleSaveForm = async () => {
    if (!formData.title.trim()) {
      toast.error('Form title is required');
      return;
    }

    if (fields.length === 0) {
      toast.error('Add at least one field to the form');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...formData,
        fields,
      };

      if (id) {
        await updateForm(id, payload);
        toast.success('Form updated successfully!');
      } else {
        await createForm(payload);
        toast.success('Form created successfully!');
      }

      navigate('/forms');
    } catch (error) {
      toast.error('Failed to save form');
    } finally {
      setSaving(false);
    }
  };

  const handleDuplicateField = (field) => {
    const duplicated = {
      ...field,
      id: Math.random(),
      label: `${field.label} (Copy)`,
    };
    setFields(prev => [...prev, duplicated]);
    toast.success('Field duplicated');
  };

  if (loading) {
    return <Loading fullScreen message="Loading form builder..." />;
  }

  const fieldTypes = getFieldTypesList();

  return (
    <Layout
      title={id ? 'Edit Form' : 'Create Form'}
      description={id ? 'Update your form details' : 'Build your form from scratch'}
    >
      <div className="form-builder">
        {/* Header Actions */}
        <div className="form-builder-header">
          <Button
            variant="ghost"
            icon={ArrowLeft}
            onClick={() => navigate('/forms')}
          >
            Back
          </Button>

          <div className="form-builder-actions">
            <Button
              variant="secondary"
              icon={Eye}
              onClick={() => toast.info('Preview not yet implemented')}
            >
              Preview
            </Button>
            <Button
              variant="primary"
              icon={Save}
              onClick={handleSaveForm}
              loading={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Form'}
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="form-builder-content">
          {/* Form Settings */}
          <Card title="Form Settings" subtitle="Configure your form" className="form-builder-card">
            <Input
              label="Form Title"
              name="title"
              value={formData.title}
              onChange={handleFormChange}
              placeholder="Enter form title"
              required
            />

            <Input
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleFormChange}
              placeholder="Describe your form"
              type="text"
            />

            <div className="form-builder-select">
              <label className="form-builder-label">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleFormChange}
                className="form-builder-input"
              >
                <option value="general">General</option>
                <option value="education">Education</option>
                <option value="business">Business</option>
                <option value="survey">Survey</option>
                <option value="feedback">Feedback</option>
                <option value="registration">Registration</option>
              </select>
            </div>
          </Card>

          {/* Form Fields */}
          <Card title="Form Fields" subtitle="Add and configure fields" className="form-builder-card">
            <div className="form-builder-fields">
              {fields.length === 0 ? (
                <div className="form-builder-empty">
                  <p>No fields yet. Add your first field to get started.</p>
                </div>
              ) : (
                fields.map((field, index) => (
                  <div key={field.id} className="form-builder-field-item">
                    <span className="form-builder-field-number">{index + 1}</span>
                    <FormField
                      field={field}
                      editable
                      onUpdate={(updates) => handleUpdateField(field.id, updates)}
                      onDelete={() => handleDeleteField(field.id)}
                    />
                    <div className="form-builder-field-actions">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Copy}
                        onClick={() => handleDuplicateField(field)}
                        aria-label="Duplicate field"
                      />
                      <Button
                        variant="danger"
                        size="sm"
                        icon={Trash2}
                        onClick={() => handleDeleteField(field.id)}
                        aria-label="Delete field"
                      />
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Add Field Button */}
            <Button
              variant="secondary"
              icon={Plus}
              onClick={() => setShowFieldModal(true)}
              fullWidth
              className="form-builder-add-btn"
            >
              Add Field
            </Button>
          </Card>

          {/* Field Statistics */}
          <Card title="Summary" className="form-builder-card">
            <div className="form-builder-summary">
              <div className="form-builder-summary-item">
                <span>Total Fields:</span>
                <strong>{fields.length}</strong>
              </div>
              <div className="form-builder-summary-item">
                <span>Required Fields:</span>
                <strong>{fields.filter(f => f.is_required).length}</strong>
              </div>
              <div className="form-builder-summary-item">
                <span>Optional Fields:</span>
                <strong>{fields.filter(f => !f.is_required).length}</strong>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Add Field Modal */}
      <Modal
        isOpen={showFieldModal}
        onClose={() => setShowFieldModal(false)}
        title="Choose Field Type"
        size="md"
        actions={
          <>
            <Button
              variant="ghost"
              onClick={() => setShowFieldModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleAddField}
            >
              Add Field
            </Button>
          </>
        }
      >
        <div className="form-builder-field-types">
          {fieldTypes.map(type => (
            <button
              key={type.type}
              className={`form-builder-field-type ${
                selectedFieldType === type.type ? 'active' : ''
              }`}
              onClick={() => setSelectedFieldType(type.type)}
            >
              <div className="form-builder-field-type-icon">
                {type.icon === 'Type' && '📝'}
                {type.icon === 'Mail' && '📧'}
                {type.icon === 'FileText' && '📄'}
                {type.icon === 'Hash' && '🔢'}
                {type.icon === 'Calendar' && '📅'}
                {type.icon === 'Clock' && '⏰'}
                {type.icon === 'ChevronDown' && '▼'}
                {type.icon === 'Square' && '☑️'}
                {type.icon === 'Circle' && '⭕'}
                {type.icon === 'Upload' && '⬆️'}
                {type.icon === 'Link' && '🔗'}
                {type.icon === 'Phone' && '☎️'}
                {type.icon === 'Lock' && '🔒'}
              </div>
              <div className="form-builder-field-type-info">
                <h4>{type.label}</h4>
                <p>{type.description}</p>
              </div>
            </button>
          ))}
        </div>
      </Modal>
    </Layout>
  );
};

export default FormBuilderPage;
