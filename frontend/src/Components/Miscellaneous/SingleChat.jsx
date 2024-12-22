import React, { useEffect, useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import { getSender, getSenderFull } from "../Config/ChatLogics";
import ProfileModel from "./ProfileModel";
import GroupSettingModel from "./GroupSettingModel";
import axios from "axios";

const SingleChat = ({ reload, setReload }) => {
  const [groupSetting, setGroupSetting] = useState(false);
  const [openProfile, setOpenProfile] = useState();
  const { user, SelectedChat, setSelectedChat } = ChatState();

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: SelectedChat._id,
          },
          config
        );

        console.log(data);
        setMessages([...messages, data]);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
  };

  const fetchMessage = async () => {
    if (!SelectedChat) {
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `/api/message/${SelectedChat._id}`,
        config
      );

      console.log(data);

      setMessages(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMessage();
  }, [SelectedChat]);

  return (
    <>
      {SelectedChat ? (
        <>
          <div className="bg-zinc-900 w-full h-fit justify-between flex p-3 rounded-xl items-center text-center shadow-lg">
            <div className="flex gap-3 justify-center items-center">
              <button
                className="block md:hidden hover:text-purple-400 transition-colors"
                onClick={() => setSelectedChat(null)}
              >
                <i className="ri-arrow-left-line text-2xl"></i>
              </button>
              {!SelectedChat.isGroupChat ? (
                <img
                  src={
                    SelectedChat.users[1].picture
                      ? SelectedChat.users[1].picture
                      : "default_profile_picture.png"
                  }
                  alt={user.name}
                  className="h-10 w-10 rounded-full object-cover border-2 border-purple-500"
                />
              ) : (
                <div className="rounded-full h-10 w-10 bg-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                  {SelectedChat.chatName[0].toUpperCase()}
                </div>
              )}
              <span className="text-2xl font-semibold text-white">
                {SelectedChat.isGroupChat
                  ? SelectedChat.chatName
                  : getSender(user, SelectedChat.users)}
              </span>
            </div>
            <button
              onClick={() =>
                SelectedChat.isGroupChat
                  ? setGroupSetting(true)
                  : setOpenProfile(true)
              }
              className="text-2xl text-zinc-300 hover:text-purple-400 hover:bg-zinc-800 p-2 rounded-xl transition-all duration-200"
            >
              <i className="ri-settings-3-line"></i>
            </button>
            {groupSetting && (
              <GroupSettingModel
                setIsGropuchatOpen={setGroupSetting}
                fetchMessage={fetchMessage}
                reload={reload}
                setReload={setReload}
              />
            )}
            {openProfile && (
              <ProfileModel
                user={getSenderFull(user, SelectedChat.users)}
                setOpenProfile={setOpenProfile}
              />
            )}
          </div>

          <div className="flex-1 bg-zinc-800 rounded-xl flex flex-col gap-3 p-3 shadow-inner">
            {loading ? (
              <div className="flex-1 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-zinc-600 border-t-purple-500"></div>
              </div>
            ) : (
              <div
                id="message-container"
                className="w-full flex-1 overflow-y-auto"
              >
                {messages.map((message) => (
                  <div
                    key={message._id}
                    className={`flex ${
                      message.sender._id === user._id
                        ? "justify-end"
                        : "justify-start"
                    } mb-2`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        message.sender._id === user._id
                          ? "bg-purple-600 text-white"
                          : "bg-zinc-700 text-zinc-200"
                      }`}
                    >
                      {SelectedChat.isGroupChat &&
                        message.sender._id !== user._id && (
                          <div className="text-xs font-bold mb-1 text-purple-300">
                            {message.sender.name}
                          </div>
                        )}
                      <div>{message.content}</div>
                      <div className="text-xs mt-1 text-zinc-400">
                        {new Date(message.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="w-full flex gap-3">
              <input
                className="p-3 bg-zinc-900 text-white placeholder-zinc-400 rounded-xl w-full border-2 border-zinc-700 outline-none focus:border-purple-500 transition-colors"
                type="text"
                placeholder="Type a message..."
                onKeyDown={handleKeyPress}
                onChange={typingHandler}
                value={newMessage}
                required
              />
              <button
                onClick={handleSendMessage}
                className="px-4 bg-purple-600 hover:bg-purple-700 rounded-xl transition-colors duration-200 flex items-center justify-center"
              >
                <i className="ri-send-plane-2-fill text-white text-xl"></i>
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="w-full h-full flex flex-col justify-center items-center gap-6">
            <div className="flex items-center justify-center w-36 h-36 bg-zinc-900 rounded-full shadow-lg">
              <i className="ri-chat-3-fill text-5xl text-purple-500"></i>
            </div>
            <h1 className="text-4xl font-semibold text-zinc-200">
              Select a chat
            </h1>
          </div>
        </>
      )}
    </>
  );
};

export default SingleChat;
