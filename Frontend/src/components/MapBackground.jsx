/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";

const MapBackground = ({ panelOpen }) => {
  const [map, setMap] = useState(null); // Store map instance
  const [currentLocation, setCurrentLocation] = useState([28.6139, 77.209]); // Default to New Delhi
  const [zoomLevel, setZoomLevel] = useState(6); // Default zoom level to show a large region

  useEffect(() => {
    const loadMapplsScript = () => {
      if (!document.getElementById("mappls-sdk")) {
        const script = document.createElement("script");
        script.id = "mappls-sdk";
        const apiKey = import.meta.env.VITE_MAP_API_KEY;
        script.src = `https://apis.mappls.com/advancedmaps/api/${apiKey}/map_sdk?layer=vector&v=3.0`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
          console.log("Mappls SDK loaded successfully");
          initializeMap();
        };
        script.onerror = () => {
          console.error("Failed to load Mappls SDK");
        };
        document.body.appendChild(script);
      } else {
        initializeMap();
      }
    };

    const initializeMap = () => {
      if (window.mappls && document.getElementById("map-container")) {
        const mapInstance = new window.mappls.Map("map-container", {
          center: currentLocation, // Default center
          zoom: zoomLevel, // Default zoom level
          zoomControl: false,
          scaleControl: false,
          location: false,
          logo: false,
          attributionControl: false,
          fullscreenControl: false,
        });

        setMap(mapInstance); // Save map instance

        // Fetch user's current location
        fetchCurrentLocation(mapInstance);
      } else {
        console.error("Mappls SDK not loaded or map container missing");
      }
    };

    const fetchCurrentLocation = (mapInstance) => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const userLocation = [latitude, longitude];
            setCurrentLocation(userLocation); // Update state
            setZoomLevel(12); // Adjust zoom level for city view

            // Update map's center and zoom
            mapInstance.setView(userLocation, 12);

            // Add a marker at the user's location
            new window.mappls.Marker({
              map: mapInstance,
              position: userLocation,
            }).addTo(mapInstance);

            console.log("User's location set on the map:", userLocation);
          },
          (error) => {
            console.error("Failed to fetch location:", error.message);
            alert(
              "Unable to access location. Please enable location services or try again."
            );
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 } // High accuracy options
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
        alert("Geolocation is not supported by this browser.");
      }
    };

    loadMapplsScript();
  }, []); // Runs once when the component mounts

  return (
    <div
      className={`h-full w-full transition-opacity duration-300 ${
        panelOpen ? "opacity-0" : "opacity-100"
      }`}
    >
      <div
        id="map-container"
        className="w-full h-full object-cover"
        style={{ zIndex: 0 }}
      ></div>
    </div>
  );
};

export default MapBackground;