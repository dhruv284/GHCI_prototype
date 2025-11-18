import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/login"); // You can add login page later
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-r from-purple-600 via-blue-500 to-teal-400 flex flex-col justify-center items-center relative overflow-hidden">
      
      {/* Background floating circles */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full animate-pulse -translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full animate-pulse translate-x-1/4 translate-y-1/4"></div>

      <div className="z-10 flex flex-col items-center text-center px-4">
        <h1 className="text-6xl font-extrabold text-white mb-6 drop-shadow-lg">
          VoiceBank
        </h1>
        <p className="text-xl text-white/90 mb-12 max-w-xl drop-shadow-md">
          Manage your banking using just your voice. Fast, secure, and futuristic.
        </p>
        <button
          onClick={handleGetStarted}
          className="px-10 py-4 bg-white text-purple-600 font-semibold rounded-full shadow-lg hover:scale-105 hover:bg-gray-100 transition-transform duration-300"
        >
          Get Started
        </button>
      </div>

      {/* Footer info */}
      <div className="absolute bottom-4 text-white/80 text-sm">
        &copy; 2025 VoiceBank. All rights reserved.
      </div>
    </div>
  );
};

export default Home;
