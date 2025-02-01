const mapService = require('../services/maps.service');
const { validationResult } = require('express-validator');
module.exports.getCoordinates = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { address } = req.query;
    try {
        const coordinates = await mapService.getAddressCoordinate(address);
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
        
        const suggestions = await mapService.getAutoCompleteSuggestions(address);
        
        res.status(200).json({

            data: suggestions,
        });
    } catch (error) {
        console.log("Error fetching suggestions controller:", error.message);
        res.status(500).json({ error: "Unable to fetch suggestions" });
    }
};