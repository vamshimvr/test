// src/RoutesList.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Wardrobe from "./pages/Wardrobe";
import FashionChoices from "./pages/FashionChoices";
import Profile from "./components/Profile";
import OTPVerify from "./components/OTPVerify";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import AdvisorPanel from "./pages/AdvisorPanel";
import RoleSwitch from "./components/RoleSwitch";

export default function RoutesList() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/wardrobe" element={<Wardrobe />} />
      <Route path="/choices" element={<FashionChoices />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/otp" element={<OTPVerify />} />
      <Route path="/forgot" element={<ForgotPassword />} />
      <Route path="/reset" element={<ResetPassword />} />
      <Route path="/advisor" element={<AdvisorPanel />} />
      <Route path="/settings" element={<RoleSwitch />} />
      {/* Add other routes here */}
    </Routes>
  );
}
