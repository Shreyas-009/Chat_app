import React, { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import AdminHandlerModel from "./AdminHandlerModel";

const GroupSettingModel = ({
  setIsGropuchatOpen,
  reload,
  setReload,
  fetchMessage,
}) => {
  const [groupName, setGroupName] = useState("");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState([]);
  const [searchResult, setSearchResult] = useState([]);

  const [showAdminTransfer, setShowAdminTransfer] = useState(false);
  const [selectedNewAdmin, setSelectedNewAdmin] = useState(null);

  const { user, chats, setChats, SelectedChat, setSelectedChat } = ChatState();

  const handleSearch = async (searchTerm) => {
    setSearch(searchTerm);
    if (search.length < 1) {
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `https://chat-app-ng66.onrender.com/api/user?search=${search}`,
        config
      );
      setSearchResult(data);
      setLoading(false);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handlRenameGroupChat = async () => {
    if (!groupName) return;

    try {
      setLoading(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      await axios.put(
        `https://chat-app-ng66.onrender.com/api/chat/rename`,
        {
          chatId: SelectedChat._id,
          chatName: groupName,
        },
        config
      );

      setSelectedChat("");
      setReload(!reload); // Reload the)
      setIsGropuchatOpen(false); // Close the modal
      setLoading(false);
      toast.success("group renamed");
    } catch (error) {
      console.error("Error renaming group chat:", error.message);
      toast.error("Failed to rename the group chat. Please try again.");
      setLoading(false);
    }
  };

  const handleLeaveGroup = async (user) => {
    // If admin is the only user left
    if (
      SelectedChat.groupAdmin._id === user._id &&
      SelectedChat.users.length === 1
    ) {
      try {
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };

        await axios.delete(
          `https://chat-app-ng66.onrender.com/api/chat/group/${SelectedChat._id}`,
          config
        );
        setSelectedChat(null);
        setIsGropuchatOpen(false);
        setReload(!reload);
        setLoading(false);
        toast.success("Group deleted");
      } catch (error) {
        toast.error("Failed to delete group");
        setLoading(false);
      }
      return;
    }

    // Existing admin transfer logic
    if (SelectedChat.groupAdmin._id === user._id) {
      setShowAdminTransfer(true);
      return;
    }

    handleRemoveUser(user);
  };

  const handleAddUser = async (user1) => {
    if (SelectedChat.users.find((u) => u._id === user1._id)) {
      toast("User is already in the group", {
        icon: "⚠️",
      });
      return;
    }
    if (SelectedChat.groupAdmin._id !== user._id) {
      toast("Only Admin can add users", {
        icon: "⚠️",
      });
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        `https://chat-app-ng66.onrender.com/api/chat/groupadd`,
        {
          chatId: SelectedChat._id,
          userId: user1._id,
        },
        config
      );
      setSelectedChat(data);
      setReload(!reload);
      setLoading(false);
      toast.success("user added to the group chat");
    } catch (error) {
      console.error("Error adding user to group chat:", error.message);
      toast.error("Failed to add user to the group chat. Please try again.");
      setLoading(false);
    }
  };

  const handleRemoveUser = async (user1) => {
    if (SelectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      toast("Only Admin can remove users", {
        icon: "⚠️",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `https://chat-app-ng66.onrender.com/api/chat/groupremove`,
        {
          chatId: SelectedChat._id,
          userId: user1._id,
        },
        config
      );

      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setReload(!reload);
      fetchMessage();
      setLoading(false);
      toast.success("user removed");
    } catch (error) {
      console.error("Error removing user from group chat:", error.message);
      toast.error(
        "Failed to remove user from the group chat. Please try again."
      );
      setLoading(false);
    }
  };

  // Update the group chat Admin
  const handleAdminTransfer = async () => {
    if (!selectedNewAdmin) {
      toast.error("Please select a new admin");
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      // First transfer admin rights
      const { data } = await axios.put(
        `https://chat-app-ng66.onrender.com/api/chat/changeadmin`,
        {
          chatId: SelectedChat._id,
          userId: selectedNewAdmin._id,
        },
        config
      );

      if (data) {
        // Then remove current user from group
        await axios.put(
          `https://chat-app-ng66.onrender.com/api/chat/groupremove`,
          {
            chatId: SelectedChat._id,
            userId: user._id,
          },
          config
        );

        setSelectedChat(null);
        setShowAdminTransfer(false);
        setSelectedNewAdmin(null);
        setIsGropuchatOpen(false);
        setReload(!reload);
        toast.success("Admin transferred and left group successfully");
      }

      setLoading(false);
    } catch (error) {
      console.error("Error transferring admin:", error.message);
      toast.error("Failed to transfer admin. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center w-full"
      onClick={() => setIsGropuchatOpen(false)}
    >
      {showAdminTransfer ? (
        <AdminHandlerModel
          setSelectedNewAdmin={setSelectedNewAdmin}
          selectedNewAdmin={selectedNewAdmin}
          SelectedChat={SelectedChat}
          loading={loading}
          handleAdminTransfer={handleAdminTransfer}
          user={user}
          setShowAdminTransfer={setShowAdminTransfer}
        />
      ) : (
        <div
          className="relative w-full max-w-md text-white bg-zinc-800 p-5 rounded-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => setIsGropuchatOpen(false)}
            className="absolute right-3 top-3 text-white rounded-md px-1 hover:bg-zinc-700"
          >
            <i className="ri-close-line text-xl"></i>
          </button>
          <div className="flex flex-col items-center gap-4 w-full">
            <h1 className="text-2xl font-semibold text-purple-400 mb-2">
              Group Setting
            </h1>

            {/* Admin Card - Fixed at top */}
            <div className="w-full flex flex-col items-center mb-2 border-b border-zinc-700 pb-2">
              <div className="flex items-center mb-1 self-start gap-2">
                <span className="bg-purple-500 text-white px-3 py-2 rounded-xl text-md font-medium">
                  Admin
                </span>
                <div className="flex items-center gap-2">
                  <img
                    src={
                      SelectedChat.groupAdmin.picture ||
                      "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
                    }
                    alt={SelectedChat.groupAdmin.name}
                    className="w-8 h-8 rounded-full object-cover bg-zinc-700"
                  />
                  <div>
                    <h3 className="text-white text-left text-sm font-medium">
                      {SelectedChat.groupAdmin.name}
                    </h3>
                    <p className="text-zinc-400 text-xs">
                      {SelectedChat.groupAdmin.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* User List - Scrollable with Admin first */}
            {SelectedChat.users.length > 0 && (
              <div className="w-full max-h-48 overflow-y-auto pr-1 mb-2 hide-scrollbar">
                <div className="flex flex-wrap gap-2 w-full">
                  {/* Sort users to show admin first */}
                  {SelectedChat.users
                    .sort((a, b) => {
                      if (a._id === SelectedChat.groupAdmin._id) return -1;
                      if (b._id === SelectedChat.groupAdmin._id) return 1;
                      return 0;
                    })
                    .map((u) => {
                      const isAdmin = u._id === SelectedChat.groupAdmin._id;
                      return (
                        <div
                          className={`flex items-center gap-2 ${
                            isAdmin ? "bg-purple-600/20" : u._id === user._id ? "bg-green-600/20" : "bg-zinc-700/40"
                          } px-2 py-1.5 rounded-md`}
                          key={u._id}
                        >
                          <img
                            src={
                              u.picture ||
                              "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
                            }
                            alt={u.name}
                            className="w-6 h-6 rounded-full object-cover bg-zinc-800"
                          />
                          <span className="text-sm text-white">{u.name === user.name ? "You" : u.name}</span>
                          {isAdmin && (
                            <span className="text-xs bg-purple-500 text-white px-2 py-0.5 rounded-full">
                              Admin
                            </span>
                          )}
                          {u._id !== user._id &&
                            u._id !== SelectedChat.groupAdmin._id &&
                            u._id !== SelectedChat.users._id && (
                            <button
                              onClick={() => handleRemoveUser(u)}
                              className="text-white/70 hover:text-white"
                            >
                              <i className="ri-close-line"></i>
                            </button>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Input Fields - Styled to match screenshot */}
            <div className="flex flex-col gap-3 w-full">
              <div className="flex gap-2 w-full">
                <input
                  className="flex-1 px-3 py-2 rounded-md bg-zinc-700 text-white placeholder-zinc-400 text-sm border border-zinc-600 focus:outline-none focus:border-purple-500"
                  type="text"
                  placeholder="Update Group Name"
                  onChange={(e) => setGroupName(e.target.value)}
                />
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-600 transition-all"
                  onClick={() => handlRenameGroupChat()}
                >
                  Update
                </button>
              </div>
              <input
                className="w-full px-3 py-2 rounded-md bg-zinc-700 text-white placeholder-zinc-400 text-sm border border-zinc-600 focus:outline-none focus:border-purple-500"
                type="text"
                placeholder="Search User to Add"
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>

            {/* Search Results - Styled to match screenshot */}
            {loading ? (
              <div className="w-full flex justify-center py-2">
                <p className="text-zinc-400 text-sm">Loading...</p>
              </div>
            ) : (
              searchResult.length > 0 && (
                <div className="flex flex-col gap-2 w-full max-h-48 overflow-y-auto hide-scrollbar">
                  {searchResult.slice(0, 4).map((user) => (
                    <div
                      onClick={() => handleAddUser(user)}
                      key={user._id}
                      className="flex items-center gap-3 bg-zinc-700/40 hover:bg-zinc-700 px-3 py-2 rounded-md cursor-pointer transition-all"
                    >
                      <img
                        src={
                          user.picture ||
                          "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
                        }
                        alt=""
                        className="w-8 h-8 rounded-full object-cover bg-zinc-800"
                      />
                      <div>
                        <h2 className="text-white text-sm font-medium">
                          {user.name}
                        </h2>
                        <p className="text-zinc-400 text-xs">{user.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}

            {/* Leave Group Button - Positioned at bottom */}
            <button
              className="w-fit px-5 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 text-sm font-medium mt-4 transition-all"
              onClick={() => handleLeaveGroup(user)}
            >
              Leave Group
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupSettingModel;
