import { Route, Routes } from "react-router-dom";
import Start from "./pages/Start";
import UserSignup from "./pages/UserSignup";
import CaptainLogin from "./pages/CaptainLogin";
import CaptainSignup from "./pages/CaptainSignup";
import Home from "./pages/Home";
import UserProtectWrapper from "./pages/UserProtectWrapper";
import CaptainHome from "./pages/CaptainHome";
import CaptainProtectWrapper from "./pages/CaptainProtectWrapper";
import Riding from "./pages/Riding";
import CaptainRiding from "./pages/CaptainRiding";
import UserLogin from "./pages/UserLogin";
import ChatComponent from "./components/Chat/ChatComponent";
import UserProfile from "./components/UserMenu/UserProfile";
import RideHistory from "./components/UserMenu/RideHistory";
import Support from "./pages/Support";
import TermsofService from "./pages/Policy/TermsofService";
import PrivacyPolicy from "./pages/Policy/PrivacyPolicy";
import Error from "./pages/Error";
import Feedback from "./components/UserMenu/Feedback";
import AboutUs from "./pages/AboutUs";
import CaptainProfile from "./components/CaptainMenu/CaptainProfile";
import CaptainRideHistory from "./components/CaptainMenu/CaptainRideHistory";
import CaptainDashboard from "./components/CaptainMenu/CaptainDashboard";
import ScratchCard from "./components/UserMenu/ScratchCard";
export default function App() {
	return (
		<div>
			<Routes>
				<Route path="/" element={<Start />} />
				<Route path="/support"element={<Support />}/>
				<Route path="/chat" element={<ChatComponent />} />
				<Route path="/aboutus" element={<AboutUs />} />

				{/* User Routes */}
				<Route path="/login" element={<UserLogin />} />
				<Route path="/signup" element={<UserSignup />} />
				<Route path="/riding" element={<UserProtectWrapper><Riding /></UserProtectWrapper>}/>
				<Route path="/home"element={<UserProtectWrapper><Home /></UserProtectWrapper>}/>
				<Route path="/user-profile" element={<UserProtectWrapper><UserProfile /></UserProtectWrapper>}/>
				<Route path="/user-rideHistory" element={<UserProtectWrapper><RideHistory /></UserProtectWrapper>}/>
				<Route path="/user-feedback"element={<UserProtectWrapper><Feedback /></UserProtectWrapper>}/>
				<Route path="/user-scratch-card"element={<UserProtectWrapper><ScratchCard /></UserProtectWrapper>}/>



				{/* Captain Routes */}
				<Route path="/captain-riding"element={<CaptainProtectWrapper><CaptainRiding /></CaptainProtectWrapper>}/>
				<Route path="/captain-login" element={<CaptainLogin />} />
				<Route path="/captain-signup" element={<CaptainSignup />} />
				<Route path="/captain-home"element={<CaptainProtectWrapper><CaptainHome /></CaptainProtectWrapper>}/>
				<Route path="/captain-profile" element={<CaptainProtectWrapper><CaptainProfile /></CaptainProtectWrapper>}/>
				<Route path="/captain-ride-history"element={<CaptainProtectWrapper><CaptainRideHistory /></CaptainProtectWrapper>}/>
				<Route path="/captain-dashboard"element={<CaptainProtectWrapper><CaptainDashboard /></CaptainProtectWrapper>}/>

				{/* policies */}
				<Route path="/terms-of-service" element={<TermsofService />} />
				<Route path="/privacy-policy" element={<PrivacyPolicy />} />

				{/* 404 page */}
				<Route path="*" element={<Error />} />
				
			</Routes>
		</div>
	);
}
