import React, { useContext, useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import axios from "axios";
import SearchModal from "./SearchModal";
import { getSender } from "../Config/ChatLogics";
import NotificationBadge, { Effect } from 'react-notification-badge';

const SideBar = ({ openProfile, setOpenProfile, reload, setReload }) => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const {
    user,
    SelectedChat,
    setSelectedChat,
    chats,
    setChats,
    notifications,
    setNotifications,
  } = ChatState();
  const [OpenSearch, setOpenSearch] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    window.location.href = "/";
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      if (!search) {
        alert("please enter somthing to search");
      }
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setSearchResult(data);
      setSearch("");
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(`/api/chat`, { userId }, config);

      setSearchResult([]);
      setSelectedChat(data);
      setLoadingChat(false);
      setReload(!reload);
      setIsOpen(false);
      setOpenSearch(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="flex justify-between w-full bg-zinc-800 p-2 relative ">
        <div
          onClick={() => setOpenSearch(!OpenSearch)}
          className="flex px-3 py-2 bg-zinc-800 hover:bg-zinc-200 hover:text-black rounded-md transition duration-300 ease-in-out "
        >
          <i className="ri-search-2-line"></i>
          <input
            className="bg-inherit px-3 outline-none hidden md:flex"
            type="text"
            placeholder="Search User"
            onClick={() => setOpenSearch(!OpenSearch)}
            readOnly
          />
        </div>

        {OpenSearch && (
          <SearchModal
            OpenSearch={OpenSearch}
            setOpenSearch={setOpenSearch}
            search={search}
            setSearch={setSearch}
            loading={loading}
            searchResult={searchResult}
            handleSearch={handleSearch}
            accessChat={accessChat}
          />
        )}

        <h1 className="text-xl">Shreyas ChatApp</h1>
        <div className="flex items-center space-x-4 px-2">
          <button
            className="relative px-2 py-1 rounded-full hover:bg-purple-500 hover:text-white"
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
          >
            <i className="ri-notification-4-fill h-6 w-6"></i>
            <NotificationBadge
              count={notifications.length}
              effect={Effect.SCALE}
            />
          </button>

          {isNotificationOpen && (
            <div className="absolute right-0 top-10 mt-2 w-64 bg-zinc-800 rounded-md shadow-lg p-2 z-50">
              {notifications.length === 0 ? (
                <p className="text-zinc-400 text-sm text-center">
                  No new notifications
                </p>
              ) : (
                notifications.map((notfi) => (
                  <div
                    onClick={() => {
                      setSelectedChat(notfi.chat);
                      setNotifications(
                        notifications.filter((n) => n !== notfi)
                      );
                      setIsNotificationOpen(false);
                    }}
                    key={notfi.id}
                    className="bg-zinc-700 p-2 rounded-md mb-1 cursor-pointer shadow-sm hover:bg-purple-500 hover:text-white transition"
                  >
                    <p className="text-zinc-200 text-sm">
                      {notfi.chat.isGroupChat
                        ? `New message in ${notfi.chat.chatName}`
                        : `New message from ${getSender(
                            user,
                            notfi.chat.users
                          )}`}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}

          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center focus:outline-none z-10"
            >
              <img
                src={
                  user.picture ? user.picture : "default_profile_picture.png"
                }
                alt={user.name}
                className="h-8 w-8 rounded-full object-cover"
              />
            </button>

            {isOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-zinc-700 rounded-md shadow-lg p-1 flex flex-col gap-1">
                <div
                  onClick={() => {
                    setOpenProfile(!openProfile);
                    setIsOpen(!isOpen);
                  }}
                  className="px-4 py-2 text-sm text-zinc-200 hover:bg-purple-600 hover:text-white cursor-pointer rounded-md transition-colors duration-200"
                >
                  {user.name}
                </div>
                <div
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm text-zinc-200 hover:bg-red-500 hover:text-white cursor-pointer rounded-md transition-colors duration-200"
                >
                  Logout
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SideBar;
