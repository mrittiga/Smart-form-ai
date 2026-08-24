import React from 'react';
import PropTypes from 'prop-types';
import { Mail, MapPin, Calendar } from 'lucide-react';
import Card from '../Common/Card';
import Button from '../Common/Button';
import { formatDate } from '../../utils/formatters';
import './ProfileHeader.css';

/**
 * Profile Header Component
 * Displays user profile information
 */
const ProfileHeader = ({ user, onEdit }) => {
  return (
    <Card className="profile-header" noPadding>
      <div className="profile-header-content">
        <div className="profile-avatar">
          {user?.full_name?.charAt(0) || 'U'}
        </div>

        <div className="profile-info">
          <h1 className="profile-name">{user?.full_name || 'User'}</h1>
          
          <div className="profile-meta">
            <div className="profile-meta-item">
              <Mail size={16} />
              <span>{user?.email}</span>
            </div>
            
            {user?.created_at && (
              <div className="profile-meta-item">
                <Calendar size={16} />
                <span>Joined {formatDate(user.created_at)}</span>
              </div>
            )}
          </div>

          {user?.bio && (
            <p className="profile-bio">{user.bio}</p>
          )}
        </div>

        <Button
          variant="primary"
          onClick={onEdit}
        >
          Edit Profile
        </Button>
      </div>
    </Card>
  );
};

ProfileHeader.propTypes = {
  user: PropTypes.shape({
    full_name: PropTypes.string,
    email: PropTypes.string,
    bio: PropTypes.string,
    created_at: PropTypes.string,
  }).isRequired,
  onEdit: PropTypes.func,
};

export default ProfileHeader;
