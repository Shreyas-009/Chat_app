import React from "react";
import LoginPage from "./pages/LoginPage";
import ChatPage from "./pages/ChatPage";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";

const Routing = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </>
  );
};

export default Routing;
