import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false); // ✅ loader state
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);

  // ----------------------------------------------------
  // RECORD PIN AUDIO
  // ----------------------------------------------------
  const startLoginRecording = async () => {
    alert("Speak your PIN");
    setLoading(true); // start loader
    setStatus("🎙 Recording PIN...");

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    mediaRecorderRef.current = new MediaRecorder(stream);
    audioChunks.current = [];

    mediaRecorderRef.current.ondataavailable = (e) => {
      audioChunks.current.push(e.data);
    };

    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });
      uploadLoginAudio(audioBlob);
    };

    mediaRecorderRef.current.start();

    // Auto stop after 4 seconds
    setTimeout(() => {
      mediaRecorderRef.current.stop();
      setStatus("⏳ Processing your audio...");
    }, 4000);
  };

  // ----------------------------------------------------
  // SEND AUDIO + EMAIL TO BACKEND
  // ----------------------------------------------------
  const uploadLoginAudio = async (audioBlob) => {
    const formData = new FormData();
    formData.append("pin_audio", audioBlob, "login_pin.wav");
    formData.append("email", email);

    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("Login response:", data);

      setStatus(`Status: ${data.status} (Score: ${data.score.toFixed(3)})`);
      
      // Navigate if score > 0.7
      if (data.score > 0.7) {
        navigate("/dashboard");
      }
    } catch (err) {
      setStatus("❌ Error connecting to server.");
    } finally {
      setLoading(false); // stop loader
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-purple-600 via-blue-500 to-teal-400 px-4">
      <div className="bg-white rounded-xl shadow-xl p-10 max-w-md w-full relative">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">🔐 Voice Login</h1>

        {/* Email */}
        <label className="block text-gray-700 font-medium mb-2">Email:</label>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter your email"
        />

        {/* PIN Voice */}
        <button
          onClick={startLoginRecording}
          disabled={loading} // disable during loading
          className={`w-full py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg transition duration-300 flex justify-center items-center gap-2 ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
          }`}
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
              Processing...
            </>
          ) : (
            "🎙 Speak PIN to Login"
          )}
        </button>

        {/* Status */}
        {status && (
          <div className="mt-6 text-center text-gray-800 font-medium text-lg">
            {status}
          </div>
        )}

        {/* Signup */}
        <div className="mt-8 text-center text-gray-600">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-blue-600 font-semibold hover:underline cursor-pointer"
          >
            Sign Up
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
