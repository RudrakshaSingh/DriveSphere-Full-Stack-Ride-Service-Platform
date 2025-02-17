/* eslint-disable react/prop-types */
//MapBackground.jsx
import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

// Fix default icon issues
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
	iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
	iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
	shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const MapComponent = ({  pickup, drop, vehiclePanel }) => {
	const mapRef = useRef(null);
	const routingRef = useRef(null);
	const containerRef = useRef(null);
	const currentLocationMarkerRef = useRef(null);
	const [currentLocation, setCurrentLocation] = useState(null);

	const Dpickup = [pickup[1], pickup[0]];
	const Ddrop = [drop[1], drop[0]];
	console.log(Dpickup, Ddrop);

	// Initialize map and get current location
	useEffect(() => {
		if (!mapRef.current && containerRef.current) {
			mapRef.current = L.map(containerRef.current, {
				center: [28.6139, 77.209],
				zoom: 13,
				zoomControl: false,
			});

			L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
				maxZoom: 19,
			}).addTo(mapRef.current);

			// Get current location
			if ("geolocation" in navigator) {
				navigator.geolocation.getCurrentPosition(
					(position) => {
						const { latitude, longitude } = position.coords;
						setCurrentLocation([latitude, longitude]);

						mapRef.current.setView([latitude, longitude], 15);

						if (currentLocationMarkerRef.current) {
							currentLocationMarkerRef.current.remove();
						}

						currentLocationMarkerRef.current = L.marker([latitude, longitude])
							.addTo(mapRef.current)
							.openPopup();

						// Add accuracy circle
						// L.circle([latitude, longitude], {
						//   radius: position.coords.accuracy,
						//   color: '#3b82f6',
						//   fillColor: '#3b82f6',
						//   fillOpacity: 0.15
						// }).addTo(mapRef.current);
					},
					(error) => {
						console.error("Error getting location:", error);
					},
					{
						enableHighAccuracy: true,
						timeout: 5000,
						maximumAge: 0,
					}
				);
			}
		}

		return () => {
			if (mapRef.current) {
				mapRef.current.remove();
				mapRef.current = null;
				currentLocationMarkerRef.current = null;
			}
		};
	}, []);

	// Handle routing when vehiclePanel becomes true
	useEffect(() => {
		const createRoute = async () => {
			if (!pickup || !drop || !vehiclePanel || !mapRef.current) {
				return;
			}

			try {
				if (routingRef.current) {
					routingRef.current.remove();
				}

				// Create route
				routingRef.current = L.Routing.control({
					waypoints: [L.latLng(Dpickup[0], Dpickup[1]), L.latLng(Ddrop[0], Ddrop[1])],
					router: L.Routing.osrmv1({
						serviceUrl: "https://router.project-osrm.org/route/v1",
						profile: "driving",
					}),
					lineOptions: {
						styles: [{ color: "green", weight: 6 }],
					},
					show: false,
					addWaypoints: false,
					draggableWaypoints: false,
					fitSelectedRoutes: true,
				}).addTo(mapRef.current);

				// Add simple markers
				L.marker(Dpickup).addTo(mapRef.current).bindPopup("Pickup Location").openPopup();

				L.marker(Ddrop).addTo(mapRef.current).bindPopup("Drop Location").openPopup();

				// Fit bounds
				const bounds = L.latLngBounds([Dpickup, Ddrop]);
				mapRef.current.fitBounds(bounds, { padding: [50, 50] });
			} catch (error) {
				console.error("Error creating route:", error);
			}
		};

		if (vehiclePanel) {
      console.log("hi");
      
			createRoute();
		}
	}, [vehiclePanel, pickup, drop]);

	return (
		<div
			className={`h-full w-full transition-opacity duration-300 `}>
			<div ref={containerRef} className="w-full h-full" style={{ zIndex: 0 }} />
			<style>
				{`
          .leaflet-routing-container {
            display: none !important;
          }
        `}
			</style>
		</div>
	);
};

export default MapComponent;
