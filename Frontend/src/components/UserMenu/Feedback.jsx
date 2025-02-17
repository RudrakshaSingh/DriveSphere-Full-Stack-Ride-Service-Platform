/* eslint-disable react/prop-types */
import { useState } from "react";
import { Star, Angry, Frown, Meh, Smile, Laugh, Car, Shield, User, Gauge, Hand, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const Feedback = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const rideId = location.state?.rideId
  const captainId = location.state?.captainId
  const type=location.state?.type
  
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

	const emojis = [
		{ icon: <Angry />, color: "bg-red-500", value: 1 },
		{ icon: <Frown />, color: "bg-orange-500", value: 2 },
		{ icon: <Meh />, color: "bg-yellow-500", value: 3 },
		{ icon: <Smile />, color: "bg-green-400", value: 4 },
		{ icon: <Laugh />, color: "bg-green-600", value: 5 },
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
				toast.success("Feedback sent successfully");
				// Reset state values
				setRatings({ vehicle: 0, safety: 0, behavior: 0, speed: 0, cleanliness: 0 });
				setSelectedEmoji(0);
				setMessage("");
				setEmail("");
        if(type){
          navigate('/home')
        }else{
          window.history.back()
        }
			}else if(response.status===201){
        toast.error(response.data.error);
      }
		} catch (error) {
			console.error("Error sending feedback:", error);
			toast.error("Failed to send feedback. Please try again.");
		}
	};

	const renderStars = (questionId, currentRating) => {
		return [...Array(5)].map((_, i) => (
			<button
				key={i}
				type="button"
				onClick={() => handleRating(questionId, i + 1)}
				className={`p-1 ${i < currentRating ? "text-yellow-400" : "text-gray-300"}`}>
				<Star fill={i < currentRating ? "currentColor" : "transparent"} />
			</button>
		));
	};

	return (
		<div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
			{/* Hero Section */}
			<div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-blue-700 text-white relative">
				<div className="absolute top-4 left-4">
					<button
						onClick={() => navigate('/home')}
						className="flex items-center space-x-2 text-white hover:text-blue-100 transition-colors">
						<ArrowLeft className="w-5 h-5" />
					</button>
				</div>
				<div className="container mx-auto px-4 pt-8 pb-16 ">
					<h1 className="text-3xl md:text-5xl font-bold mb-3 text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
						Feedback
					</h1>
					<h2 className="text-xl md:text-2xl mb-2 text-center font-medium bg-gradient-to-r from-pink-400 to-green-300 bg-clip-text text-transparent">
						Share Your Experience
					</h2>
					<p className="text-base md:text-lg opacity-90 text-center">Help us improve our services</p>
				</div>
			</div>

			<div className="container mx-auto px-4 mt-8">
				<form onSubmit={handleSubmit} className="space-y-6">
					{/* Overall Experience using Emojis */}
					<div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
						<h2 className="text-lg font-semibold mb-4 text-gray-800">Overall Experience</h2>
						<div className="flex justify-between">
							{emojis.map((emoji) => (
								<button
									key={emoji.value}
									type="button"
									onClick={() => setSelectedEmoji(emoji.value)}
									className={`${emoji.color} p-3 rounded-full ${
										selectedEmoji === emoji.value ? "ring-4 ring-blue-200" : ""
									}`}>
									{emoji.icon}
								</button>
							))}
						</div>
					</div>

					{/* Question Cards */}
					{questions.map((q) => (
						<div key={q.id} className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
							<div className="flex items-center gap-3 mb-4">
								<span className="text-blue-500">{q.icon}</span>
								<h3 className="text-lg font-medium text-gray-800">{q.title}</h3>
							</div>
							<div className="flex justify-center">{renderStars(q.id, ratings[q.id])}</div>
						</div>
					))}

					{/* Additional Comments */}
					<div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Additional Comments (optional)
						</label>
						<textarea
							value={message}
							onChange={(e) => setMessage(e.target.value)}
							className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							rows="4"
							placeholder="Any additional feedback or comments..."
						/>
					</div>

					{/* Email Input */}
					<div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
						<label className="block text-sm font-medium text-gray-700 mb-2">Email (optional)</label>
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							placeholder="Enter email if you'd like us to follow up"
						/>
					</div>

					<button
						type="submit"
						className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg">
						Submit Feedback
					</button>
				</form>
			</div>
		</div>
	);
};

export default Feedback;
