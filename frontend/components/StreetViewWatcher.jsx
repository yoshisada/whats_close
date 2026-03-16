import { useEffect } from "react";
import { useMap } from "@vis.gl/react-google-maps";
import { useMapFeatures } from "../context/MapContext";

/*
VERY IMPORTANT THIS CAN ONLY BE USED IN A MAP INSTANCE
BECASUE OF USE MAP
*/
export default function StreetViewWatcher() {
  const map = useMap();
  const { setIsStreetViewVisible } = useMapFeatures();

  useEffect(() => {
    if (!map){
      console.warn("StreetViewWatcher: 'map' instance not found. Ensure this component is inside <GoogleMap>.");
      return;
    }

    const streetView = map.getStreetView();
    
    // Function to sync the actual Street View state with our Context
    const syncVisibility = () => {
      const isVisible = streetView.getVisible();
      setIsStreetViewVisible(isVisible);
    };

    // 1. Initial check (in case it starts visible)
    syncVisibility();

    // 2. Listen for the Google Maps internal event
    const listener = streetView.addListener("visible_changed", syncVisibility);

    // 3. Cleanup: Stop listening if the component unmounts
    return () => {
      if (listener) listener.remove();
    };
  }, [map, setIsStreetViewVisible]);

  // This component doesn't render anything; it's purely a "logic worker"
  return null;
}