import { Route, Routes } from "react-router-dom";
import Start from "./pages/Start";
import UserSignup from "./pages/UserSignup";
import CaptainLogin from "./pages/CaptainLogin";
import CaptainSignup from "./pages/CaptainSignup";
import Home from "./pages/Home";
import UserProtectWrapper from "./pages/UserProtectWrapper";
import UserLogout from "./pages/UserLogout";
import CaptainHome from "./pages/CaptainHome";
import CaptainProtectWrapper from "./pages/CaptainProtectWrapper";
import CaptainLogout from "./pages/CaptainLogout";
import Riding from "./pages/riding";
import CaptainRiding from "./pages/CaptainRiding";
import UserLogin from "./pages/UserLogin";
import ChatComponent from "./components/Chat/ChatComponent";
import UserProfile from "./components/UserMenu/UserProfile";
import RideHistory from "./components/UserMenu/RideHistory";
import Support from "./components/UserMenu/Support";
import TermsofService from "./pages/Policy/TermsofService";
import PrivacyPolicy from "./pages/Policy/PrivacyPolicy";
import Error from "./pages/Error";
import Feedback from "./components/UserMenu/Feedback";

export default function App() {
	return (
		<div>
			<Routes>
				<Route path="/" element={<Start />} />
				<Route path="/login" element={<UserLogin />} />
				<Route
					path="/riding"
					element={
						<UserProtectWrapper>
							<Riding />
						</UserProtectWrapper>
					}
				/>
				<Route
					path="/captain-riding"
					element={
						<CaptainProtectWrapper>
							<CaptainRiding />
						</CaptainProtectWrapper>
					}
				/>
				<Route path="/signup" element={<UserSignup />} />
				<Route path="/captain-login" element={<CaptainLogin />} />
				<Route path="/captain-signup" element={<CaptainSignup />} />
				<Route
					path="/home"
					element={
						<UserProtectWrapper>
							<Home />
						</UserProtectWrapper>
					}
				/>
				<Route
					path="/user/logout"
					element={
						<UserProtectWrapper>
							<UserLogout />
						</UserProtectWrapper>
					}
				/>
				<Route
					path="/user-profile"
					element={
						<UserProtectWrapper>
							<UserProfile />
						</UserProtectWrapper>
					}
				/>
				<Route
					path="/user-rideHistory"
					element={
						<UserProtectWrapper>
							<RideHistory />
						</UserProtectWrapper>
					}
				/>
				<Route
					path="/user-support"
					element={
						<UserProtectWrapper>
							<Support />
						</UserProtectWrapper>
					}
				/>
				<Route
					path="/user-feedback"
					element={
						<UserProtectWrapper>
							<Feedback />
						</UserProtectWrapper>
					}
				/>

				<Route
					path="/captain-home"
					element={
						<CaptainProtectWrapper>
							<CaptainHome />
						</CaptainProtectWrapper>
					}
				/>
				<Route
					path="/captain/logout"
					element={
						<CaptainProtectWrapper>
							<CaptainLogout />
						</CaptainProtectWrapper>
					}
				/>

				<Route path="/chat" element={<ChatComponent />} />

				{/* 404 page */}
				<Route path="*" element={<Error />} />
				{/* policies */}
				<Route path="/terms-of-service" element={<TermsofService />} />
				<Route path="/privacy-policy" element={<PrivacyPolicy />} />
			</Routes>
		</div>
	);
}
