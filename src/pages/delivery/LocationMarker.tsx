import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from 'leaflet';

function LocateControl({ setSelectedLocation }: { setSelectedLocation: (loc: { lat: number; lng: number }) => void }) {
  const map = useMap();

  useEffect(() => {
    const locateButton = new L.Control({ position: "topleft" });

    locateButton.onAdd = () => {
      const btn = L.DomUtil.create("button", "leaflet-bar");
      btn.title = "Show my location";
      btn.innerHTML = "📍";
      btn.style.width = "34px";
      btn.style.height = "34px";
      btn.style.cursor = "pointer";
      btn.style.fontSize = "18px";

      btn.onclick = () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              const { latitude, longitude } = pos.coords;
              setSelectedLocation({ lat: latitude, lng: longitude });
              map.setView([latitude, longitude], 15); 
            },
            (err) => {
              console.error("Geolocation error:", err);
              alert("Could not get your location");
            }
          );
        }
      };

      return btn;
    };

    locateButton.addTo(map);

    return () => {
      map.removeControl(locateButton);
    };
  }, [map, setSelectedLocation]);

  return null;
}

export default LocateControl;
