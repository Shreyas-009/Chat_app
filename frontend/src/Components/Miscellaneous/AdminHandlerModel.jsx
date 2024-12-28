import React from "react";

const AdminHandlerModel = ({
  setSelectedNewAdmin,
  selectedNewAdmin,
  SelectedChat,
  loading,
  handleAdminTransfer,
  user,
  setShowAdminTransfer,
}) => {
  return (
    <div
      className="relative w-full max-w-md text-white bg-zinc-800 p-5 rounded-xl"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex flex-col gap-4 w-full">
        <h2 className="text-xl text-purple-400 font-semibold">
          Select New Admin
        </h2>
        <p className="text-sm text-zinc-400">
          You must choose a new admin before leaving the group
        </p>
        <div className="flex flex-col gap-2">
          {SelectedChat.users
            .filter((u) => u._id !== user._id) // Exclude current user
            .map((u) => (
              <div
                key={u._id}
                onClick={() => setSelectedNewAdmin(u)}
                className={`flex gap-2 p-2 rounded-lg cursor-pointer ${
                  selectedNewAdmin?._id === u._id
                    ? "bg-purple-600"
                    : "bg-zinc-700 hover:bg-purple-500/20"
                }`}
              >
                <img
                  src={u.picture}
                  alt=""
                  className="rounded-full h-8 w-8 bg-zinc-900"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">{u.name}</span>
                  <span className="text-xs text-zinc-400">{u.email}</span>
                </div>
              </div>
            ))}
        </div>
        <div className="flex gap-2 justify-end mt-4">
          <button
            className="px-4 py-2 rounded-md bg-zinc-600 hover:bg-zinc-700"
            onClick={() => setShowAdminTransfer(false)}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-md bg-purple-600 hover:bg-purple-700"
            onClick={handleAdminTransfer}
            disabled={!selectedNewAdmin || loading}
          >
            {loading ? "Transferring..." : "Transfer & Leave"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminHandlerModel;
