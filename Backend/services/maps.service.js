const axios = require("axios");
const asyncHandler = require("../utils/AsyncHandler");
const ApiError = require("../utils/ApiError");
const captainModel = require("../models/captain.model");

module.exports.getAddressCoordinate = async (address) => {
	try {
	  const response = await axios.get("https://api.openrouteservice.org/geocode/search", {
		params: {
		  api_key: process.env.OPEN_ROUTE_SERVICE_API_KEY,
		  text: address,
		},
	  });
  
	  if (response.data && response.data.features && response.data.features.length > 0) {
		const coordinates = response.data.features[0].geometry.coordinates; // [longitude, latitude]
		const coordinatesObject = {
		  longitude: coordinates[0],
		  latitude: coordinates[1],
		};
  
		return coordinatesObject;
	  } else {
		return null; // Return null if coordinates are not found
	  }
	} catch (error) {
	  throw new ApiError(500, "Unable to fetch coordinates", error.message);
	}
  };
  

module.exports.getAutoCompleteSuggestions = async (address) => {
	if (!address) {
		throw new ApiError(400, "Missing required in map service fields");
	}

	try {
		const apiKey = process.env.OPEN_ROUTE_SERVICE_API_KEY; // API key stored in an environment variable

		// Send the request to OpenRouteService's autocomplete endpoint
		const response = await axios.get("https://api.openrouteservice.org/geocode/autocomplete", {
			params: {
				text: address, // The address you want to search for suggestions
				api_key: apiKey, // Your API key for the request
			},
		});
		const features = response.data.features; // Extract features from the response data
		if (!features || !Array.isArray(features)) {
			//check if features are missing or not an array (array of objects)
			return []; // Handle cases where features are missing or not an array
		}

		const nameArray = features.map((feature) => feature.properties.name);

		return nameArray;
	} catch (error) {
		throw new ApiError(500, "Unable to fetch address suggestions", error.message);
	}
};

module.exports.getDistanceTime = async (origin, destination) => {
	if (
		!Array.isArray(origin) ||
		origin.length !== 2 ||
		!Array.isArray(destination) ||
		destination.length !== 2 ||
		!origin.every((coord) => typeof coord === "number") ||
		!destination.every((coord) => typeof coord === "number")
	) {
		throw new ApiError(400, "Invalid input: Origin and destination must be arrays with two numeric coordinates [longitude, latitude].");
	}

	const apiKey = process.env.OPEN_ROUTE_SERVICE_API_KEY;
	const url = `https://api.openrouteservice.org/v2/matrix/driving-car`;

	try {
		const coordinates = [
			origin, // [longitude, latitude] of origin
			destination, // [longitude, latitude] of destination
		];

		// Make API request
		const response = await axios.post(
			url,
			{
				locations: coordinates,
				metrics: ["distance", "duration"],
				units: "km",
			},
			{
				headers: {
					Authorization: apiKey, // Set the API key in headers
					"Content-Type": "application/json", // Specify content type as JSON
				},
			}
		);
		const duration = response.data.durations[0][1]; // duration between origin and destination
		const durationInHours = (duration / 60).toFixed(2);

		const distance = response.data.distances[0][1].toFixed(2); // distance between origin and destination

		// Return the extracted duration and distance
		return {
			duration: durationInHours,
			distance,
		};
	} catch (error) {
		throw new ApiError(500, "Unable to fetch distance and time", error.message);
	}
};

module.exports.getCaptainsInRadius = async (longitude,latitude,radius) => {
	
    // Using $geoWithin with coordinates in the current schema format
    const captains = await captainModel.find({
        'location.latitude': { $exists: true },
        'location.longitude': { $exists: true },
        status: 'active'  // Only find online captains
    });
	
    // Manual filtering for captains within radius
    const nearbyCaptains = captains.filter(captain => {
        if (!captain.location.latitude || !captain.location.longitude) return false;

        // Calculate distance using Haversine formula
        const distance = calculateDistance(
            latitude,
            longitude,
            captain.location.latitude,
            captain.location.longitude
        );

        return distance <= radius;
    });
	
    return nearbyCaptains;
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLon/2) * Math.sin(dLon/2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;

    return distance; // Returns distance in kilometers
}

function toRad(degrees) {
    return degrees * (Math.PI / 180);
}