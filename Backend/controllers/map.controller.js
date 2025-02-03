const mapsService = require('../services/maps.service');
const { validationResult } = require('express-validator');
module.exports.getCoordinates = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { address } = req.query;
    try {
        const coordinates = await mapsService.getAddressCoordinate(address);
        res.status(200).json(coordinates);
    } catch (error) {
        res.status(404).json({ message: 'Coordinates not found' });
    }
}

module.exports.getAutoCompleteSuggestions = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const address = req.query.address; // Address passed as query parameter
        
        const suggestions = await mapsService.getAutoCompleteSuggestions(address);
        
        res.status(200).json({

            data: suggestions,
        });
    } catch (error) {
        console.log("Error fetching suggestions controller:", error.message);
        res.status(500).json({ error: "Unable to fetch suggestions" });
    }
};

module.exports.getDistanceTime = async (req, res) => {
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
        return res.status(400).json({
          error: 'Invalid input: Both origin and destination must be arrays with exactly two numeric coordinates [longitude, latitude].'
        });
      }
  
      // Call the service function to get the distance and time
      const distanceTime = await mapsService.getDistanceTime(origin, destination);
  
      // Respond with the success message and distance/time data
      res.status(200).json({
        success: true,
        message: "Distance and time fetched successfully",
        data: distanceTime,
      });
  
    } catch (error) {
      console.error("Error fetching distance and time:", error.message);
      res.status(500).json({
        error: "Unable to fetch distance and time",
        details: error.message
      });
    }
  };
  