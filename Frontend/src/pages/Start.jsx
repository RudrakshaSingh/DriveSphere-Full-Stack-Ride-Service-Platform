import { HelpCircle } from "lucide-react";
import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";

function Start() {
  const navigate = useNavigate()
  return (
    <div className="relative bg-cover bg-center bg-[url(https://images.unsplash.com/photo-1557404763-69708cd8b9ce?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8dHJhZmZpYyUyMGxpZ2h0fGVufDB8fDB8fHww)] h-screen w-full flex flex-col justify-between">
      {/* Header with semi-transparent background */}
      <div className="absolute top-0 left-0 right-0 bg-black/50 py-4 px-6 flex items-center justify-between">
        <img 
          height={80} 
          width={150} 
          src={logo} 
          alt="DriveSphere Logo" 
          className="filter brightness-0 invert"
        />
        <button onClick={() => navigate("/support")} className="text-white/90 p-2 hover:text-white transition-colors">
          <HelpCircle size={32} />
        </button>
      </div>

      {/* Content Section positioned at bottom */}
      <div className="mt-auto mb-4 px-4 w-full">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl p-6 max-w-md mx-auto flex flex-col items-center justify-center min-h-[250px]">
          <h2 className="text-4xl font-bold text-gray-900 mb-6 text-center">
            Get Started with DriveSphere
          </h2>
          <Link 
            to="/login"
            className="block w-full bg-black text-white py-4 rounded-xl text-lg font-semibold text-center
                       hover:bg-gray-900 transition-colors duration-200 transform hover:scale-[1.02]
                       active:scale-95 shadow-md"
          >
            Continue
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Start;
