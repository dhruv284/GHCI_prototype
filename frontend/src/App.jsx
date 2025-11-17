import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./page/Login";
import Signup from "./page/Signup";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
};

export default App;
