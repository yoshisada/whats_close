"use client";

// look into reducesrs https://react.dev/learn/scaling-up-with-reducer-and-context
import React, { createContext, useContext, useState, useCallback } from 'react';
import { MAP_CONFIG } from '../config/maps';

const MapContext = createContext(null);

export function MapFeatureProvider({ children }) {
  // --- Data State ---
  const [home, setHome] = useState(null);
  const [destination, setDestination] = useState(null);
  const [destHistory, setDestHistory] = useState([]);
  const [routeBounds, setRouteBounds] = useState(null);

  // --- UI/Map Control State ---
  const [mapCenter, setMapCenter] = useState(MAP_CONFIG.defaultCenter);
  const [isStreetViewVisible, setIsStreetViewVisible] = useState(false);
  const [mapType, setMapType] = useState(true); // true = roadmap, false = hybrid

  // --- Logic Handlers (Memoized) ---

  const handleHomeSelect = useCallback((location) => {
    setHome(location);
    setMapCenter({ lat: location.lat, lng: location.lng });
  }, []);

  const handleHomeClear = useCallback(() => {
    setHome(null);
    setDestination(null);
    setRouteBounds(null);
  }, []);

  const addDestination = useCallback((location) => {
    setDestination(location);
    // Functional update avoids needing destHistory in the dependency array
    setDestHistory((prev) => {
      const isDuplicate = prev.some((d) => d.placeId === location.placeId);
      return isDuplicate ? prev : [...prev, location];
    });
  }, []);

  const clearRoute = useCallback(() => {
    setDestination(null);
    setRouteBounds(null);
    if (home) {
      // The "Look Back" snap
      setMapCenter({ lat: home.lat, lng: home.lng });
    }
  }, [home]);

  const deleteFromHistory = useCallback((placeId) => {
    setDestHistory((prev) => prev.filter(dest => dest.placeId !== placeId));
  }, []);

  const toggleMapType = useCallback(() => {
    setMapType(prev => !prev);
  }, []);

  const value = {
    home, handleHomeSelect, handleHomeClear,
    destination, setDestination, addDestination, clearRoute,
    destHistory, deleteFromHistory,
    routeBounds, setRouteBounds,
    mapCenter, setMapCenter,
    isStreetViewVisible, setIsStreetViewVisible,
    mapType, toggleMapType
  };

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
}

export const useMapFeatures = () => useContext(MapContext);