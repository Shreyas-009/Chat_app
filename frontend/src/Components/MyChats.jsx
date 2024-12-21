import React, { useEffect, useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import axios from "axios";
import { getSender } from "./Config/ChatLogics";
import GroupChatModel from "./Miscellaneous/GroupChatModel";

const MyChats = ({ reload }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { user, SelectedChat, setSelectedChat, chats, setChats } = ChatState();
  const [isGropuchatOpen, setIsGropuchatOpen] = useState(false);

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
      }  md:w-1/3 bg-zinc-600 rounded-xl overflow-hidden `}
    >
      <div className="bg-zinc-800 w-full flex justify-between items-center p-2">
        <h1 className="text-3xl">Chats</h1>
        <button
          className="p-2  rounded-lg text-zinc-100 bg-purple-600 hover:bg-purple-700 text-center font-semibold text-md"
          onClick={() => setIsGropuchatOpen(!isGropuchatOpen)}
        >
          Create Group
          <i className="ri-add-line"></i>
        </button>
        {isGropuchatOpen && (
          <GroupChatModel setIsGropuchatOpen={setIsGropuchatOpen} />
        )}
      </div>
      <div className="p-2 flex flex-col gap-2">
        {chats &&
          chats.map((chat) =>
            chat.isGroupChat ? (
              <div
                key={chat._id}
                className={`flex gap-2 hover:bg-purple-400 p-2 rounded-lg items-center ${
                  SelectedChat === chat ? "bg-purple-600" : "bg-zinc-700"
                }`}
                onClick={() => setSelectedChat(chat)}
              >
                <div className="rounded-full h-9 w-9 bg-purple-500 flex items-center justify-center text-white font-bold text-lg">
                  {chat.chatName[0].toUpperCase()}
                </div>
                <div className="flex flex-col text-xs">
                  <h2 className="text-sm text-white font-semibold">
                    {chat.chatName}
                  </h2>
                  <span>{chat.users.length} Members</span>
                </div>
              </div>
            ) : (
              <div
                key={chat._id}
                className={`flex gap-2 hover:bg-purple-400 p-2 rounded-lg items-center ${
                  SelectedChat === chat ? "bg-purple-500" : "bg-zinc-700"
                }`}
                onClick={() => setSelectedChat(chat)}
              >
                <img
                  src={chat.users[1].picture}
                  alt=""
                  className="rounded-full h-9 w-9 bg-zinc-900"
                />
                <div className="flex flex-col text-xs">
                  <h2 className="text-sm text-white font-semibold">
                    {chat.users[1].name}
                  </h2>
                  <span>Email : {chat.users[1].email}</span>
                </div>
              </div>
            )
          )}
      </div>
    </div>
  );
};

export default MyChats;
