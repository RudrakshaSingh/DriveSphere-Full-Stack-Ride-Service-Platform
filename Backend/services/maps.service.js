const axios = require('axios');

module.exports.getAddressCoordinate = async (address) => {
    const apiKey = process.env.OPEN_ROUTE_SERVICE_API_KEY;
    try {
        
        const response = await axios.get("https://api.openrouteservice.org/geocode/search", {
            params: {
                api_key: process.env.OPEN_ROUTE_SERVICE_API_KEY,
                text: address
            }
        });
console.log("b");

        // Extracting coordinates from the response
        if (response.data && response.data.features && response.data.features.length > 0) {
            const coordinates = response.data.features[0].geometry.coordinates; // [longitude, latitude]

            const coordinatesObject = {
                longitude: coordinates[0],
                latitude: coordinates[1]
            };
            console.log(coordinatesObject);
            
            // Returning the coordinates
            return coordinatesObject;
        } else {
            console.log('No coordinates found for the address');
            return null;
        }

    } catch (error) {
        if (error.response) {
            console.error("API Error Status:", error.response.status);
            console.error("API Error Data:", error.response.data);
        } else {
            console.error("Error Message:", error.message);
        }
        throw new Error('Unable to fetch coordinates');
    }
};
