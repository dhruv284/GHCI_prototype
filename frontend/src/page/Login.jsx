import React, { useRef, useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);

  // ----------------------------------------------------
  // RECORD PIN AUDIO
  // ----------------------------------------------------
  const startLoginRecording = async () => {
    alert("Speak your PIN");

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
    setTimeout(() => mediaRecorderRef.current.stop(), 4000);
  };

  // ----------------------------------------------------
  // SEND AUDIO + EMAIL TO BACKEND
  // ----------------------------------------------------
  const uploadLoginAudio = async (audioBlob) => {
    const formData = new FormData();
    formData.append("pin_audio", audioBlob, "login_pin.wav");
    formData.append("email", email);

    const res = await fetch("http://localhost:5000/login", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    console.log("Login response:", data);

    setStatus(`Status: ${data.status} (Score: ${data.score.toFixed(3)})`);
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>🔐 Voice Login</h1>

      {/* Email */}
      <label>Email:</label><br/>
      <input
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      /><br/><br/>

      {/* PIN Voice */}
      <button onClick={startLoginRecording}>
        🎙 Speak PIN to Login
      </button>

      <br/><br/>

      {/* Status */}
      <div style={{ fontSize: 18, marginTop: 20 }}>
        {status}
      </div>
    </div>
  );
};

export default Login;
