/* eslint-disable react/prop-types */
import { MapPin, Clock, Compass, XCircle } from "lucide-react";

const LocationSearchPanel = (props) => {
    const { 
        pickupSuggestions, 
        setVehiclePanel, 
        setPanelOpen, 
        setPickup, 
        setDestination, 
        activeField, 
        destinationSuggestions 
    } = props;

    const handleSuggestionClick = (suggestion) => {
        activeField === 'pickup' ? setPickup(suggestion) : setDestination(suggestion);
        setVehiclePanel(true);
        setPanelOpen(false);
    };

    const suggestionsToRender = activeField === 'pickup' ? pickupSuggestions : destinationSuggestions;
    const uniqueSuggestions = [...new Set(suggestionsToRender)];

    return (
        <div className="h-[60vh] overflow-y-auto p-4">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                    {activeField === 'pickup' ? 'Pickup Locations' : 'Destination Locations'}
                </h2>
                <button 
                    onClick={() => setPanelOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <XCircle className="w-5 h-5 text-gray-500" />
                </button>
            </div>

            {uniqueSuggestions.length > 0 ? (
                <div className="space-y-2">
                    {uniqueSuggestions.map((elem, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleSuggestionClick(elem)}
                            className="w-full flex items-center p-4 space-x-4 text-left
                                bg-white hover:bg-blue-50 border border-gray-200 rounded-xl
                                transition-all duration-200 ease-in-out
                                hover:border-blue-300 focus:outline-none focus:ring-2
                                focus:ring-blue-500 focus:border-blue-500"
                        >
                            <div className="flex-shrink-0">
                                {activeField === 'pickup' ? (
                                    <Compass className="w-6 h-6 text-blue-600" />
                                ) : (
                                    <Clock className="w-6 h-6 text-green-600" />
                                )}
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900">{elem}</h4>
                                <p className="text-sm text-gray-500 mt-1">
                                    {activeField === 'pickup' 
                                        ? 'Suggested pickup point' 
                                        : 'Popular destination'}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                    <MapPin className="w-12 h-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No locations found
                    </h3>
                    <p className="text-gray-500 max-w-xs">
                        Try searching for a different address or landmark
                    </p>
                </div>
            )}
        </div>
    );
};

export default LocationSearchPanel;