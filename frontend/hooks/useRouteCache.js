import { useState, useEffect, useRef } from 'react';
import { routesApiClient } from '../config/maps';
import { useMapFeatures } from '../context/MapContext';

async function fetchMissingRoute(home, dest, routeOptions) {
  try {
    // 1. Declare with 'const' to keep it local
    const res = await routesApiClient.computeRoutes(home, dest, routeOptions);

    // 2. Check if routes actually exist before unboxing
    if (!res.routes || res.routes.length === 0) {
      console.warn("No routes found for:", dest.placeId);
      return null; 
    }

    const [route] = res.routes; // get the first route
    return route;

  } catch (error) {
    // 3. Handle network/API errors gracefully
    console.error("Maps API Error:", error);
    return null; 
  }
}

export function useRouteCache(destination, routeOptions) {
  const { home, routesCache } = useMapFeatures();
  const [route, setRoute] = useState(null);

  useEffect(() => {
    if (!home || !destination) return;  // missing this

    const routeKey = `${home.placeId}_${destination.placeId}`;
    const cachedRoute = routesCache.current[routeKey];

    if (cachedRoute){
      setRoute(cachedRoute);
      return;
    }

    fetchMissingRoute(home, destination, routeOptions).then(fetchedRoute => {
      if (!fetchedRoute) return;
      routesCache.current[routeKey] = fetchedRoute;
      setRoute(fetchedRoute);
    });

  }, [home, destination, routeOptions]) 

  return {route};
}