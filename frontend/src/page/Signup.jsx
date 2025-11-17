import React, { useState, useRef } from "react";

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    pinEmbedding: null
  });

  const [status, setStatus] = useState("");  // <-- Status text

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

    // Auto stop after 4 seconds
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
    <div style={{ padding: 40 }}>
      <h1>🎤 Voice Signup</h1>

      <input
        placeholder="Name"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      /><br /><br />

      <input
        placeholder="Email"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      /><br /><br />

      <input
        placeholder="Password"
        type="password"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      /><br /><br />

      <button onClick={startPinRecording}>🎙 Record Voice PIN</button>
      <br /><br />

      <button onClick={signup}>Signup</button>

      {/* STATUS UI */}
      <p style={{ marginTop: 20, fontWeight: "bold", color: "blue" }}>
        {status}
      </p>
    </div>
  );
};

export default Signup;
