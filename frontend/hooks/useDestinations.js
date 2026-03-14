import { createDataLookup, prepRowData } from '../utils/places';
import { RoutesMatrixAPI } from '../routes-matrix-api';
import { PlacesApi } from '../place-api';
import { useState, useEffect } from 'react';

// TODO: Optimize destination fetching to avoid redundant API calls

// Currently, every time destinations changes (add or delete), the hook refetches 
// all destinations from scratch. This means:
// - On add: N+1 fetches when only 1 is needed
// - On delete: N-1 fetches when 0 are needed

// Fix: Diff destinations against current rows on each useEffect trigger.
// - Items in destinations but not in rows → fetch only those, append to rows
// - Items in rows but not in destinations → filter out, no fetch needed

// rows is already functioning as a cache keyed by desPlaceId. Staleness is 
// acceptable here since destinations only ever changes by one item at a time,
// so stale rows will always reflect the correct previous state to diff against.

// Not a priority until destination lists exceed ~50 items.

export function useDestinations(apiKey, home, destinations){
  
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const loadTableData = async () => {
      try {
        if (!home || destinations.length === 0) {
          setRows([]);
          return;
        }

        const routesApi = new RoutesMatrixAPI(apiKey);
        const placesApi = new PlacesApi(apiKey);
  
        // 1. Fire all "batch" requests at once
        const [driveRes, walkRes, transitRes, placesRes] = await Promise.all([
          routesApi.computeMatrix(home, destinations, "DRIVE"),
          routesApi.computeMatrix(home, destinations, "WALK"),
          routesApi.computeMatrix(home, destinations, "TRANSIT"),
          Promise.all(destinations.map(dest => placesApi.getPlaceDetails(dest.placeId)))
        ]);

        const driveResLookUp = createDataLookup(driveRes);
        const walkResLookUp  = createDataLookup(walkRes);
        const transitResLookUp = createDataLookup(transitRes);

        // 2. Map the results into your row format
        // Maps and Matrices return results in the same order as your input array
        const newRows = destinations.map((dest, index) => {
          const drive = driveResLookUp[index];
          const walk = walkResLookUp[index];
          const transit = transitResLookUp[index];
          const place = placesRes[index];
  
          return prepRowData(dest, drive, walk, transit, place);
        });
  
        // 3. Set the state once to avoid multiple re-renders
        setRows(newRows);
      } catch (err) {
        console.error("Initialization failed:", err);
      }
    };
  
    loadTableData();
  }, [apiKey, home, destinations]); // refresh when inputs change

  return {rows};
}