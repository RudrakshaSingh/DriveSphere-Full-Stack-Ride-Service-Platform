const mapsService = require("../services/maps.service");
const { validationResult } = require("express-validator");
const asyncHandler = require("../utils/AsyncHandler");
const ApiError = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const axios = require("axios");

module.exports.getCoordinates = asyncHandler(async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const { address } = req.query;

	try {
		// Call service to get coordinates
		const coordinates = await mapsService.getAddressCoordinate(address);

		if (!coordinates) {
			throw new ApiError(404, "Coordinates not found for the given address");
		}

		return res.status(200).json(new ApiResponse(200, "Coordinates fetched successfully", coordinates));
	} catch (error) {
		throw new ApiError(error.status || 500, "Coordinates fetch error", error.message);
	}
});

module.exports.getAutoCompleteSuggestions = asyncHandler(async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	try {
		const address = req.query.address; // Address passed as query parameter

		const suggestions = await mapsService.getAutoCompleteSuggestions(address);

		return res.status(200).json(new ApiResponse(200, "Suggestions fetched successfully", suggestions));
	} catch (error) {
		throw new ApiError(500, "Unable to fetch suggestions", error.message);
	}
});

module.exports.getDistanceTime = asyncHandler(async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	try {
		// Extract origin and destination from the request body
		const { origin, destination } = req.body;

		if (
			!origin ||
			!destination ||
			!Array.isArray(origin) ||
			origin.length !== 2 ||
			!Array.isArray(destination) ||
			destination.length !== 2
		) {
			throw new ApiError(
				400,
				"Invalid input: Both origin and destination must be arrays with exactly two numeric coordinates [longitude, latitude]."
			);
		}

		// Call the service function to get the distance and time
		const distanceTime = await mapsService.getDistanceTime(origin, destination);

		return res.status(200).json(new ApiResponse(200, "Distance and time fetched successfully", distanceTime));
	} catch (error) {
		throw new ApiError(500, "Unable to fetch distance and time in controller", error.message);
	}
});

module.exports.reverseGeocoding = asyncHandler(async (req, res) => {
	const { longitude, latitude } = req.query;

	try {
		const apiKey = process.env.OPEN_ROUTE_SERVICE_API_KEY;
		console.log("hi", apiKey);

		const response = await axios.get("https://api.openrouteservice.org/geocode/reverse", {
			params: {
				"point.lon": longitude,
				"point.lat": latitude,
				api_key: apiKey,
			},
		});

		// Map through all features and extract their labels
		const locationLabels = response.data.features
			.map((feature) => feature?.properties?.label)
			.filter((label) => label !== undefined);

		if (locationLabels.length === 0) {
			throw new ApiError(404, "Location not found for the given coordinates");
		}

		return res.status(200).json(new ApiResponse(200, "Location fetched successfully", locationLabels));
	} catch (error) {
		throw new ApiError(500, "Unable to fetch location", error.message);
	}
});

module.exports.getNearbyCaptains = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		throw new ApiError(400, "error in getNearbyCaptains controller", errors.array());
	}
	try {
		const { longitude, latitude, radius } = req.body;
		console.log("Longitude:", longitude, "Latitude:", latitude, "Radius:", radius);

		const nearestCaptains = await mapsService.getCaptainsInRadius(longitude, latitude, radius);
		const locations = nearestCaptains.map((captain) => captain.location);
		console.log("Nearest Captainsrrr:", locations);

		return res.status(200).json(new ApiResponse(200, "Nearest captains fetched successfully", locations));
	} catch (error) {
		console.error("Error fetching nearest captains:", error.message);
		throw new ApiError(500, "Unable to get nearest captains", error.message);
	}
};
