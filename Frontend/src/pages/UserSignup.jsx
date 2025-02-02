import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserDataContext } from "../context/UserContext";

function UserSignup() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [profileImage, setProfileImage] = useState(null);
	const [previewURL, setPreviewURL] = useState(null);

	const navigate = useNavigate();
	const { setUser } = useContext(UserDataContext);

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			if (file.size > 5 * 1024 * 1024) {
				alert('File size should be less than 5MB');
				return;
			}
			setProfileImage(file);
			setPreviewURL(URL.createObjectURL(file));
			// console.log(URL.createObjectURL(file));
			// The URL you're referring to (blob:http://localhost:5173/e6a1d4ef-e377-4246-9697-da62dcb060ce) is a Blob URL that references a file object stored in memory by the browser.
			//inbuilt browser function
		}
	};

	const removeImage = () => {
		setProfileImage(null);
		setPreviewURL(null);
	};

	const submitHandler = async (e) => {
		e.preventDefault();

		const formData = new FormData();
		formData.append("email", email);
		formData.append("password", password);
		formData.append("firstname", firstName);
		formData.append("lastname", lastName);
		if (profileImage) formData.append("profileImage", profileImage);

		try {
			const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/register`, formData, {
				headers: { "Content-Type": "multipart/form-data" },
			});

			if (response.status === 201) {
				const data = response.data;
				setUser(data.user);
				localStorage.setItem("token", data.token);
				navigate("/login");
			}
		} catch (error) {
			console.log("Error in signup page:", error);
		}

		// Reset form
		setEmail("");
		setPassword("");
		setFirstName("");
		setLastName("");
		setProfileImage(null);
		setPreviewURL(null);
	};

	return (
		<div className="p-7 flex flex-col justify-between h-screen">
			<div>
				<img
					className="w-16 mb-10"
					src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYQy-OIkA6In0fTvVwZADPmFFibjmszu2A0g&s"
					alt="Logo"
				/>

				<form onSubmit={submitHandler}>
					<div className="mb-6">
						<h3 className="text-lg font-medium mb-2">Profile Image</h3>
						<div className="flex items-center gap-4">
							{previewURL ? (
								<div className="relative">
									<img
										src={previewURL}
										alt="Preview"
										className="w-20 h-20 rounded-full object-cover border-2 border-gray-300"
									/>
									<button
										type="button"
										onClick={removeImage}
										className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
									>
										×
									</button>
								</div>
							) : (
								<label className="cursor-pointer group">
									<div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300 group-hover:border-gray-400 transition-colors">
										<svg
											className="w-6 h-6 text-gray-400 group-hover:text-gray-500"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M12 4v16m8-8H4"
											/>
										</svg>
									</div>
									<input
										type="file"
										accept="image/*"
										onChange={handleImageChange}
										className="hidden"
									/>
								</label>
							)}
						</div>
					</div>

					<h3 className="text-lg font-medium mb-2">What's your name</h3>
					<div className="flex gap-4 mb-6">
						<input
							required
							className="bg-gray-50 w-1/2 rounded-lg px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-blue-500"
							type="text"
							placeholder="First name"
							value={firstName}
							onChange={(e) => setFirstName(e.target.value)}
						/>
						<input
							required
							className="bg-gray-50 w-1/2 rounded-lg px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-blue-500"
							type="text"
							placeholder="Last name"
							value={lastName}
							onChange={(e) => setLastName(e.target.value)}
						/>
					</div>

					<h3 className="text-lg font-medium mb-2">What's your email</h3>
					<input
						required
						className="bg-gray-50 mb-6 rounded-lg px-4 py-3 border w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
						type="email"
						placeholder="email@example.com"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					
					/>

					<h3 className="text-lg font-medium mb-2">Enter your password</h3>
					<input
						className="bg-[#eeeeee] mb-6 rounded px-4 py-2 border w-full text-lg placeholder:text-base"
						required
						type="password"
						placeholder="password"
						value={password}
						onChange={(e) => {
							setPassword(e.target.value);
						}}
					/>

					<button className="bg-[#111] text-white font-semibold mb-3 rounded px-4 py-2 border w-full text-lg placeholder:text-base">
						Create account
					</button>
				</form>
				<p className="text-center">
					Already have an account?
					<Link to={"/login"} className="text-blue-600">
						Login here
					</Link>
				</p>
			</div>
			<div>
				<p className="text-[10px] leading-tight">
					This site is protected by reCAPTCHA and the <span className="underline">Google Privacy Policy</span>{" "}
					and <span className="underline">Terms of Service apply</span>.
				</p>
			</div>
		</div>
	);
}

export default UserSignup;
