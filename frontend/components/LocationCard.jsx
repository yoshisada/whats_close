'use client'

import { Trash2, Navigation, Star, DollarSign, Sun, Cloud, CloudRain, CloudSnow, CloudDrizzle } from 'lucide-react';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import DriveEtaIcon from '@mui/icons-material/DriveEta';
import DirectionsTransitFilledIcon from '@mui/icons-material/DirectionsTransitFilled';

const transportIcons = {
  car: DriveEtaIcon,
  bike: DirectionsWalkIcon,
  train: DirectionsTransitFilledIcon,
};

const weatherIcons = {
  sunny: Sun,
  cloudy: Cloud,
  rainy: CloudRain,
  snowy: CloudSnow,
  drizzle: CloudDrizzle,
};

const weatherColors = {
  sunny: 'weather-sunny',
  cloudy: 'weather-cloudy',
  rainy: 'weather-rainy',
  snowy: 'weather-snowy',
  drizzle: 'weather-drizzle',
};

export default function LocationCard({
  title,
  rating,
  priceLevel,
  transportOptions,
  weather = 'sunny',
  onDelete,
  onSetRoute,
}) {
  const WeatherIcon = weatherIcons[weather];

  const handleDelete = () => {
    console.log('Delete clicked');
    onDelete?.();
    alert('Location deleted!');
  };

  const handleSetRoute = () => {
    console.log('Set route clicked');
    onSetRoute?.();
    alert('Route set!');
  };

  return (
    <div className="location-card">
      <div className="card-header">
        <h2 className="card-title">{title}</h2>
        {/* <WeatherIcon className={`weather-icon ${weatherColors[weather]}`} /> */}
      </div>

      <div className="card-meta">
        <div className="rating">
          <Star className="star-icon" />
          <span>{rating.toFixed(1)}</span>
        </div>
        <div className="price">
          {[...Array(priceLevel)].map((_, i) => (
            <DollarSign key={i} className="dollar active" />
          ))}
          {[...Array(4 - priceLevel)].map((_, i) => (
            <DollarSign key={i + priceLevel} className="dollar inactive" />
          ))}
        </div>
      </div>

      <div className="transport-section">
        <h3 className="transport-label">Transportation</h3>
        <div className="transport-options">
          {transportOptions.map((option, index) => {
            const Icon = transportIcons[option.type];
            return (
              <div key={index} className="transport-option">
                <Icon className="transport-icon" />
                <span>{option.time}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card-actions">
        <button className="btn-route" onClick={handleSetRoute}>
          <Navigation className="btn-icon" />
          Set Route
        </button>
        <button className="btn-delete" onClick={handleDelete}>
          <Trash2 className="btn-icon" />
          Delete
        </button>
      </div>
    </div>
  );
}
