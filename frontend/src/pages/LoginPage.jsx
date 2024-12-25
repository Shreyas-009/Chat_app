import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../Components/Authenticate/Login";
import SignUp from "../Components/Authenticate/Signup";
import "remixicon/fonts/remixicon.css";

const LoginPage = () => {
  const [flag, setFlag] = useState(false);
  const navigate = useNavigate();

  const handleToggle = () => {
    setFlag(!flag);
  };

  useEffect(() => {
    if (localStorage.getItem("userInfo")) {
      navigate("/chat");
    }
  },[navigate]);

  return (
    <div className="flex justify-center sm:items-center w-full min-h-screen bg-zinc-800 p-5 md:py-0">
      <div className="Form_container flex flex-col md:flex-row overflow-hidden w-6/6 sm:w-3/5 md:w-5/6 lg:w-3/5 bg-white rounded-2xl h-[80%]">
        <div className="left_container md:w-1/2 bg-purple-500">
          <img
            className="h-full object-contain"
            src="\src\assets\Register.jpg"
            alt=""
          />
        </div>

        <div className="right-page flex flex-col justify-center gap-5 md:w-1/2 bg-zinc-100 p-6 md:p-7">
          <div className="option text-sm md:text-base flex gap-5 p-1">
            <button
              type="button"
              onClick={handleToggle}
              className={`p-2 flex-1 ${
                flag ? "bg-purple-300 text-purple-800" : "bg-white text-black"
              } rounded-full outline-none`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={handleToggle}
              className={`p-2 flex-1 ${
                flag ? "bg-white text-black" : "bg-purple-300 text-purple-800"
              } rounded-full outline-none`}
            >
              Sign Up
            </button>
          </div>

          {flag ? <Login /> : <SignUp />}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
