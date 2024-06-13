import React from "react";
import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage";
import { Route, Routes } from "react-router-dom";

const Routing = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </>
  );
};

export default Routing;
