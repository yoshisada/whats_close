import MapWithBox from "../components/MapWithBox";
import { MapFeatureProvider } from "../context/MapContext";

export default function Home() {
  return (
    <MapFeatureProvider>
      <MapWithBox />
    </MapFeatureProvider>
  );
}
