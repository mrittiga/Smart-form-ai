import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Loader, Check } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { validateSignupForm, calculatePasswordStrength } from '../utils/validation';
import Button from '../components/Common/Button';
import Input from '../components/Common/Input';
import toast from 'react-hot-toast';
import '../styles/auth.css';

/**
 * Signup Page
 * User registration page with validation and password strength
 */
const SignupPage = () => {
  const navigate = useNavigate();
  const { signup, loading, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(null);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Update password strength
  useEffect(() => {
    if (formData.password) {
      setPasswordStrength(calculatePasswordStrength(formData.password));
    } else {
      setPasswordStrength(null);
    }
  }, [formData.password]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check terms agreement
    if (!agreeToTerms) {
      toast.error('You must agree to the terms and conditions');
      return;
    }

    // Validate form
    const validation = validateSignupForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      toast.error('Please check the form for errors');
      return;
    }

    try {
      await signup(formData.email, formData.fullName, formData.password);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (error) {
      const message = error.response?.data?.error || 'Signup failed. Please try again.';
      toast.error(message);
      setErrors({ submit: message });
    }
  };

  const getPasswordStrengthColor = (level) => {
    switch (level) {
      case 'Very Strong':
        return '#10b981';
      case 'Strong':
        return '#3b82f6';
      case 'Good':
        return '#f59e0b';
      case 'Fair':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="auth-blob auth-blob-1"></div>
        <div className="auth-blob auth-blob-2"></div>
      </div>

      <div className="auth-content">
        <div className="auth-card">
          {/* Header */}
          <div className="auth-header">
            <div className="auth-logo">
              <div className="auth-logo-icon">✨</div>
            </div>
            <h1 className="auth-title">Get Started</h1>
            <p className="auth-subtitle">
              Create your Smart Form AI account in seconds
            </p>
          </div>

          {/* Error message */}
          {errors.submit && (
            <div className="auth-error">
              <div className="auth-error-icon">⚠️</div>
              <p>{errors.submit}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-form">
            {/* Full Name Field */}
            <Input
              label="Full Name"
              type="text"
              name="fullName"
              placeholder="John Doe"
              value={formData.fullName}
              onChange={handleChange}
              error={errors.fullName}
              required
              icon={User}
              autoComplete="name"
            />

            {/* Email Field */}
            <Input
              label="Email Address"
              type="email"
              name="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
              icon={Mail}
              autoComplete="email"
            />

            {/* Password Field */}
            <div>
              <Input
                label="Password"
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                required
                icon={Lock}
                autoComplete="new-password"
              />

              {/* Password Strength Indicator */}
              {passwordStrength && (
                <div className="auth-password-strength">
                  <div className="auth-password-strength-bar">
                    <div
                      className="auth-password-strength-fill"
                      style={{
                        width: `${passwordStrength.percentage}%`,
                        backgroundColor: getPasswordStrengthColor(passwordStrength.level),
                      }}
                    />
                  </div>
                  <span
                    className="auth-password-strength-text"
                    style={{ color: getPasswordStrengthColor(passwordStrength.level) }}
                  >
                    {passwordStrength.level}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              required
              icon={Lock}
              autoComplete="new-password"
            />

            {/* Terms Agreement */}
            <label className="auth-checkbox auth-checkbox-large">
              <input
                type="checkbox"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
              />
              <span>
                I agree to the{' '}
                <a href="#terms" className="auth-link">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#privacy" className="auth-link">
                  Privacy Policy
                </a>
              </span>
            </label>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              fullWidth
              size="lg"
              disabled={loading || !agreeToTerms}
            >
              {loading ? (
                <>
                  <Loader size={20} className="spin" />
                  Creating account...
                </>
              ) : (
                <>
                  <Check size={20} />
                  Create Account
                </>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="auth-divider">
            <span>Already have an account?</span>
          </div>

          {/* Footer */}
          <div className="auth-footer">
            <p>
              Sign in to your existing account{' '}
              <Link to="/login" className="auth-link auth-link-bold">
                here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
