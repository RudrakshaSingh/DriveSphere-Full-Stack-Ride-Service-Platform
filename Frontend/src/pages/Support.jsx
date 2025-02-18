import { useState } from "react";
import { Phone, Mail, MapPin, ArrowRight, ArrowLeft } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";

function Support() {
	const [name, setname] = useState("");
	const [email, setemail] = useState("");
	const [message, setmessage] = useState("");
	const [mobileNumber, setmobileNumber] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		// Mobile number validation
		const mobileRegex = /^[6-9]\d{9}$/;
		if (!mobileRegex.test(mobileNumber)) {
			toast.error("Mobile number must be 10 digits and start with 6, 7, 8, or 9.");
			return;
		}
		const userData = {
			name: name,
			email: email,
			message: message,
			mobileNumber: mobileNumber,
		};
		try {
			const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/extra/send-message`, userData);
			if (response.status === 200) {
				toast.success("Support Message sent successfully");
				setname("");
				setemail("");
				setmessage("");
				setmobileNumber("");
			} else if (response.status === 201) {
				toast.error(response.data.error);
			}
		} catch (error) {
			console.error("Error sending message:", error);
			toast.error("Failed to send message. Please try again.");
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
			{/* Hero Section */}
			<div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-blue-700 text-white relative">
				<div className="absolute top-4 left-4">
					<button
						onClick={() => window.history.back()}
						className="flex items-center space-x-2 text-white hover:text-blue-100 transition-colors">
						<ArrowLeft className="w-5 h-5" />
					</button>
				</div>
				<div className="container mx-auto px-4 pt-8 pb-16 ">
					<h1 className="text-3xl md:text-5xl font-bold mb-3 text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
						Support
					</h1>
					<h2 className="text-xl md:text-2xl mb-2 text-center font-medium bg-gradient-to-r from-pink-400 to-green-300 bg-clip-text text-transparent">
						We&apos;re Here to Help
					</h2>
					<p className="text-base md:text-lg opacity-90 text-center">Contact us anytime, 24/7</p>
				</div>
			</div>

			{/* Contact Cards */}
			<div className="container mx-auto px-2 -mt-8">
				<div className="grid grid-cols-3 gap-2 mb-8">
					{/* Call Us Card */}
					<div className="bg-blue-50 p-2 md:p-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
						<div className="flex flex-col md:flex-row items-center md:items-start mb-2">
							<div className="bg-gradient-to-br from-blue-100 to-blue-50 p-1.5 md:p-2.5 rounded-full mb-1 md:mb-0">
								<Phone className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
							</div>
							<h3 className="text-sm md:text-lg font-semibold md:ml-3 text-center md:text-left bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
								Call Us
							</h3>
						</div>
						<p className="text-gray-600 text-xs md:text-sm mb-1 md:mb-2 text-center md:text-left">
							Our team is ready
						</p>
						<a
							href="tel:+91 9999057399"
							className="inline-flex items-center justify-center w-full text-blue-600 hover:text-blue-700 text-xs md:text-sm font-medium">
							+91 999907399
							<ArrowRight className="w-3 h-3 md:w-4 md:h-4 " />
						</a>
					</div>

					{/* Email Us Card */}
					<div className="bg-purple-50 p-2 md:p-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
						<div className="flex flex-col md:flex-row items-center md:items-start mb-2">
							<div className="bg-gradient-to-br from-purple-100 to-purple-50 p-1.5 md:p-2.5 rounded-full mb-1 md:mb-0">
								<Mail className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
							</div>
							<h3 className="text-sm md:text-lg font-semibold md:ml-3 text-center md:text-left bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
								Email Us
							</h3>
						</div>
						<p className="text-gray-600 text-xs md:text-sm mb-1 md:mb-2 text-center md:text-left">
							Get in touch
						</p>
						<a
							href="mailto:support@drivesphere.com"
							className="inline-flex items-center justify-center w-full text-purple-600 hover:text-purple-700 text-xs md:text-sm font-medium">
							Email Support
							<ArrowRight className="w-3 h-3 md:w-4 md:h-4 ml-1" />
						</a>
					</div>

					{/* Visit Us Card */}
					<div className="bg-green-50 p-2 md:p-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
						<div className="flex flex-col md:flex-row items-center md:items-start mb-2">
							<div className="bg-gradient-to-br from-green-100 to-green-50 p-1.5 md:p-2.5 rounded-full mb-1 md:mb-0">
								<MapPin className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
							</div>
							<h3 className="text-sm md:text-lg font-semibold md:ml-3 text-center md:text-left bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
								Visit Us
							</h3>
						</div>
						<p className="text-gray-600 text-xs md:text-sm mb-1 md:mb-2 text-center md:text-left">
							Headquarters
						</p>
						<button
							onClick={() =>
								document.getElementById("map-section").scrollIntoView({ behavior: "smooth" })
							}
							className="inline-flex items-center justify-center w-full text-green-600 hover:text-green-700 text-xs md:text-sm font-medium">
							Delhi, India
							<ArrowRight className="w-3 h-3 md:w-4 md:h-4 ml-1" />
						</button>
					</div>
				</div>

				{/* Contact Form */}
				<div className="bg-white rounded-lg shadow-lg p-6 mb-8 border border-gray-100">
					<h3 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
						Send us a message
					</h3>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
								<input
									type="text"
									value={name}
									onChange={(e) => setname(e.target.value)}
									className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
									required
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
								<input
									type="email"
									value={email}
									onChange={(e) => setemail(e.target.value)}
									className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
									required
								/>
							</div>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
							<input
								type="tel"
								value={mobileNumber}
								onChange={(e) => {
									// Remove non-digit characters
									const value = e.target.value.replace(/\D/g, "");
									setmobileNumber(value);
								}}
								className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
								required
								maxLength="10"
								placeholder="Enter 10-digit mobile number"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
							<textarea
								value={message}
								onChange={(e) => setmessage(e.target.value)}
								rows={3}
								className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
								required></textarea>
						</div>
						<button
							type="submit"
							className="w-full md:w-auto bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white px-6 py-2.5 rounded-md hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 transition-all duration-300 text-sm font-medium shadow-md hover:shadow-lg">
							Send Message
						</button>
					</form>
				</div>

				{/* Map Section */}
				<div className="bg-white rounded-lg shadow-lg p-6 mb-8 border border-gray-100">
					<div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4">
						<h3 className="text-2xl font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
							Our Headquarters
						</h3>
						<p className="text-blue-600 font-medium text-sm mt-1 md:mt-0">
							B-17, Lal Bagh, Loni, Ghaziabad, India
						</p>
					</div>
					<div className="w-full h-[250px] md:h-[400px] rounded-lg overflow-hidden border border-gray-200">
						<iframe
							src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3498.4266538543666!2d77.2800219755046!3d28.736675875608068!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjjCsDQ0JzEyLjAiTiA3N8KwMTYnNTcuNCJF!5e0!3m2!1sen!2sin!4v1739771942390!5m2!1sen!2sin"
							width="100%"
							id="map-section"
							height="100%"
							style={{ border: 0 }}
							allowFullScreen
							loading="lazy"
							referrerPolicy="no-referrer-when-downgrade"></iframe>
					</div>
				</div>

				{/* Footer */}
				<div className="text-center border-t border-gray-200 pt-6 pb-4">
					<p className="text-xs text-gray-500 mb-2">© 2025 DriveSphere Rides. All rights reserved.</p>
					<div className="flex justify-center items-center space-x-4 text-xs">
						<Link to="/privacy-policy" className="text-blue-500 hover:text-gray-700 transition-colors">
							Privacy Policy
						</Link>
						<span className="text-gray-300">•</span>
						<Link to="/terms-of-service" className="text-blue-500 hover:text-gray-700 transition-colors">
							Terms of Service
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Support;
