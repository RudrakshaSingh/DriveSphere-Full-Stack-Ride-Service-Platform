import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import UserContext from "./context/UserContext.jsx";
import CaptainContext from "./context/CapatainContext.jsx";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<CaptainContext>
			<UserContext>
				<BrowserRouter>
					<App />
					<Toaster />
				</BrowserRouter>
			</UserContext>
		</CaptainContext>
	</StrictMode>
);
