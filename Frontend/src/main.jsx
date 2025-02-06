import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import UserContext from "./context/UserContext.jsx";
import CaptainContext from "./context/CapatainContext.jsx";
import { Toaster } from "react-hot-toast";
import SocketProvider from "./context/SocketContext.jsx";

createRoot(document.getElementById("root")).render(
	<CaptainContext>
		<UserContext>
			<SocketProvider>
				<BrowserRouter>
					<App />
					<Toaster />
				</BrowserRouter>
			</SocketProvider>
		</UserContext>
	</CaptainContext>
);
