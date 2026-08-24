import React from 'react';
import PropTypes from 'prop-types';
import Card from '../Common/Card';
import './StatsCard.css';

/**
 * Stats Card Component
 * Displays key statistics with icon and trend
 */
const StatsCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendDirection = 'up',
  unit = '',
  color = 'primary',
}) => {
  const trendClass = `stats-card-trend stats-card-trend--${trendDirection}`;

  return (
    <Card
      className={`stats-card stats-card--${color}`}
      noPadding
    >
      <div className="stats-card-content">
        <div className="stats-card-left">
          <p className="stats-card-title">{title}</p>
          <div className="stats-card-value">
            {value}
            {unit && <span className="stats-card-unit">{unit}</span>}
          </div>
          {trend && (
            <p className={trendClass}>
              {trendDirection === 'up' ? '↑' : '↓'} {trend}
            </p>
          )}
        </div>
        {Icon && (
          <div className="stats-card-icon">
            <Icon size={32} />
          </div>
        )}
      </div>
    </Card>
  );
};

StatsCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.elementType,
  trend: PropTypes.string,
  trendDirection: PropTypes.oneOf(['up', 'down']),
  unit: PropTypes.string,
  color: PropTypes.oneOf(['primary', 'success', 'warning', 'danger']),
};

export default StatsCard;
