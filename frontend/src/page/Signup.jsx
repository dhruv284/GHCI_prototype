import React, { useState, useRef } from "react";

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    pinEmbedding: null
  });

  const [status, setStatus] = useState("");  // Status text
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);

  // ----------------------------------------------------
  // RECORD PIN
  // ----------------------------------------------------
  const startPinRecording = async () => {
    setStatus("🎙 Recording PIN... Speak now!");

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    audioChunks.current = [];

    mediaRecorderRef.current.ondataavailable = (e) => {
      audioChunks.current.push(e.data);
    };

    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });
      uploadPinAudio(audioBlob);
    };

    mediaRecorderRef.current.start();

    setTimeout(() => {
      mediaRecorderRef.current.stop();
      setStatus("⏳ Processing your audio...");
    }, 4000);
  };

  // ----------------------------------------------------
  // UPLOAD PIN AUDIO
  // ----------------------------------------------------
  const uploadPinAudio = async (blob) => {
    setStatus("📤 Uploading audio to backend...");

    const fd = new FormData();
    fd.append("pin_audio", blob, "pin.wav");

    const res = await fetch("http://localhost:5000/upload_pin", {
      method: "POST",
      body: fd
    });

    const data = await res.json();

    if (data.embedding) {
      setForm((prev) => ({
        ...prev,
        pinEmbedding: data.embedding
      }));
      setStatus("✅ Voice PIN stored successfully!");
    } else {
      setStatus("❌ Failed to process voice. Try again.");
    }
  };

  // ----------------------------------------------------
  // SIGNUP
  // ----------------------------------------------------
  const signup = async () => {
    if (!form.pinEmbedding) {
      alert("Record a Voice PIN first!");
      return;
    }

    setStatus("🔄 Creating your account...");

    const res = await fetch("http://localhost:5000/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        password: form.password,
        embedding: form.pinEmbedding
      })
    });

    const data = await res.json();
    setStatus(data.message);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-purple-600 via-blue-500 to-teal-400 px-4">
      <div className="bg-white rounded-xl shadow-xl p-10 max-w-md w-full">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">🎤 Voice Signup</h1>

        {/* Name */}
        <input
          placeholder="Name"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

        {/* Email */}
        <input
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

        {/* Password */}
        <input
          placeholder="Password"
          type="password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full px-4 py-2 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

        {/* Record PIN */}
        <button
          onClick={startPinRecording}
          className="w-full py-3 mb-4 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 flex justify-center items-center gap-2"
        >
          🎙 Record Voice PIN
        </button>

        {/* Signup */}
        <button
          onClick={signup}
          className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg shadow-lg hover:bg-green-700 transition duration-300"
        >
          Signup
        </button>

        {/* Status */}
        {status && (
          <p className="mt-6 text-center text-gray-800 font-medium">
            {status}
          </p>
        )}
      </div>
    </div>
  );
};

export default Signup;
