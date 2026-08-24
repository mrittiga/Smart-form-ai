import React, { useState, useEffect } from 'react';
import { Settings, Bell, Lock, Eye, Zap, Loader } from 'lucide-react';
import Layout from '../components/Common/Layout';
import Card from '../components/Common/Card';
import Button from '../components/Common/Button';
import toast from 'react-hot-toast';
import '../styles/settings.css';

/**
 * Settings Page
 * User preferences and application settings
 */
const SettingsPage = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: false,
    theme: 'dark',
    language: 'en',
    autoSave: true,
    autoSubmit: false,
  });

  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }));
    setHasChanges(true);
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Settings saved successfully!');
      setHasChanges(false);
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    const confirmed = window.confirm('Reset all settings to defaults?');
    if (confirmed) {
      setSettings({
        emailNotifications: true,
        pushNotifications: false,
        marketingEmails: false,
        theme: 'dark',
        language: 'en',
        autoSave: true,
        autoSubmit: false,
      });
      toast.success('Settings reset to defaults');
    }
  };

  return (
    <Layout
      title="Settings"
      description="Customize your application experience"
    >
      <div className="settings-container">
        {/* Notifications */}
        <Card
          title="Notifications"
          subtitle="Manage how you receive updates"
          icon={Bell}
          className="settings-card"
        >
          <div className="settings-section">
            <div className="settings-item">
              <div className="settings-item-info">
                <h4>Email Notifications</h4>
                <p>Receive notifications via email</p>
              </div>
              <label className="settings-toggle">
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) =>
                    handleSettingChange('emailNotifications', e.target.checked)
                  }
                />
                <span></span>
              </label>
            </div>

            <div className="settings-item">
              <div className="settings-item-info">
                <h4>Push Notifications</h4>
                <p>Receive browser notifications</p>
              </div>
              <label className="settings-toggle">
                <input
                  type="checkbox"
                  checked={settings.pushNotifications}
                  onChange={(e) =>
                    handleSettingChange('pushNotifications', e.target.checked)
                  }
                />
                <span></span>
              </label>
            </div>

            <div className="settings-item">
              <div className="settings-item-info">
                <h4>Marketing Emails</h4>
                <p>Receive updates about new features</p>
              </div>
              <label className="settings-toggle">
                <input
                  type="checkbox"
                  checked={settings.marketingEmails}
                  onChange={(e) =>
                    handleSettingChange('marketingEmails', e.target.checked)
                  }
                />
                <span></span>
              </label>
            </div>
          </div>
        </Card>

        {/* Appearance */}
        <Card
          title="Appearance"
          subtitle="Customize the interface"
          icon={Eye}
          className="settings-card"
        >
          <div className="settings-section">
            <div className="settings-item">
              <label className="settings-item-info">
                <h4>Theme</h4>
                <select
                  value={settings.theme}
                  onChange={(e) => handleSettingChange('theme', e.target.value)}
                  className="settings-select"
                >
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                  <option value="auto">Auto (System)</option>
                </select>
              </label>
            </div>

            <div className="settings-item">
              <label className="settings-item-info">
                <h4>Language</h4>
                <select
                  value={settings.language}
                  onChange={(e) => handleSettingChange('language', e.target.value)}
                  className="settings-select"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="ja">Japanese</option>
                </select>
              </label>
            </div>
          </div>
        </Card>

        {/* Advanced */}
        <Card
          title="Advanced"
          subtitle="Additional options"
          icon={Zap}
          className="settings-card"
        >
          <div className="settings-section">
            <div className="settings-item">
              <div className="settings-item-info">
                <h4>Auto-Save Forms</h4>
                <p>Automatically save form progress</p>
              </div>
              <label className="settings-toggle">
                <input
                  type="checkbox"
                  checked={settings.autoSave}
                  onChange={(e) =>
                    handleSettingChange('autoSave', e.target.checked)
                  }
                />
                <span></span>
              </label>
            </div>

            <div className="settings-item">
              <div className="settings-item-info">
                <h4>Auto-Submit Forms</h4>
                <p>Automatically submit when all fields are filled</p>
              </div>
              <label className="settings-toggle">
                <input
                  type="checkbox"
                  checked={settings.autoSubmit}
                  onChange={(e) =>
                    handleSettingChange('autoSubmit', e.target.checked)
                  }
                />
                <span></span>
              </label>
            </div>
          </div>
        </Card>

        {/* Security */}
        <Card
          title="Security"
          subtitle="Manage your security settings"
          icon={Lock}
          className="settings-card"
        >
          <div className="settings-section">
            <div className="settings-item">
              <div className="settings-item-info">
                <h4>Change Password</h4>
                <p>Update your account password</p>
              </div>
              <Button variant="secondary" size="sm">
                Change
              </Button>
            </div>

            <div className="settings-item">
              <div className="settings-item-info">
                <h4>Two-Factor Authentication</h4>
                <p>Add extra layer of security</p>
              </div>
              <Button variant="secondary" size="sm">
                Enable
              </Button>
            </div>

            <div className="settings-item">
              <div className="settings-item-info">
                <h4>Active Sessions</h4>
                <p>Manage your logged-in devices</p>
              </div>
              <Button variant="secondary" size="sm">
                Manage
              </Button>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="settings-actions">
          <Button
            variant="ghost"
            onClick={handleReset}
            disabled={saving}
          >
            Reset to Defaults
          </Button>

          <div className="settings-actions-right">
            {hasChanges && (
              <span className="settings-unsaved">
                You have unsaved changes
              </span>
            )}
            <Button
              variant="primary"
              icon={saving ? Loader : Settings}
              onClick={handleSaveSettings}
              loading={saving}
              disabled={!hasChanges || saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SettingsPage;
