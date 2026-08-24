import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { Mail, User, MapPin, Briefcase, Save, Loader } from 'lucide-react';
import Layout from '../components/Common/Layout';
import Card from '../components/Common/Card';
import Button from '../components/Common/Button';
import Input from '../components/Common/Input';
import ProfileHeader from '../components/Profile/ProfileHeader';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import '../styles/profile.css';

/**
 * Profile Page
 * Complete user profile management
 */
const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, updateProfile, loading } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    bio: '',
    profile_data: {},
  });

  const [isSaving, setIsSaving] = useState(false);

  // Load user data
  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        bio: user.bio || '',
        profile_data: user.profile_data || {},
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!formData.full_name.trim()) {
      toast.error('Full name is required');
      return;
    }

    setIsSaving(true);
    try {
      await updateProfile(formData);
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout title="Profile">
        <div className="profile-loading">
          <Loader className="spin" size={32} />
          <p>Loading profile...</p>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout title="Profile">
        <Card>
          <p>User not found. Please log in again.</p>
          <Button onClick={() => navigate('/login')}>Go to Login</Button>
        </Card>
      </Layout>
    );
  }

  return (
    <Layout
      title="Profile"
      description="Manage your account information"
    >
      <div className="profile-container">
        {/* Profile Header */}
        <ProfileHeader
          user={user}
          onEdit={() => setIsEditing(true)}
        />

        {/* Edit Profile Form */}
        {isEditing && (
          <Card title="Edit Profile" className="profile-edit-card">
            <div className="profile-form">
              <Input
                label="Full Name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                required
                icon={User}
              />

              <Input
                label="Email"
                type="email"
                value={user.email}
                disabled
                icon={Mail}
                helper="Email cannot be changed"
              />

              <div className="profile-form-group">
                <label className="profile-label">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell us about yourself"
                  rows="4"
                  className="profile-textarea"
                  maxLength="500"
                />
                <span className="profile-counter">
                  {(formData.bio || '').length} / 500
                </span>
              </div>

              <div className="profile-form-actions">
                <Button
                  variant="ghost"
                  onClick={() => setIsEditing(false)}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  icon={Save}
                  onClick={handleSave}
                  loading={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Account Information */}
        <Card title="Account Information" className="profile-info-card">
          <div className="profile-info-grid">
            <div className="profile-info-item">
              <span className="profile-info-label">Email Address</span>
              <span className="profile-info-value">{user.email}</span>
            </div>

            <div className="profile-info-item">
              <span className="profile-info-label">Account Created</span>
              <span className="profile-info-value">
                {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
              </span>
            </div>

            <div className="profile-info-item">
              <span className="profile-info-label">Account Status</span>
              <span className="profile-info-value profile-status-active">Active</span>
            </div>

            <div className="profile-info-item">
              <span className="profile-info-label">Account Type</span>
              <span className="profile-info-value">Free Plan</span>
            </div>
          </div>
        </Card>

        {/* Preferences */}
        <Card title="Preferences" className="profile-prefs-card">
          <div className="profile-preferences">
            <div className="profile-preference-item">
              <div>
                <h4>Email Notifications</h4>
                <p>Receive updates about your forms and submissions</p>
              </div>
              <label className="profile-toggle">
                <input type="checkbox" defaultChecked />
                <span></span>
              </label>
            </div>

            <div className="profile-preference-item">
              <div>
                <h4>Marketing Emails</h4>
                <p>Receive tips and new features announcements</p>
              </div>
              <label className="profile-toggle">
                <input type="checkbox" />
                <span></span>
              </label>
            </div>

            <div className="profile-preference-item">
              <div>
                <h4>Dark Mode</h4>
                <p>Use dark theme for the interface</p>
              </div>
              <label className="profile-toggle">
                <input type="checkbox" defaultChecked />
                <span></span>
              </label>
            </div>
          </div>
        </Card>

        {/* Danger Zone */}
        <Card
          title="Danger Zone"
          subtitle="Irreversible actions"
          className="profile-danger-card"
        >
          <div className="profile-danger-actions">
            <div className="profile-danger-action">
              <div>
                <h4>Change Password</h4>
                <p>Update your account password</p>
              </div>
              <Button variant="secondary">Change Password</Button>
            </div>

            <div className="profile-danger-action">
              <div>
                <h4>Delete Account</h4>
                <p>Permanently delete your account and all data</p>
              </div>
              <Button variant="danger">Delete Account</Button>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default ProfilePage;
