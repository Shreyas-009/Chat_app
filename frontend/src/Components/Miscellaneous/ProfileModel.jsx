import React from "react";

const ProfileModel = ({ user, openProfile, setOpenProfile }) => {
  if (!user) {
    return <div>Loading...</div>;
  }

  if (!openProfile) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center"
      onClick={() => setOpenProfile(false)}
    >
      <div
        className="relative w-fit max-w-md text-white bg-zinc-800 p-6 rounded-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setOpenProfile(false)}
          className="absolute right-3 top-3 text-white rounded-md px-1 hover:bg-zinc-700"
        >
          <i className="ri-close-line text-xl"></i>
        </button>
        <div className="flex flex-col items-center gap-5">
          <h1 className="text-2xl font-bold text-purple-400">{user.name}</h1>
          <img
            src={user.picture ? user.picture : "default_profile_picture.png"}
            alt={user.name}
            className="h-36 w-36 rounded-full object-cover border border-zinc-700"
          />
          <div className="flex items-center gap-2">
            <span className="font-semibold text-zinc-300">Email:</span>
            <span className="text-zinc-400">{user.email}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModel;
