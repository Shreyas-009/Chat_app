import React, { useEffect, useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import axios from "axios";
import { getSender } from "./Config/ChatLogics";
import GroupChatModel from "./Miscellaneous/GroupChatModel";

const MyChats = () => {
  const [loggedUser, setLoggedUser] = useState();
  const { user, SelectedChat, setSelectedChat, chats, setChats } = ChatState();
  const [isGropuchatOpen, setIsGropuchatOpen] = useState(false);

  console.log(chats);

  const fetchChat = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.get(`/api/chat`, config);
      setChats(data);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const accessChat = async (userId) => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`/api/chat`, { userId }, config);
      setSelectedChat(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChat();
  }, []);

  console.log(user);
  console.log('chats' , chats);
  

  return (
    <div className="w-full md:w-1/3 bg-zinc-600 rounded-xl overflow-hidden">
      <div className="bg-zinc-800 w-full flex justify-between p-1  items-center">
        <h1 className="text-xl">Chats</h1>
        <button
          className="p-1 py-2 rounded-lg text-zinc-100 bg-purple-500 hover:bg-purple-700"
          onClick={() => setIsGropuchatOpen(!isGropuchatOpen)}
        >
          New Group Chat +
        </button>
        {isGropuchatOpen && (
          <GroupChatModel
            setIsGropuchatOpen={setIsGropuchatOpen}
          />
        )}
      </div>
      <div className="p-2 flex flex-col gap-2">
        {chats &&
          chats.map((chat) =>
            chat.isGroupChat ? (
              getSender(loggedUser, chat.users)
            ) : (
              <div
                key={chat._id}
                className="flex gap-2 bg-zinc-600 hover:bg-purple-400 p-2 rounded-lg items-center"
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
                  <span>Status: Online</span>
                </div>
              </div>
            )
          )}
      </div>
    </div>
  );
};

export default MyChats;
