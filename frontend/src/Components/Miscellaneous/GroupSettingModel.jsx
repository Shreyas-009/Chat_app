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
  const [usersToAdd, setUsersToAdd] = useState([]);
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
    if (user1._id === user._id) {
      toast("Please select Leave group option", {
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

      await axios.put(
        `https://chat-app-ng66.onrender.com/api/chat/changeadmin`,
        {
          chatId: SelectedChat._id,
          userId: selectedNewAdmin._id,
        },
        config
      );

      // After admin transfer, proceed with leaving the group
      await handleRemoveUser(user);

      setShowAdminTransfer(false);
      setSelectedNewAdmin(null);
      setLoading(false);
      setReload(!reload);
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
          <div className="flex flex-col items-center gap-5 w-full">
            <h1 className="text-3xl font-semibold text-purple-400">
              Group Setting
            </h1>

            {SelectedChat.users.length > 0 && (
              <div className="flex gap-3 w-full overflow-x-scroll hideScrollbar">
                {SelectedChat.users.map((user) => {
                  return (
                    <div
                      className="flex gap-2 bg-zinc-700 p-2 items-center rounded-md"
                      key={user._id}
                    >
                      <h3 className="text-sm text-white font-semibold whitespace-nowrap">
                        {user.name}
                      </h3>
                      <button
                        onClick={() => handleRemoveUser(user)}
                        className="text-sm px-1 rounded-md bg-purple-500 hover:bg-purple-700 text-white"
                      >
                        <i className="ri-close-line"></i>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex flex-col gap-3 w-full">
              <div className="flex gap-3 w-full">
                <input
                  className="p-3 rounded-md border-[1px] border-zinc-600 bg-zinc-700 text-white placeholder-zinc-400 flex-1 gap-1"
                  type="text"
                  placeholder="Update Group Name"
                  onChange={(e) => setGroupName(e.target.value)}
                />
                <button
                  className="bg-green-600 text-white rounded-md px-3 py-1 hover:bg-green-700"
                  onClick={() => handlRenameGroupChat()}
                >
                  Update
                </button>
              </div>
              <input
                className="p-3 rounded-md border-[1px] border-zinc-600 bg-zinc-700 text-white placeholder-zinc-400"
                type="text"
                placeholder="Search User to Add"
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            {usersToAdd.length > 0 && (
              <div className="flex gap-3 w-full overflow-x-scroll hideScrollbar">
                {usersToAdd.map((user) => {
                  return (
                    <div
                      className="flex gap-2 bg-zinc-700 p-2 items-center rounded-md"
                      key={user.id}
                    >
                      <h3 className="text-sm text-white font-semibold whitespace-nowrap">
                        {user.name}
                      </h3>
                      <button
                        onClick={() =>
                          setUsersToAdd(
                            usersToAdd.filter((u) => u._id !== user._id)
                          )
                        }
                        className="text-sm px-1 rounded-md bg-purple-500 hover:bg-purple-700 text-white"
                      >
                        <i className="ri-close-line"></i>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
            {loading ? (
              <p className="text-zinc-400">Loading...</p>
            ) : (
              <div className="flex flex-col gap-3 w-full">
                {searchResult.slice(0, 4).map((user, index) => (
                  <div
                    onClick={() => handleAddUser(user)}
                    key={user._id}
                    className="flex gap-2 bg-zinc-700 hover:bg-purple-500 p-2 rounded-lg items-center cursor-pointer"
                  >
                    <img
                      src={user.picture}
                      alt=""
                      className="rounded-full h-9 w-9 bg-zinc-900"
                    />
                    <div className="flex flex-col text-xs">
                      <h2 className="text-sm text-white font-semibold">
                        {user.name}
                      </h2>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button
              className="w-fit py-2 px-4 text-white rounded-md self-end bg-red-600 hover:bg-red-700"
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
