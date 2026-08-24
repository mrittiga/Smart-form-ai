import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Send,
  Lightbulb,
  Mic,
  RotateCcw,
  CheckCircle,
  ArrowLeft,
} from 'lucide-react';
import Layout from '../components/Common/Layout';
import Card from '../components/Common/Card';
import Button from '../components/Common/Button';
import Input from '../components/Common/Input';
import Loading from '../components/Common/Loading';
import { useForms } from '../hooks/useForms';
import { useSubmissions } from '../store/useSubmissions';
import { useVoice } from '../hooks/useVoice';
import toast from 'react-hot-toast';
import '../styles/forms.css';

/**
 * Form Filler Page
 * AI-powered form completion with suggestions and voice input
 */
const FormFillerPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getForm, currentForm, loading: formLoading } = useForms();
  const { submitForm, loading: submitting } = useSubmissions();
  const { isListening, transcript, startListening, stopListening } = useVoice();

  const [formValues, setFormValues] = useState({});
  const [suggestions, setSuggestions] = useState({});
  const [showSuggestions, setShowSuggestions] = useState({});
  const [currentFieldId, setCurrentFieldId] = useState(null);
  const [startTime] = useState(Date.now());

  // Load form
  useEffect(() => {
    if (id) {
      const loadForm = async () => {
        try {
          const form = await getForm(id);
          const initial = {};
          form.fields?.forEach(field => {
            initial[field.id] = '';
          });
          setFormValues(initial);

          // Generate AI suggestions
          generateSuggestions(form.fields);
        } catch (error) {
          toast.error('Failed to load form');
          navigate('/forms');
        }
      };
      loadForm();
    }
  }, [id, getForm, navigate]);

  // Update transcript to current field
  useEffect(() => {
    if (transcript && currentFieldId) {
      setFormValues(prev => ({
        ...prev,
        [currentFieldId]: transcript,
      }));
    }
  }, [transcript, currentFieldId]);

  const generateSuggestions = (fields) => {
    const newSuggestions = {};
    const aiResponses = {
      text: 'This is a sample response.',
      email: 'user@example.com',
      number: '42',
      date: '2024-01-15',
      textarea: 'This is a detailed response about the topic.',
      phone: '(555) 123-4567',
      url: 'https://example.com',
    };

    fields?.forEach(field => {
      newSuggestions[field.id] = aiResponses[field.field_type] || 'Sample response';
    });

    setSuggestions(newSuggestions);
  };

  const handleFieldChange = (fieldId, value) => {
    setFormValues(prev => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const handleApplySuggestion = (fieldId) => {
    const suggestion = suggestions[fieldId];
    if (suggestion) {
      setFormValues(prev => ({
        ...prev,
        [fieldId]: suggestion,
      }));
      setShowSuggestions(prev => ({
        ...prev,
        [fieldId]: false,
      }));
      toast.success('Suggestion applied!');
    }
  };

  const handleVoiceInput = (fieldId) => {
    if (isListening) {
      stopListening();
      setCurrentFieldId(null);
    } else {
      setCurrentFieldId(fieldId);
      startListening();
      toast.success('Listening... Speak now!');
    }
  };

  const handleReset = () => {
    const confirmed = window.confirm('Reset all fields?');
    if (confirmed) {
      const reset = {};
      Object.keys(formValues).forEach(key => {
        reset[key] = '';
      });
      setFormValues(reset);
      toast.success('Form reset');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (currentForm?.fields) {
      const requiredFields = currentForm.fields.filter(f => f.is_required);
      const missingFields = requiredFields.filter(f => !formValues[f.id]?.trim());

      if (missingFields.length > 0) {
        toast.error(`Please fill in required fields: ${missingFields.map(f => f.label).join(', ')}`);
        return;
      }
    }

    try {
      const timeTaken = Math.floor((Date.now() - startTime) / 1000);

      await submitForm(id, {
        submission_data: formValues,
        time_taken: timeTaken,
      });

      toast.success('Form submitted successfully!');
      navigate('/submissions');
    } catch (error) {
      toast.error('Failed to submit form');
    }
  };

  if (formLoading) {
    return <Loading fullScreen message="Loading form..." />;
  }

  if (!currentForm) {
    return <Loading fullScreen message="Form not found" />;
  }

  return (
    <Layout
      title={currentForm.title}
      description={currentForm.description}
    >
      <div className="form-filler">
        {/* Header */}
        <div className="form-filler-header">
          <Button
            variant="ghost"
            icon={ArrowLeft}
            onClick={() => navigate('/forms')}
          >
            Back
          </Button>

          <div className="form-filler-actions">
            <Button
              variant="ghost"
              icon={RotateCcw}
              onClick={handleReset}
            >
              Reset
            </Button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="form-filler-form">
          <Card className="form-filler-card">
            {currentForm.fields?.map((field, index) => (
              <div key={field.id} className="form-filler-field">
                <div className="form-filler-field-header">
                  <div>
                    <label className="form-filler-label">
                      {index + 1}. {field.label}
                      {field.is_required && <span className="form-filler-required">*</span>}
                    </label>
                    {field.help_text && (
                      <p className="form-filler-help">{field.help_text}</p>
                    )}
                  </div>

                  {suggestions[field.id] && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      icon={Lightbulb}
                      onClick={() =>
                        setShowSuggestions(prev => ({
                          ...prev,
                          [field.id]: !prev[field.id],
                        }))
                      }
                      title="AI Suggestion"
                    />
                  )}
                </div>

                {/* AI Suggestion Box */}
                {showSuggestions[field.id] && (
                  <div className="form-filler-suggestion">
                    <p className="form-filler-suggestion-text">
                      💡 {suggestions[field.id]}
                    </p>
                    <Button
                      type="button"
                      size="sm"
                      variant="primary"
                      onClick={() => handleApplySuggestion(field.id)}
                    >
                      Use Suggestion
                    </Button>
                  </div>
                )}

                {/* Input Field */}
                <div className="form-filler-input-group">
                  {field.field_type === 'textarea' ? (
                    <textarea
                      value={formValues[field.id] || ''}
                      onChange={(e) => handleFieldChange(field.id, e.target.value)}
                      placeholder={field.placeholder}
                      maxLength={field.character_limit}
                      required={field.is_required}
                      rows="4"
                      className="form-filler-textarea"
                    />
                  ) : (
                    <Input
                      type={field.field_type}
                      value={formValues[field.id] || ''}
                      onChange={(e) => handleFieldChange(field.id, e.target.value)}
                      placeholder={field.placeholder}
                      maxLength={field.character_limit}
                      required={field.is_required}
                    />
                  )}

                  {/* Voice Input Button */}
                  <Button
                    type="button"
                    variant={isListening && currentFieldId === field.id ? 'danger' : 'ghost'}
                    size="sm"
                    icon={Mic}
                    onClick={() => handleVoiceInput(field.id)}
                    title="Voice Input"
                  />
                </div>

                {field.character_limit && (
                  <p className="form-filler-counter">
                    {(formValues[field.id] || '').length} / {field.character_limit}
                  </p>
                )}
              </div>
            ))}

            {/* Submit Button */}
            <div className="form-filler-footer">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                icon={CheckCircle}
                fullWidth
                loading={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit Form'}
              </Button>
            </div>
          </Card>
        </form>

        {/* Form Progress */}
        <Card className="form-filler-progress">
          <div className="form-filler-progress-info">
            <p>Form Completion</p>
            <div className="form-filler-progress-bar">
              <div
                className="form-filler-progress-fill"
                style={{
                  width: `${(Object.values(formValues).filter(v => v?.toString().trim()).length / 
                    (currentForm.fields?.length || 1)) * 100}%`,
                }}
              />
            </div>
            <span className="form-filler-progress-text">
              {Object.values(formValues).filter(v => v?.toString().trim()).length} / {currentForm.fields?.length || 0} completed
            </span>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default FormFillerPage;
