import React, { useState } from "react";
import { useForm } from "react-hook-form";
import "remixicon/fonts/remixicon.css";


const HomePage = () => {
  const [flag, setFlag] = useState(true);
  const [login_pass, setLogin_pass] = useState(true);
  const [signUp_pass, setSignUp_pass] = useState(true);
  const [signUp_c_pass, setSignUp_c_pass] = useState(true);

  const { register, handleSubmit, reset, formState, watch } = useForm();

  // formState hives error messages
  const { errors } = formState;

  // handle submit for login form
  const handleLogin = (data) => {
    reset();
    console.log(data);
    console.log(data.email);
    console.log(data.password);
  };

  // handle submit  for signup form
  const handleSignUp = (data) => {
    reset();
    console.log(data);
    console.log(data.email);
    console.log(data.password);
    console.log(data.confirm_password);
    console.log(data.profileImage);
  };
  // toggles for switch in between ligin and sign up
  const handleToggle = () => {
    setFlag(!flag);
  };

  // toggles for switch hide and show password functionality (login)
  const handleLogin_pass = () => {
    setLogin_pass(!login_pass);
  };

  // toggles for switch hide and show password functionality (signup password)
  const handleSignUp_pass = () => {
    setSignUp_pass(!signUp_pass);
  };

  // toggles for switch hide and show password functionality (signup confirm password)
  const handleSignUp_c_pass = () => {
    setSignUp_c_pass(!signUp_c_pass);
  };
//fetching value of password to create validation on signup confirm password
  const password = watch("password");

  return (
    <div className="flex justify-center items-center w-full min-h-screen bg-zinc-800">
      {/* form container */}

      <div className="Form_container flex overflow-hidden w-3/5 bg-white rounded-2xl h-[80%]">
        {/* form image left container  */}

        <div className="left_container w-1/2 bg-purple-500 ">
          <img
            className="h-full object-contain"
            src="\src\assets\Register.jpg"
            alt=""
          />
        </div>

        <div className="right-page flex flex-col gap-10 w-1/2 bg-zinc-100 p-10">
          <div className="option flex gap-5 p-1">
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

          {flag ? (
            //login form
            <form
              onSubmit={handleSubmit(handleLogin)}
              className="flex flex-col gap-4"
              noValidate
            >
              <label className="text-zinc-500 text-xl" htmlFor="email">
                Email
              </label>
              <div className="flex flex-col">
                <input
                  className=" p-4 rounded-xl outline-none text-zinc-600"
                  type="email"
                  {...register("email", {
                    required: {
                      value: true,
                      message: "Please enter email",
                    },
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  placeholder="Emailid@gmail.com"
                />
                <span className="text-red-500">{errors.email?.message}</span>
              </div>

              <label className="text-zinc-500 text-xl" htmlFor="password">
                Password
              </label>
              <div className="flex flex-col">
                <div className="flex justify-between p-4 bg-white rounded-xl">
                  <input
                    className="flex-1  outline-none text-zinc-600"
                    type={login_pass ? "text" : "password"}
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
                    onClick={handleLogin_pass}
                  >
                    {login_pass ? (
                      <i className="ri-eye-off-line text-purple-500" />
                    ) : (
                      <i className="ri-eye-line text-purple-500" />
                    )}
                  </button>
                </div>
                <span className="text-red-500">{errors.password?.message}</span>
              </div>
              <button
                type="submit"
                className="p-4 outline-none text-white bg-purple-500 rounded-xl"
              >
                Login
              </button>
              <button
                type="submit"
                className="p-4 outline-none text-purple-700 border border-purple-700 rounded-xl"
              >
                Login As Guest User
              </button>
            </form>
          ) : (
            //signup form
            <form
              onSubmit={handleSubmit(handleSignUp)}
              className="flex flex-col gap-4"
              noValidate
            >
              <label className="text-zinc-500 text-xl" htmlFor="email">
                Email
              </label>
              <div className="flex flex-col">
                <input
                  className=" p-4 rounded-xl outline-none text-zinc-600"
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

              <label className="text-zinc-500 text-xl" htmlFor="password">
                Password
              </label>
              <div className="flex flex-col">
                <div className="flex justify-between p-4 bg-white rounded-xl">
                  <input
                    className="flex-1  outline-none text-zinc-600"
                    type={signUp_pass ? "text" : "password"}
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
                    onClick={handleSignUp_pass}
                  >
                    {signUp_pass ? (
                      <i className="ri-eye-off-line text-purple-500" />
                    ) : (
                      <i className="ri-eye-line text-purple-500" />
                    )}
                  </button>
                </div>
                <span className="text-red-500">{errors.password?.message}</span>
              </div>

              <label
                className="text-zinc-500 text-xl"
                htmlFor="confirm_password"
              >
                Confirm Password
              </label>
              <div className="flex flex-col">
                <div className="flex justify-between p-4 bg-white rounded-xl">
                  <input
                    className="flex-1  outline-none text-zinc-600"
                    type={signUp_c_pass ? "text" : "password"}
                    {...register("confirm_password", {
                      required: {
                        value: true,
                        message: "Please enter your confirm password",
                      },
                      validate: (fieldValue) => {
                        return (
                          fieldValue === password || "Passwords do not match"
                        );
                      },
                    })}
                    placeholder="Confirm password"
                  />

                  <button
                    type="button"
                    className="outline-none"
                    onClick={handleSignUp_c_pass}
                  >
                    {signUp_c_pass ? (
                      <i className="ri-eye-off-line text-purple-500" />
                    ) : (
                      <i className="ri-eye-line text-purple-500" />
                    )}
                  </button>
                </div>
                <span className="text-red-500">
                  {errors.confirm_password?.message}
                </span>
              </div>

              <input
                className="p-2 border border-gray-300 bg-white rounded-xl outline-none w-full cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 file:cursor-pointer"
                type="file"
                {...register("profileImage")}
              />

              <button
                type="submit"
                className="p-4 outline-none text-white bg-purple-500 rounded-xl"
              >
                Sign Up
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
