const axios = require("axios");

module.exports.getAddressCoordinate = async (address) => {
	try {
		const response = await axios.get("https://api.openrouteservice.org/geocode/search", {
			params: {
				api_key: process.env.OPEN_ROUTE_SERVICE_API_KEY,
				text: address,
			},
		});

		// Extracting coordinates from the response
		if (response.data && response.data.features && response.data.features.length > 0) {
			const coordinates = response.data.features[0].geometry.coordinates; // [longitude, latitude]

			const coordinatesObject = {
				longitude: coordinates[0],
				latitude: coordinates[1],
			};
			console.log(coordinatesObject);

			// Returning the coordinates
			return coordinatesObject;
		} else {
			console.log("No coordinates found for the address");
			return null;
		}
	} catch (error) {
		if (error.response) {
			console.error("API Error Status:", error.response.status);
			console.error("API Error Data:", error.response.data);
		} else {
			console.error("Error Message:", error.message);
		}
		throw new Error("Unable to fetch coordinates");
	}
};

module.exports.getAutoCompleteSuggestions = async (address) => {
	console.log(address);

	if (!address) {
		throw new Error("Missing required fields");
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
        console.log(nameArray);
        
		return nameArray;
	} catch (error) {
		console.log("suggestin service error");

		// Enhanced error handling for debugging
		if (error.response) {
			console.error("API Error Status:", error.response.status);
			console.error("API Error Data:", error.response.data);
		} else {
			console.error("Error Message:", error.message);
		}
		throw new Error("Unable to fetch address suggestions");
	}
};
