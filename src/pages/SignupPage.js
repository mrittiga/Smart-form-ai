import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Loader, Check } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { validateSignupForm, calculatePasswordStrength } from '../utils/validation';
import Button from '../components/Common/Button';
import Input from '../components/Common/Input';
import toast from 'react-hot-toast';
import '../styles/auth.css';

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

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (formData.password) {
      setPasswordStrength(calculatePasswordStrength(formData.password));
    } else {
      setPasswordStrength(null);
    }
  }, [formData.password]);

  const handleChange = (e, explicitName) => {
    let name = explicitName;
    let value = e;

    if (e && e.target) {
      name = e.target.name || explicitName;
      value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    }

    if (!name) return;

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!agreeToTerms) {
      toast.error('You must agree to the terms and conditions');
      return;
    }

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
          <div className="auth-header">
            <div className="auth-logo">
              <div className="auth-logo-icon">✨</div>
            </div>
            <h1 className="auth-title">Get Started</h1>
            <p className="auth-subtitle">
              Create your Smart Form AI account in seconds
            </p>
          </div>

          {errors.submit && (
            <div className="auth-error">
              <div className="auth-error-icon">⚠️</div>
              <p>{errors.submit}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <Input
              label="Full Name"
              type="text"
              name="fullName"
              placeholder="John Doe"
              value={formData.fullName}
              onChange={(e) => handleChange(e, 'fullName')}
              error={errors.fullName}
              required
              icon={User}
              autoComplete="name"
            />

            <Input
              label="Email Address"
              type="email"
              name="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) => handleChange(e, 'email')}
              error={errors.email}
              required
              icon={Mail}
              autoComplete="email"
            />

            <div>
              <Input
                label="Password"
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => handleChange(e, 'password')}
                error={errors.password}
                required
                icon={Lock}
                autoComplete="new-password"
              />

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

            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) => handleChange(e, 'confirmPassword')}
              error={errors.confirmPassword}
              required
              icon={Lock}
              autoComplete="new-password"
            />

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

          <div className="auth-divider">
            <span>Already have an account?</span>
          </div>

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
