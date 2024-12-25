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

  const handleLogin = async (data) => {
    const { email, password } = data;
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const res = await axios.post(
        "http://localhost:8080/api/user/login",
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
    }
  };

  const handleGuestLogin = () => {
    setValue("email", "Guest@gmail.com");
    setValue("password", "guest123");
  };

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
        className="p-2 md:p-4 outline-none text-white bg-purple-500 rounded-xl"
      >
        Login
      </button>
      <button
        type="button"
        onClick={handleGuestLogin}
        className="p-2 md:p-4 outline-none text-purple-700 border border-purple-700 rounded-xl"
      >
        Login As Guest User
      </button>
    </form>
  );
};

export default Login;
