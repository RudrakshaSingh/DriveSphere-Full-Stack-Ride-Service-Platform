import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CaptainDataContext } from "../context/CapatainContext";
import axios from "axios";
import { Car, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { toast } from "react-hot-toast";

function CaptainLogin() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const { setCaptain } = useContext(CaptainDataContext);
	const navigate = useNavigate();

	const submitHandler = async (e) => {
		e.preventDefault();

		if (!email || !password) {
			toast.error("Please fill in all fields");
			return;
		}

		const captain = { email, password };

		try {
			const response = await toast.promise(
				axios.post(`${import.meta.env.VITE_BASE_URL}/captains/login`, captain),
				{
					loading: "Logging in...",
					success: "Login successful!",
					error: "Invalid credentials",
				}
			);

			if (response.status === 200) {
				const data = response.data;
				setCaptain(data.message.captain);
				localStorage.setItem("token", data.message.token);
				navigate("/captain-home");
			}
		} catch (error) {
			console.error("Login error:", error);
		}

		setEmail("");
		setPassword("");
	};

	return (
		<div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 items-center justify-center flex">
			<div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
				<div className="flex flex-col items-center mb-8">
					<Car className="w-20 h-20 text-blue-600 " />
					<h1 className="text-3xl font-bold text-gray-900">Captain Login</h1>
					<p className="text-gray-600 mt-2">Welcome Back</p>
				</div>

				<form onSubmit={submitHandler} className="space-y-6">
					<div>
						<label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
							Email Address
						</label>
						<div className="relative">
							<Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
							<input
								id="email"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="w-full px-4 py-2 pl-10 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
								placeholder="captain@example.com"
								required
							/>
						</div>
					</div>

					<div>
						<label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
							Password
						</label>
						<div className="relative">
							<Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
							<input
								id="password"
								type={showPassword ? "text" : "password"}
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="w-full px-4 py-2 pl-10 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
								placeholder="••••••••"
								required
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-500 focus:outline-none">
								{showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
							</button>
						</div>
					</div>

					<button
						type="submit"
						className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center">
						Sign In
						<ArrowRight className="ml-2 h-4 w-4" />
					</button>
				</form>

				<div className="mt-6 text-center">
					<p className="text-gray-600">
						Not a captain yet?{" "}
						<Link
							to="/captain-signup"
							className="text-blue-600 hover:text-blue-800 font-semibold transition-colors">
							Join our fleet
						</Link>
					</p>
				</div>

				<div className="mt-4  border-gray-200 pt-4">
					<Link
						to="/login"
						className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center">
						Sign in as Regular User
					</Link>
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

export default CaptainLogin;
