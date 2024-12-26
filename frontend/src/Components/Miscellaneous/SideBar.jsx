import React, { useContext, useEffect, useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import axios from "axios";
import SearchModal from "./SearchModal";
import { getSender } from "../Config/ChatLogics";

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
        alert("please enter something to search");
      }
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

      const { data } = await axios.post(
        `https://chat-app-ng66.onrender.com/api/chat`,
        { userId },
        config
      );

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
       <div className="flex justify-between w-full bg-zinc-800 p-2 relative">
         <div
           onClick={() => setOpenSearch(!OpenSearch)}
           className="flex items-center space-x-2 px-3 bg-zinc-700/50 hover:bg-purple-500/20 text-zinc-200 hover:text-purple-300 rounded-md transition-all duration-200 cursor-pointer border border-zinc-700 group"
         >
           <i className="ri-search-2-line text-lg group-hover:text-purple-400"></i>
           <input
             className="bg-transparent px-3 outline-none hidden md:flex placeholder-zinc-400 text-sm cursor-pointer"
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
           <div className="relative">
             <button
               className="relative px-2 py-1 rounded-full hover:bg-purple-500 hover:text-white transition-colors duration-200"
               onClick={() => setIsNotificationOpen(!isNotificationOpen)}
             >
               <i className="ri-notification-4-fill text-xl"></i>
               {notifications.length > 0 && (
                 <span className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs px-1.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full transform scale-100 transition-transform duration-200">
                   {notifications.length}
                 </span>
               )}
             </button>

             {isNotificationOpen && (
               <div className="absolute right-0 top-12 w-80 bg-zinc-800 rounded-lg shadow-lg shadow-purple-500/10 border-2 border-zinc-800 overflow-hidden z-50">
                 <div className="p-3 bg-zinc-700 border-b border-zinc-600">
                   <h3 className="text-zinc-100 font-medium">Notifications</h3>
                 </div>
                 <div className="max-h-96 overflow-y-auto">
                   {notifications.length === 0 ? (
                     <div className="p-4 text-center">
                       <i className="ri-notification-off-line text-2xl text-zinc-400 mb-2"></i>
                       <p className="text-zinc-400 text-sm">
                         No new notifications
                       </p>
                     </div>
                   ) : (
                     <div className="p-2 space-y-2">
                       {notifications.map((notif) => (
                         <div
                           key={notif.id}
                           onClick={() => {
                             setSelectedChat(notif.chat);
                             setNotifications(
                               notifications.filter((n) => n !== notif)
                             );
                             setIsNotificationOpen(false);
                           }}
                           className="bg-zinc-700/50 hover:bg-purple-500/20 p-3 rounded-md cursor-pointer transition-all duration-200 group"
                         >
                           <div className="flex items-start space-x-3">
                             <div className="flex-shrink-0">
                               <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                                 <i className="ri-message-3-line text-white"></i>
                               </div>
                             </div>
                             <div className="flex-1 min-w-0">
                               <p className="text-sm font-medium text-zinc-100 group-hover:text-purple-300">
                                 {notif.chat.isGroupChat
                                   ? `New message in ${notif.chat.chatName}`
                                   : `New message from ${getSender(
                                       user,
                                       notif.chat.users
                                     )}`}
                               </p>
                               <p className="text-xs text-zinc-400 mt-1">
                                 Click to view conversation
                               </p>
                             </div>
                           </div>
                         </div>
                       ))}
                     </div>
                   )}
                 </div>
               </div>
             )}
           </div>

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
               <div className="absolute right-0 mt-3 w-48 bg-zinc-800 rounded-md shadow-lg shadow-purple-500/20 p-1 flex flex-col gap-1 ">
                 <div
                   onClick={() => {
                     setOpenProfile(!openProfile);
                     setIsOpen(!isOpen);
                   }}
                   className="px-4 py-2 text-sm text-zinc-200 bg-zinc-700 
                  hover:bg-purple-600 hover:text-white cursor-pointer rounded-md transition-colors duration-200"
                 >
                   {user.name}
                 </div>
                 <div
                   onClick={handleLogout}
                   className="px-4 py-2 text-sm text-zinc-200 bg-zinc-700 hover:bg-red-500 hover:text-white cursor-pointer rounded-md transition-colors duration-200"
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
