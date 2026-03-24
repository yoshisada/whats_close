// src/config/maps.js
import { RoutesApi } from '../routes-api';
import { RoutesMatrixAPI } from '../routes-matrix-api';
import { PlacesApi } from '../place-api';


export const MAP_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY,
  mapId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID,
  mapStyle: { width: "100%", height: "100%" },
  defaultCenter: { lat: 37.7749, lng: -122.4194 },
  defaultZoom: 14,
  libraries: ["places"],
  // when calculating how to show route
  routePadding: {
    top: 140,    // Height of NavPill + buffer
    bottom: 40,  // Buffer for the bottom of the map
    left: 40,
    right: 40
  }
};

// clients for api call fetches
export const routesApiClient = new RoutesApi(MAP_CONFIG.apiKey);
export const routesMatrixApi = new RoutesMatrixAPI(MAP_CONFIG.apiKey);
export const placesApi = new PlacesApi(MAP_CONFIG.apiKey);