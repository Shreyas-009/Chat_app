import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState, setValue } = useForm();
  const { errors } = formState;
  const [loginPassVisible, setLoginPassVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (data) => {
    const { email, password } = data;
    setLoading(true);

    try {
      toast(
        "Connecting to server... This might take a moment if the server is on cold start.",
        {
          icon: "⏳",
          duration: 5000,
        }
      );

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const res = await axios.post(
        "https://chat-app-ng66.onrender.com/api/user/login",
        {
          email: email,
          password: password,
        },
        config
      );

      localStorage.setItem("userInfo", JSON.stringify(res.data));
      setValue("email", "");
      setValue("password", "");

      navigate("/chat");
      toast.success("Login Successful");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error("Invalid email or password");
      } else {
        toast.error("An error occurred during login. Please try again.");
      }
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // const handleGuestLogin = () => {
  //   setValue("email", "Guest@gmail.com");
  //   setValue("password", "guest123");
  // };

  return (
    <form
      onSubmit={handleSubmit(handleLogin)}
      className="flex flex-col gap-3 md:gap-4"
      noValidate
    >
      <label className="text-zinc-500 md:text-xl" htmlFor="email">
        Email
      </label>
      <div className="flex flex-col">
        <input
          autoComplete="true"
          id="email"
          className="p-2 md:p-4 rounded-xl outline-none text-zinc-600"
          type="email"
          {...register("email", {
            required: { value: true, message: "Please enter email" },
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          })}
          placeholder="Emailid@gmail.com"
        />
        <span className="text-red-500">{errors.email?.message}</span>
      </div>

      <label className="text-zinc-500 md:text-xl" htmlFor="password">
        Password
      </label>
      <div className="flex flex-col">
        <div className="flex justify-between p-2 md:p-4 bg-white rounded-xl">
          <input
            id="password"
            className="flex-1 w-16 outline-none text-zinc-600"
            type={loginPassVisible ? "text" : "password"}
            {...register("password", {
              required: {
                value: true,
                message: "Please enter your password",
              },
            })}
            placeholder="Password"
          />
          <button
            type="button"
            className="outline-none"
            onClick={() => setLoginPassVisible(!loginPassVisible)}
          >
            {loginPassVisible ? (
              <i className="ri-eye-line text-purple-500" />
            ) : (
              <i className="ri-eye-off-line text-purple-500" />
            )}
          </button>
        </div>
        <span className="text-red-500">{errors.password?.message}</span>
      </div>
      <button
        type="submit"
        className="p-2 md:p-4 outline-none text-white bg-purple-500 rounded-xl flex items-center justify-center"
        disabled={loading}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Logging in...
          </>
        ) : (
          "Login"
        )}
      </button>
      {/* <button
        type="button"
        // onClick={handleGuestLogin}
        className="p-2 md:p-4 outline-none text-purple-700 border border-purple-700 rounded-xl"
        disabled
      >
        Login As Guest User
      </button> */}
      <button
        type="button"
        className="relative p-2 md:p-4 outline-none text-gray-400 border border-gray-400 rounded-xl cursor-not-allowed group"
        disabled
      >
        <span className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-700 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
          Temporarily unavailable
        </span>
        <div className="flex items-center justify-center gap-2">
          <i className="ri-user-line" />
          <span>Login As Guest User</span>
        </div>
      </button>
    </form>
  );
};

export default Login;
