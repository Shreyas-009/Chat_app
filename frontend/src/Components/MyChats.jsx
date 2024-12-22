import React, { useEffect, useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import axios from "axios";
import { getSender } from "./Config/ChatLogics";
import GroupChatModel from "./Miscellaneous/GroupChatModel";

const MyChats = ({ reload }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { user, SelectedChat, setSelectedChat, chats, setChats } = ChatState();
  const [isGropuchatOpen, setIsGropuchatOpen] = useState(false);

  console.log(user);

  const fetchChat = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.get(`/api/chat`, config);
      setChats(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChat();
  }, [reload]);

  return (
    <div
      className={`${
        SelectedChat ? "hidden md:block" : "w-full"
      }  md:w-1/3 bg-zinc-800 rounded-xl overflow-hidden`}
    >
      <div className="bg-zinc-900 w-full flex justify-between items-center p-3">
        <h1 className="text-3xl text-white font-semibold">Chats</h1>
        <button
          className="p-2 rounded-lg text-white bg-purple-600 hover:bg-purple-700 text-center font-semibold text-md transition-colors duration-200 flex items-center gap-2"
          onClick={() => setIsGropuchatOpen(!isGropuchatOpen)}
        >
          Create Group
          <i className="ri-add-line"></i>
        </button>
        {isGropuchatOpen && (
          <GroupChatModel setIsGropuchatOpen={setIsGropuchatOpen} />
        )}
      </div>
      <div className="p-3 flex flex-col gap-2">
        {chats &&
          chats.map((chat) =>
            chat.isGroupChat ? (
              <div
                key={chat._id}
                className={`flex gap-3 hover:bg-purple-500/20 p-3 rounded-lg items-center cursor-pointer transition-colors duration-200 ${
                  SelectedChat === chat ? "bg-purple-600" : "bg-zinc-700/50"
                }`}
                onClick={() => setSelectedChat(chat)}
              >
                <div className="rounded-full h-9 w-9 bg-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                  {chat.chatName[0].toUpperCase()}
                </div>
                <div className="flex flex-col text-xs">
                  <h2 className="text-sm text-white font-semibold">
                    {chat.chatName}
                  </h2>
                  <span className="text-zinc-300">
                    {chat.users.length} Members
                  </span>
                </div>
              </div>
            ) : (
              <div
                key={chat._id}
                className={`flex gap-3 hover:bg-purple-500/20 p-3 rounded-lg items-center cursor-pointer transition-colors duration-200 ${
                  SelectedChat === chat ? "bg-purple-600" : "bg-zinc-700/50"
                }`}
                onClick={() => setSelectedChat(chat)}
              >
                <img
                  src={
                    chat.users[1].name === user.name
                      ? chat.users[0].picture
                      : chat.users[1].picture
                  }
                  alt=""
                  className="rounded-full h-9 w-9 bg-zinc-900 object-cover"
                />
                <div className="flex flex-col text-xs">
                  <h2 className="text-sm text-white font-semibold">
                    {chat.users[1].name === user.name
                      ? chat.users[0].name
                      : chat.users[1].name}
                  </h2>
                  <span className="text-zinc-300">
                    Email:{" "}
                    {chat.users[1].name === user.name
                      ? chat.users[0].email
                      : chat.users[1].email}
                  </span>
                </div>
              </div>
            )
          )}
      </div>
    </div>
  );
};

export default MyChats;
