import { useEffect } from "react";
import { useMap } from "@vis.gl/react-google-maps";
import { useMapFeatures } from "../context/MapContext";
import { MAP_CONFIG } from '../config/maps';


/*
VERY IMPORTANT THIS CAN ONLY BE USED IN A MAP INSTANCE
BECASUE OF USE MAP
*/
export default function MapCenterControl(){  
  const map = useMap();
  const { mapCenter } = useMapFeatures();


  useEffect(() => {
    if (!map){
      console.warn("MapCenterControl: 'map' instance not found. Ensure this component is inside <GoogleMap>.");
      return;
    }

    if(map && mapCenter){
      map.panTo(mapCenter);
      map.setZoom(MAP_CONFIG.defaultZoom);
    }
  }, [map, mapCenter]);

  return null;
}
