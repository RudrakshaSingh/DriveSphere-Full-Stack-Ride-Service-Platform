/* eslint-disable react/prop-types */
const LocationSearchPanel = (props) => {
    // Destructure props for ease of use
    const { pickupSuggestions, setVehiclePanel, setPanelOpen, setPickup, setDestination, activeField, destinationSuggestions } = props;

    // Handle click on suggestion to set either pickup or destination based on activeField
    const handleSuggestionClick = (suggestion) => {
        if (activeField === 'pickup') {
            setPickup(suggestion); // Set the pickup location
        } else if (activeField === 'destination') {
            setDestination(suggestion); // Set the destination location
        }
        // Optionally, close the panel after selecting
        setVehiclePanel(true);
        setPanelOpen(false);
    };

    // Determine which suggestions to display based on activeField
    const suggestionsToRender = activeField === 'pickup' ? pickupSuggestions : destinationSuggestions;

    return (
        <div>
            {/* Render suggestions based on activeField */}
            {suggestionsToRender.length > 0 ? (
                suggestionsToRender.map((elem, idx) => (
                    <div
                        key={idx}
                        onClick={() => handleSuggestionClick(elem)} // Handle suggestion click
                        className="flex gap-4 border-2 p-3 border-gray-200 active:border-black rounded-xl items-center my-2 justify-start"
                    >
                        <h2 className="bg-[#eee] h-8 flex items-center justify-center w-12 rounded-full">
                            <i className="ri-map-pin-line"></i>
                        </h2>
                        <h4 className="font-medium">{elem}</h4>
                    </div>
                ))
            ) : (
                <div>No suggestions found.</div>
            )}
        </div>
    );
};

export default LocationSearchPanel;
