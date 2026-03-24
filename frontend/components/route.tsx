"use client";

import React, {useEffect, useState} from 'react';

import {
  AdvancedMarker,
  useMap
} from '@vis.gl/react-google-maps';

import { Polyline } from './polyline';
import { routesApiClient } from '../config/maps';
import './route.css';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SportsScoreIcon from '@mui/icons-material/SportsScore';
import { useMapFeatures } from '../context/MapContext';
import { formatDurationFromSeconds } from '../utils/time';
import { getMetricDist, getImperialDist } from '../utils/distance';
import { MAP_CONFIG } from '../config/maps';

const defaultAppearance = {
  walkingPolylineColor: '#1E90FF',  // Dodger Blue for walking
  defaultPolylineColor: '#007BFF',  // Slightly darker blue for transit / default
  stepMarkerFillColor: '#FFFFFF',   // White markers for steps
  stepMarkerBorderColor: '#1E90FF', // Blue border to match walking polyline
};

type Appearance = typeof defaultAppearance;

// origin: {lat: number; lng: number};
// destination: {lat: number; lng: number};
// showInfoPill?: boolean;
export type RouteProps = {
  routeOptions?: any;
  appearance?: Partial<Appearance>;
  onRouteBoundsChange?: (bounds: google.maps.LatLngBoundsLiteral) => void;
};

const Route = (props: RouteProps) => {

  const {home:origin, destination, isStreetViewVisible, setRouteBounds:onRouteBoundsChange} = useMapFeatures();
  const {routeOptions} = props;
  
  const [route, setRoute] = useState<any>(null);
  const [travelTime, setTravelTime] = useState<string>('');

  const showInfoPill = !isStreetViewVisible

  // 1. ADD STATE FOR DISTANCE
  const [metricDist, setMetricDist] = useState<string>('')
  const [imperialDist, setImperialDist] = useState<string>('')

  type Units = "metric" | "imperial";
  const [units, setUnits] = useState<Units>("imperial");
  const displayedDistance = units === 'metric' ? metricDist : imperialDist;

  const map = useMap();
  
  useEffect(() => {
    if (!map){
      console.warn("StreetViewWatcher: 'map' instance not found. Ensure this component is inside <GoogleMap>.");
      return;
    }
    
    routesApiClient.computeRoutes(origin, destination, routeOptions).then(res => {
      const [route] = res.routes;
      setRoute(route);

      const {high, low} = route.viewport;
      const bounds: google.maps.LatLngBoundsLiteral = {
        north: high.latitude,
        south: low.latitude,
        east: high.longitude,
        west: low.longitude
      };

      map.fitBounds(bounds, MAP_CONFIG.routePadding);
      onRouteBoundsChange?.(bounds);
    });
  }, [origin, destination, routeOptions, map, onRouteBoundsChange]);

  // 2. UPDATED USEEFFECT TO PARSE DURATION AND DISTANCE
  useEffect(() => {
    if (!route || !route.legs || !route.legs[0]) return;
  
    // Handle Time
    if (route.legs[0].duration) {
      const durationInSeconds = parseInt(route.legs[0].duration, 10);
      setTravelTime(formatDurationFromSeconds(durationInSeconds));
    }

    // Handle Distance (Meters to Miles)
    if (route.legs[0].distanceMeters) {
      const meters = route.legs[0].distanceMeters;
      setMetricDist(getMetricDist(meters));
      setImperialDist(getImperialDist(meters));
    }
  }, [route]);

  if (!route) return null;

  const routeSteps: any[] = route.legs[0]?.steps || [];
  const appearance = {...defaultAppearance, ...props.appearance};

  const polylines = routeSteps.map((step, index) => {
    const isWalking = step.travelMode === 'WALK';
    const color = isWalking
      ? appearance.walkingPolylineColor
      : (step?.transitDetails?.transitLine?.color ?? appearance.defaultPolylineColor);

    return (
      <Polyline
        key={`${index}-polyline`}
        encodedPath={step.polyline.encodedPolyline}
        strokeWeight={isWalking ? 2 : 6}
        strokeColor={color}
      />
    );
  });

  const handleRouteInfoClick = () => {
    setUnits((prev) => (prev === "metric" ? "imperial" : "metric"));
  }

  return (
    <>
      <AdvancedMarker position={origin} />
      <AdvancedMarker position={destination} />
      
      {polylines}

      {route && showInfoPill && (
        <div className="route-info-container">
          <div className="route-info-pill" onClick={handleRouteInfoClick}>
            <AccessTimeIcon fontSize="small" />
            <span>{travelTime || '--'}</span>
            <span className="route-info-divider">|</span>
            <SportsScoreIcon fontSize="small" />
            <span>{displayedDistance || '--'}</span>
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(Route);
