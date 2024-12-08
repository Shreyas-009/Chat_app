import React, { useContext, useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import axios from "axios";

const SideBar = ({ openProfile, setOpenProfile }) => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { user, SelectedChat, setSelectedChat, chats, setChats } = ChatState();
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
      console.log(data);

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
      // console.log(data);
      
      setSelectedChat(data);
      setLoadingChat(false);
      setIsOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="flex justify-between w-full bg-zinc-800 p-2 relative ">
        <div className="flex px-3 py-2 bg-zinc-800 hover:bg-zinc-200 hover:text-black rounded-md transition duration-300 ease-in-out ">
          <i
            className="ri-search-2-line"
            onClick={() => setOpenSearch(!OpenSearch)}
          ></i>
          <input
            className="bg-inherit px-3 outline-none hidden md:flex"
            type="text"
            placeholder="Search User"
            onClick={() => setOpenSearch(!OpenSearch)}
          />
        </div>

        {OpenSearch && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={() => setOpenSearch(!OpenSearch)}
          >
            <div
              className={`bg-zinc-800 text-white h-[100vh] absolute left-0 top-0 p-4 w-full sm:w-1/5 min-w-fit z-50`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex w-full justify-between pb-7">
                <h1 className="text-2xl ">Search Users</h1>
                <button
                  onClick={() => setOpenSearch(!OpenSearch)}
                  className="text-gray-200 hover:bg-zinc-200 rounded-md px-1 hover:text-black"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>
              <div className="flex gap-2">
                <input
                  className="bg-zinc-900 p-3 outline-none md:flex rounded-lg flex-1"
                  type="text"
                  placeholder="Search User"
                  value={search}
                  onInput={(e) => setSearch(e.target.value)}
                />
                <button
                  className="p-3 rounded-lg text-zinc-100 bg-purple-500 hover:bg-purple-700 font-semibold"
                  onClick={() => handleSearch()}
                >
                  Search
                </button>
              </div>
              <div className="py-5 flex flex-col gap-2">
                {loading ? (
                  // Skeleton Loader
                  <>
                    <div className="flex gap-2 bg-zinc-600 p-2 rounded-lg items-center animate-pulse">
                      <div className="rounded-full h-9 w-9 bg-gray-500"></div>
                      <div className="flex flex-col gap-1">
                        <div className="h-4 bg-gray-500 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-500 rounded w-1/2"></div>
                      </div>
                    </div>
                    <div className="flex gap-2 bg-zinc-600 p-2 rounded-lg items-center animate-pulse">
                      <div className="rounded-full h-9 w-9 bg-gray-500"></div>
                      <div className="flex flex-col gap-1">
                        <div className="h-4 bg-gray-500 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-500 rounded w-1/2"></div>
                      </div>
                    </div>
                    <div className="flex gap-2 bg-zinc-600 p-2 rounded-lg items-center animate-pulse">
                      <div className="rounded-full h-9 w-9 bg-gray-500"></div>
                      <div className="flex flex-col gap-1">
                        <div className="h-4 bg-gray-500 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-500 rounded w-1/2"></div>
                      </div>
                    </div>
                    <div className="flex gap-2 bg-zinc-600 p-2 rounded-lg items-center animate-pulse">
                      <div className="rounded-full h-9 w-9 bg-gray-500"></div>
                      <div className="flex flex-col gap-1">
                        <div className="h-4 bg-gray-500 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-500 rounded w-1/2"></div>
                      </div>
                    </div>
                    <div className="flex gap-2 bg-zinc-600 p-2 rounded-lg items-center animate-pulse">
                      <div className="rounded-full h-9 w-9 bg-gray-500"></div>
                      <div className="flex flex-col gap-1">
                        <div className="h-4 bg-gray-500 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-500 rounded w-1/2"></div>
                      </div>
                    </div>
                    <div className="flex gap-2 bg-zinc-600 p-2 rounded-lg items-center animate-pulse">
                      <div className="rounded-full h-9 w-9 bg-gray-500"></div>
                      <div className="flex flex-col gap-1">
                        <div className="h-4 bg-gray-500 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-500 rounded w-1/2"></div>
                      </div>
                    </div>
                    <div className="flex gap-2 bg-zinc-600 p-2 rounded-lg items-center animate-pulse">
                      <div className="rounded-full h-9 w-9 bg-gray-500"></div>
                      <div className="flex flex-col gap-1">
                        <div className="h-4 bg-gray-500 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-500 rounded w-1/2"></div>
                      </div>
                    </div>
                    <div className="flex gap-2 bg-zinc-600 p-2 rounded-lg items-center animate-pulse">
                      <div className="rounded-full h-9 w-9 bg-gray-500"></div>
                      <div className="flex flex-col gap-1">
                        <div className="h-4 bg-gray-500 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-500 rounded w-1/2"></div>
                      </div>
                    </div>
                  </>
                ) : (
                  searchResult.map((user) => (
                    <div
                      key={user._id}
                      className="flex gap-2 bg-zinc-600 hover:bg-purple-400 p-2 rounded-lg items-center"
                      onClick={() => accessChat(user._id)}
                    >
                      <img
                        src={user.picture}
                        alt=""
                        className="rounded-full h-9 w-9 bg-zinc-900"
                      />
                      <div className="flex flex-col text-xs">
                        <h2 className="text-sm font-semibold">{user.name}</h2>
                        <span>Status: Online</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        <h1 className="text-xl">Shreyas ChatApp</h1>
        <div className="flex items-center space-x-4 px-2">
          <button className="px-2 py-1 rounded-full hover:bg-gray-200 hover:text-gray-600">
            <i className="ri-notification-4-fill h-6 w-6"></i>
          </button>

          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center focus:outline-none z-10"
            >
              <img
                src={user.picture ? user.picture : 'default_profile_picture.png'}
                alt={user.name}
                className="h-8 w-8 rounded-full object-cover"
              />
            </button>

            {isOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-zinc-100 rounded-md shadow-lg p-1 flex flex-col gap-1">
                <div
                  onClick={() => {
                    setOpenProfile(!openProfile);
                    setIsOpen(!isOpen);
                  }}
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 cursor-pointer rounded-md"
                >
                  {user.name}
                </div>
                <div
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-red-400 hover:text-white cursor-pointer rounded-md"
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
