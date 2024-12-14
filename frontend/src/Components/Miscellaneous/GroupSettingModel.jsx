import React, { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import axios from "axios";

const GroupSettingModel = ({ setIsGropuchatOpen ,reload , setReload }) => {
  const [groupName, setGroupName] = useState("");
  const [usersToAdd, setUsersToAdd] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState([]);
  const [searchResult, setSearchResult] = useState([]);

  const { user, chats, setChats } = ChatState();

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
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setSearchResult(data);
      setLoading(false);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleAddUser = (user) => {
    if (usersToAdd.includes(user)) {
      return;
    }
    setUsersToAdd([...usersToAdd, user]);
    setSearch("");
  };

  const handleSubmit = async () => {
    if (!groupName || usersToAdd.length === 0) {
      alert("Please provide a group name and add at least one user!");
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

      const { data } = await axios.post(
        "http://localhost:8080/api/chat/group",
        {
          name: groupName,
          users: JSON.stringify(usersToAdd.map((user) => user._id)),
        },
        config
      );

      setChats([data, ...chats]); // Update the chat list with the new group
      setIsGropuchatOpen(false); // Close the modal
      setLoading(false);
    } catch (error) {
      console.error("Error creating group chat:", error.message);
      alert("Failed to create the group chat. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center w-full"
      onClick={() => setIsGropuchatOpen(false)}
    >
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

          <div className="flex flex-col gap-3 w-full">
            <div className="flex gap-3 w-full">
              <input
                className="p-3 rounded-md border-[1px] border-zinc-600 bg-zinc-700 text-white placeholder-zinc-400 flex-1 gap-1"
                type="text"
                placeholder="Update Group Name"
                onChange={(e) => setGroupName(e.target.value)}
              />
              <button className="bg-green-600 text-white rounded-md px-3 py-1 hover:bg-green-700">
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
            onClick={handleSubmit}
          >
            Leave Group
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupSettingModel;
