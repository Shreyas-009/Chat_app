import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const SignUp = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState, watch } = useForm();
  const { errors } = formState;
  const password = watch("password");
  const [signUpPassVisible, setSignUpPassVisible] = useState(false);
  const [signUpConfirmPassVisible, setSignUpConfirmPassVisible] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);

  const uploadImage = async () => {
    if (!image) {
      return null;
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
        toast.success("Image uploaded successfully.");
        return data.url;
      } else {
        throw new Error("Failed to upload image.");
      }
    } catch (err) {
      console.error("Error uploading image to Cloudinary:", err);
      toast.error("Failed to upload image. Proceeding without image.");
      return null;
    }
  };

  const registerUser = async (imageUrl, data) => {
    const { name, email, password } = data;

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const userRes = await axios.post(
        "https://chat-app-ng66.onrender.com/api/user/",
        {
          name: name,
          email: email,
          password: password,
          picture: imageUrl,
        },
        config
      );

      localStorage.setItem("userInfo", JSON.stringify(userRes.data));
      if (userRes.status === 201) {
        toast.success("Signup Successful");
        navigate("/chat");
      } else {
        toast.error("Signup failed. Please try again.");
      }
    } catch (error) {
      //   console.error("Error registering user:", error);
      //   toast.error("Failed to register. Please try again.");
      toast.error(error.response.data.message);
    }
  };

  const handleSignUp = async (data) => {
    setLoading(true);
    try {
      const imageUrl = await uploadImage();
      await registerUser(imageUrl, data);
    } catch (error) {
      //   console.error("Error during signup process:", error);
      //   toast.error("Failed to complete signup. Please try again.");
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  return (
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

      <label className="text-zinc-500 w-16 md:text-xl" htmlFor="password">
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
            onClick={() => setSignUpPassVisible(!signUpPassVisible)}
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

      <label className="text-zinc-500 md:text-xl" htmlFor="confirm_password">
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
            onClick={() =>
              setSignUpConfirmPassVisible(!signUpConfirmPassVisible)
            }
          >
            {signUpConfirmPassVisible ? (
              <i className="ri-eye-line text-purple-500" />
            ) : (
              <i className="ri-eye-off-line text-purple-500" />
            )}
          </button>
        </div>
        <span className="text-red-500">{errors.confirm_password?.message}</span>
      </div>

      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="p-2 border border-gray-300 bg-white rounded-xl outline-none w-full cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 file:cursor-pointer"
      />

      <button
        type="submit"
        className="p-2 md:p-4 outline-none text-white bg-purple-500 rounded-xl"
        disabled={loading}
      >
        {loading ? "Signing Up..." : "Sign Up"}
      </button>
    </form>
  );
};

export default SignUp;
