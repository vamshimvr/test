// src/App.jsx
import React from "react";
import { BrowserRouter } from "react-router-dom";
import RoutesList from "./RoutesList";

export default function App() {
  return (
    <BrowserRouter>
      <RoutesList />
    </BrowserRouter>
  );
}
