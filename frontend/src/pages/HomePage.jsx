import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { json, useNavigate } from "react-router-dom";
import "remixicon/fonts/remixicon.css";
import { toast } from "react-hot-toast";

const HomePage = () => {
  const [flag, setFlag] = useState(false);
  const [loginPassVisible, setLoginPassVisible] = useState(false);
  const [signUpPassVisible, setSignUpPassVisible] = useState(false);
  const [signUpConfirmPassVisible, setSignUpConfirmPassVisible] =
    useState(false);
  const [guestLogin, setGuestLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [image, setImage] = useState(null);

  const navigate = useNavigate();

  const { register, handleSubmit, reset, formState, watch, setValue } =
    useForm();

  const { errors } = formState;

  // handle submit for login form
  const handleLogin = async (data) => {
    reset();
    const { email, password } = data;
    setLoading(true);
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

      if (res.status === 200) {
        setLoading(false);
        navigate("/chat");
        toast.success("Login Successful");
      } else {
        toast.error("Invalid email or password");
      }
    } catch (error) {
      toast.error("An error occurred during login. Please try again.");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // handle submit for signup form

  // uploading image to cloudinary
  const uploadImage = async () => {
    if (!image) {
      toast.error("Please select an image to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "chat_app");
    formData.append("cloud_name", "dqcovwxpe");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dqcovwxpe/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      if (data.url) {
        setImageUrl(data.url);
        toast.success("Image uploaded successfully.");
        return data.url; // Return image URL for further use
      } else {
        throw new Error("Failed to upload image.");
      }
    } catch (err) {
      console.error("Error uploading image to Cloudinary:", err);
      toast.error("Failed to upload image. Please try again.");
      throw err; // Throw error to handle in the calling function
    }
  };

  //register User
  const registerUser = async (imageUrl, data) => {
    const { name, email, password } = data;

    setLoading(true);
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const userRes = await axios.post(
        "http://localhost:8080/api/user/",
        {
          name: name,
          email: email,
          password: password,
          picture: imageUrl,
        },
        config
      );

      localStorage.setItem("userInfo", JSON.stringify(userRes.data));
      setLoading(false);
      if (userRes.status === 201) {
        toast.success("Signup Successful");
        navigate("/chat");
      } else {
        toast.error("Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Error registering user:", error);
      toast.error("Failed to register. Please try again.");
      setLoading(false);
    }
  };

  const handleSignUp = async (data) => {
    reset();
    setLoading(true);

    try {
      const imageUrl = await uploadImage();
      if (imageUrl) {
        await registerUser(imageUrl, data);
      }
    } catch (error) {
      console.error("Error during signup process:", error);
      toast.error("Failed to complete signup. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // toggles for switching between login and sign up
  const handleToggle = () => {
    setFlag(!flag);
    reset();
    setGuestLogin(false);
  };

  // toggles for show/hide password functionality
  const handleLoginPassVisible = () => {
    setLoginPassVisible(!loginPassVisible);
  };

  const handleSignUpPassVisible = () => {
    setSignUpPassVisible(!signUpPassVisible);
  };

  const handleSignUpConfirmPassVisible = () => {
    setSignUpConfirmPassVisible(!signUpConfirmPassVisible);
  };

  const password = watch("password");

  const handleGuestLogin = () => {
    setValue("email", "Guest@gmail.com");
    setValue("password", "guest123");
    setGuestLogin(true);
  };

  //setting image on change
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

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

          {flag ? (
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
                    onClick={handleLoginPassVisible}
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
                {loading ? "Loading..." : "Login"}
              </button>
              <button
                type="button"
                onClick={handleGuestLogin}
                className="p-2 md:p-4 outline-none text-purple-700 border border-purple-700 rounded-xl"
              >
                Login As Guest User
              </button>
            </form>
          ) : (
            <form
              onSubmit={handleSubmit(handleSignUp)}
              className="flex flex-col gap-3"
              noValidate
            >
              <label className="text-zinc-500 md:text-xl" htmlFor="name">
                Name
              </label>
              <div className="flex flex-col">
                <input
                  id="name"
                  autoComplete="true"
                  className="p-2 md:p-4 rounded-xl outline-none text-zinc-600"
                  type="text"
                  {...register("name", {
                    required: { value: true, message: "Please enter name" },
                  })}
                  placeholder="john doe"
                />
                <span className="text-red-500">{errors.name?.message}</span>
              </div>

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

              <label
                className="text-zinc-500 w-16 md:text-xl"
                htmlFor="password"
              >
                Password
              </label>
              <div className="flex flex-col">
                <div className="flex justify-between p-2 md:p-4 bg-white rounded-xl">
                  <input
                    id="password"
                    className="flex-1 w-16 outline-none text-zinc-600"
                    type={signUpPassVisible ? "text" : "password"}
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
                    onClick={handleSignUpPassVisible}
                  >
                    {signUpPassVisible ? (
                      <i className="ri-eye-line text-purple-500" />
                    ) : (
                      <i className="ri-eye-off-line text-purple-500" />
                    )}
                  </button>
                </div>
                <span className="text-red-500">{errors.password?.message}</span>
              </div>

              <label
                className="text-zinc-500 md:text-xl"
                htmlFor="confirm_password"
              >
                Confirm Password
              </label>
              <div className="flex flex-col">
                <div className="flex justify-between p-2 md:p-4 bg-white rounded-xl">
                  <input
                    id="confirm_password"
                    className="flex-1 w-16 outline-none text-zinc-600"
                    type={signUpConfirmPassVisible ? "text" : "password"}
                    {...register("confirm_password", {
                      required: {
                        value: true,
                        message: "Please enter your confirm password",
                      },
                      validate: (fieldValue) =>
                        fieldValue === password || "Passwords do not match",
                    })}
                    placeholder="Confirm password"
                  />
                  <button
                    type="button"
                    className="outline-none"
                    onClick={handleSignUpConfirmPassVisible}
                  >
                    {signUpConfirmPassVisible ? (
                      <i className="ri-eye-line text-purple-500" />
                    ) : (
                      <i className="ri-eye-off-line text-purple-500" />
                    )}
                  </button>
                </div>
                <span className="text-red-500">
                  {errors.confirm_password?.message}
                </span>
              </div>

              {/* <input
                className="p-2 border border-gray-300 bg-white rounded-xl outline-none w-full cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 file:cursor-pointer"
                type="file"
                {...register("profileImage", { required: false })}
              /> */}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="p-2 border border-gray-300 bg-white rounded-xl outline-none w-full cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 file:cursor-pointer"
              />

              <button
                type="submit"
                className="p-2 md:p-4 outline-none text-white bg-purple-500 rounded-xl"
              >
                {loading ? "Loading..." : "Sign Up"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
