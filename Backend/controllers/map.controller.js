const mapsService=require("../services/maps.service");
const { validationResult } = require('express-validator');
const asyncHandler = require('../utils/AsyncHandler');
const ApiError = require('../utils/ApiError');
const { ApiResponse } = require('../utils/ApiResponse');

module.exports.getCoordinates = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { address } = req.query;

  try {
    console.log("Received address query:", address);

    // Call service to get coordinates
    const coordinates = await mapsService.getAddressCoordinate(address);
    console.log("Coordinates returned from service:", coordinates); // Log the coordinates returned from service

    if (!coordinates) {
      console.log("No coordinates found for the address.");
      throw new ApiError(404, "Coordinates not found for the given address");
    }

    return res.status(200).json(new ApiResponse(200, "Coordinates fetched successfully", coordinates));
  } catch (error) {
    console.error("Error in getCoordinates controller:", error.message);
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
      !origin || !destination ||
      !Array.isArray(origin) || origin.length !== 2 ||
      !Array.isArray(destination) || destination.length !== 2
    ) {
      throw new ApiError(400, "Invalid input: Both origin and destination must be arrays with exactly two numeric coordinates [longitude, latitude].");
    }

    // Call the service function to get the distance and time
    const distanceTime = await mapsService.getDistanceTime(origin, destination);

    return res.status(200).json(new ApiResponse(200, "Distance and time fetched successfully", distanceTime));

  } catch (error) {
    throw new ApiError(500, "Unable to fetch distance and time in controller", error.message);
  }
});
  