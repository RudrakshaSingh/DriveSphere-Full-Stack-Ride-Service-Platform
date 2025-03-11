/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import toast from "react-hot-toast";
import axios from "axios";

// Fix default icon issues
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
	iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
	iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
	shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const MapComponent = ({ pickup, drop, vehiclePanel, nearbyCaptainsNeeded }) => {
	const mapRef = useRef(null);
	const routingRef = useRef(null);
	const containerRef = useRef(null);
	const currentLocationMarkerRef = useRef(null);
	const [nearbyCaptains, setNearbyCaptains] = useState([]);
	const captainMarkersRef = useRef([]);

	const fetchNearbyCaptains = async (latitude, longitude, radius) => {
		if (nearbyCaptainsNeeded) {
			try {
				const res = await axios.post(
					`${import.meta.env.VITE_BASE_URL}/maps/nearby-captains`,
					{ latitude, longitude, radius },
					{
						headers: {
							Authorization: `Bearer ${localStorage.getItem("token")}`,
						},
					}
				);

				if (res.status === 200) {
					setNearbyCaptains(res.data.message || []);
					console.log("Fetched nearby captains:", res.data.message);
				} else {
					toast.error("Error in fetching nearby captains");
				}
			} catch (error) {
				console.error("Error fetching nearby captains:", error);
				toast.error("Error in fetching nearby captains");
			}
		}
	};

	// Initialize map and get current location, fetch captains every 15 seconds
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

						mapRef.current.setView([latitude, longitude], 15);

						if (currentLocationMarkerRef.current) {
							currentLocationMarkerRef.current.remove();
						}

						currentLocationMarkerRef.current = L.marker([latitude, longitude], {
							icon: L.icon({
								iconUrl:
									"https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png",
								iconSize: [30, 30],
								iconAnchor: [15, 20], // Adjusted anchor point
								popupAnchor: [0, -20], // Added popup anchor
							}),
						})
							.addTo(mapRef.current)
							.bindPopup("Current Location")
							.openPopup();

						// Initial fetch of nearby captains
						fetchNearbyCaptains(latitude, longitude, 50);

						// Set interval to fetch nearby captains every 15 seconds
						const intervalId = setInterval(() => {
							fetchNearbyCaptains(latitude, longitude, 50);
						}, 15000); // 15 seconds = 15000 milliseconds

						// Cleanup interval on unmount
						return () => {
							clearInterval(intervalId);
						};
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
	}, []); // Empty dependency array since this only runs once on mount

	// Add markers for nearby captains
	useEffect(() => {
		if (mapRef.current && nearbyCaptains.length > 0) {
			captainMarkersRef.current.forEach((marker) => marker.remove());
			captainMarkersRef.current = [];

			const bounds = L.latLngBounds([]);
			bounds.extend(currentLocationMarkerRef.current.getLatLng());

			nearbyCaptains.forEach((captain) => {
				console.log("Adding marker for captain:", captain);
				const marker = L.marker([captain.latitude, captain.longitude], {
					icon: L.icon({
						iconUrl: "https://cdn4.iconfinder.com/data/icons/car-and-service-2/64/gps_car_map_placeholder_map_location_placeholder-1024.png",
						iconSize: [45, 45],
						iconAnchor: [15, 20],
					}),
				})
					.addTo(mapRef.current)
					.bindPopup(`Captain at ${captain.latitude}, ${captain.longitude}`);
				captainMarkersRef.current.push(marker);
				bounds.extend([captain.latitude, captain.longitude]);
			});

			console.log("Nearby captains markers added:", nearbyCaptains);
			mapRef.current.fitBounds(bounds, { padding: [50, 50] });
		}
	}, [nearbyCaptains]);

	// Handle routing when vehiclePanel becomes true
	useEffect(() => {
		const createRoute = async () => {
			if (!pickup || !drop || !vehiclePanel || !mapRef.current) {
				return;
			}
			const Dpickup = [pickup[1], pickup[0]];
			const Ddrop = [drop[1], drop[0]];

			try {
				if (routingRef.current) {
					routingRef.current.remove();
				}

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

				L.marker(Dpickup).addTo(mapRef.current).bindPopup("Pickup Location").openPopup();
				L.marker(Ddrop).addTo(mapRef.current).bindPopup("Drop Location").openPopup();

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
		<div className={`h-full w-full transition-opacity duration-300`}>
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
