// useStreetViewVisibility.js
import { useState, useEffect } from "react";
import { useMap } from "@vis.gl/react-google-maps";

export function useStreetViewVisibility() {
  const map = useMap();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!map) return;
    const streetView = map.getStreetView();
    
    const sync = () => setIsVisible(!!streetView.getVisible());
    const listener = streetView.addListener("visible_changed", sync);
    
    return () => listener.remove();
  }, [map]);

  return isVisible;
}