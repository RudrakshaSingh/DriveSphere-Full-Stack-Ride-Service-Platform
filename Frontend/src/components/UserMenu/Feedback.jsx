import { useState } from "react";
import { Star, Angry, Frown, Meh, Smile, Laugh, Car, Shield, User, Gauge, Hand, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const Feedback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const rideId = location.state?.rideId;
  const captainId = location.state?.captainId;
  const type = location.state?.type;
  
  const [ratings, setRatings] = useState({
    vehicle: 0,
    safety: 0,
    behavior: 0,
    speed: 0,
    cleanliness: 0,
  });
  const [selectedEmoji, setSelectedEmoji] = useState(0);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const emojis = [
    { icon: <Angry className="w-8 h-8 text-white" />, color: "bg-red-500", value: 1, label: "Poor" },
    { icon: <Frown className="w-8 h-8 text-white" />, color: "bg-orange-500", value: 2, label: "Fair" },
    { icon: <Meh className="w-8 h-8 text-white" />, color: "bg-yellow-500", value: 3, label: "Average" },
    { icon: <Smile className="w-8 h-8 text-white" />, color: "bg-green-400", value: 4, label: "Good" },
    { icon: <Laugh className="w-8 h-8 text-white" />, color: "bg-green-600", value: 5, label: "Excellent" },
  ];

  const questions = [
    { id: "vehicle", title: "Vehicle Condition", icon: <Car size={24} /> },
    { id: "safety", title: "Safety Measures", icon: <Shield size={24} /> },
    { id: "behavior", title: "Driver Behavior", icon: <User size={24} /> },
    { id: "speed", title: "Ride Speed", icon: <Gauge size={24} /> },
    { id: "cleanliness", title: "Vehicle Cleanliness", icon: <Hand size={24} /> },
  ];

  const handleRating = (questionId, rating) => {
    setRatings((prev) => ({ ...prev, [questionId]: rating }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Check if overall experience is provided
    if (selectedEmoji === 0) {
      toast.error("Please select your overall experience");
      return;
    }
    // Check if all individual ratings are provided
    if (Object.values(ratings).some((r) => r === 0)) {
      toast.error("Please provide ratings for all questions");
      return;
    }
    
    setIsSubmitting(true);
    
    const feedbackData = {
      rideId,
      captainId,
      ratings,
      overallExperience: selectedEmoji,
      message,
      email,
    };
    
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/extra/feedback`, feedbackData);
      if (response.status === 200) {
        toast.success("Thank you for your feedback!");
        // Reset state values
        setRatings({ vehicle: 0, safety: 0, behavior: 0, speed: 0, cleanliness: 0 });
        setSelectedEmoji(0);
        setMessage("");
        setEmail("");
        
        setTimeout(() => {
          if(type) {
            navigate('/home');
          } else {
            window.history.back();
          }
        }, 1500);
      } else if(response.status === 201) {
        toast.error(response.data.error);
      }
    } catch (error) {
      console.error("Error sending feedback:", error);
      toast.error("Failed to send feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (questionId, currentRating) => {
    return [...Array(5)].map((_, i) => (
      <button
        key={i}
        type="button"
        onClick={() => handleRating(questionId, i + 1)}
        className={`p-1 transform transition-transform ${i < currentRating ? "text-yellow-400 scale-110" : "text-gray-300 hover:scale-105"}`}>
        <Star 
          className="w-8 h-8" 
          fill={i < currentRating ? "currentColor" : "transparent"} 
          strokeWidth={1.5}
        />
      </button>
    ));
  };

  const getCompletionPercentage = () => {
    let complete = 0;
    if (selectedEmoji > 0) complete++;
    complete += Object.values(ratings).filter(r => r > 0).length;
    return Math.round((complete / 6) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-blue-700 text-white relative">
        <div className="absolute top-4 left-4">
          <button
            onClick={() => navigate('/home')}
            className="flex items-center justify-center p-2 bg-white/10 rounded-full backdrop-blur-sm hover:bg-white/20 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
        <div className="container mx-auto px-4 pt-12 pb-16">
          <h1 className="text-3xl md:text-5xl font-bold mb-3 text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
            Rate Your Ride
          </h1>
          <h2 className="text-xl md:text-2xl mb-2 text-center font-medium bg-gradient-to-r from-pink-400 to-green-300 bg-clip-text text-transparent">
            Your Feedback Matters
          </h2>
          <p className="text-base md:text-lg opacity-90 text-center max-w-xl mx-auto">
            Help us improve our service quality by sharing your experience with this ride
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="container mx-auto px-4 mt-4">
        <div className="bg-white rounded-xl p-3 shadow-lg border border-gray-100">
          <div className="flex justify-between text-sm text-gray-500 mb-1">
            <span>Completion</span>
            <span>{getCompletionPercentage()}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${getCompletionPercentage()}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-4 pb-16">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Overall Experience using Emojis */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <h2 className="text-xl font-semibold mb-6 text-gray-800 text-center">How was your overall experience?</h2>
            <div className="flex justify-between items-center max-w-md mx-auto">
              {emojis.map((emoji) => (
                <div key={emoji.value} className="flex flex-col items-center">
                  <button
                    type="button"
                    onClick={() => setSelectedEmoji(emoji.value)}
                    className={`${emoji.color} p-1 rounded-full transition-all duration-200 ${
                      selectedEmoji === emoji.value 
                        ? "ring-4 ring-blue-300 scale-110 shadow-lg" 
                        : "hover:scale-105 opacity-80 hover:opacity-100"
                    }`}>
                    {emoji.icon}
                  </button>
                  <span className={`mt-2 text-xs font-medium ${selectedEmoji === emoji.value ? "text-blue-600" : "text-gray-500"}`}>
                    {emoji.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Question Cards */}
          <div className="space-y-4">
            {questions.map((q) => (
              <div key={q.id} className="bg-white rounded-xl p-5 shadow-lg border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-blue-500 bg-blue-50 p-2 rounded-lg">{q.icon}</span>
                  <h3 className="text-lg font-medium text-gray-800">{q.title}</h3>
                </div>
                <div className="flex justify-center space-x-1">{renderStars(q.id, ratings[q.id])}</div>
              </div>
            ))}
          </div>

          {/* Additional Comments */}
          <div className="bg-white rounded-xl p-5 shadow-lg border border-gray-100">
            <label className="block text-lg font-medium text-gray-800 mb-3">
              Additional Comments <span className="text-gray-500 text-sm">(optional)</span>
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
              rows="4"
              placeholder="Tell us more about your experience..."
            />
          </div>

          {/* Email Input */}
          <div className="bg-white rounded-xl p-5 shadow-lg border border-gray-100">
            <label className="block text-lg font-medium text-gray-800 mb-3">
              Email <span className="text-gray-500 text-sm">(optional)</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
              placeholder="Enter your email for follow-up"
            />
            <p className="mt-2 text-sm text-gray-500">We&apos;ll only contact you regarding this feedback if necessary</p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white py-4 rounded-xl font-semibold transition-all shadow-md hover:shadow-xl flex items-center justify-center space-x-2 ${
              isSubmitting ? "opacity-80 cursor-not-allowed" : "hover:translate-y-[-2px]"
            }`}>
            {isSubmitting ? (
              <>
                <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                <span>Submitting...</span>
              </>
            ) : (
              "Submit Feedback"
            )} 
          </button>
        </form>
      </div>
    </div>
  );
};

export default Feedback;