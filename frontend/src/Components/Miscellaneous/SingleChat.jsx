import React, { useEffect, useRef, useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import { getSender, getSenderFull } from "../Config/ChatLogics";
import ProfileModel from "./ProfileModel";
import GroupSettingModel from "./GroupSettingModel";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import io from "socket.io-client";
import { motion } from "framer-motion";

const ENDPOINT = "http://localhost:8080";
var socket, selectedChatCompare;

const TypingIndicator = () => (
  <div className="flex items-center gap-2 py-2 px-4">
    <div className="flex items-end gap-1">
      <motion.div
        className="w-3 h-3 bg-gradient-to-tr from-purple-500 to-purple-300 rounded-full shadow-lg"
        animate={{
          y: [-2, 2, -2],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="w-3 h-3 bg-gradient-to-tr from-purple-500 to-purple-300 rounded-full shadow-lg"
        animate={{
          y: [-2, 2, -2],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.2,
        }}
      />
      <motion.div
        className="w-3 h-3 bg-gradient-to-tr from-purple-500 to-purple-300 rounded-full shadow-lg"
        animate={{
          y: [-2, 2, -2],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.4,
        }}
      />
    </div>
    <motion.span
      className="text-sm text-zinc-400"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    />
  </div>
);

const SingleChat = ({ reload, setReload }) => {
  const [groupSetting, setGroupSetting] = useState(false);
  const [openProfile, setOpenProfile] = useState();
  const {
    user,
    SelectedChat,
    setSelectedChat,
    notifications,
    setNotifications,
  } = ChatState();

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typing, setTyping] = useState(false);

  const [socketConnected, setSocketConnected] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessage = async () => {
    if (!SelectedChat) return;

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
      setMessages(data);
      socket.emit("join chat", SelectedChat._id);
    } catch (error) {
      toast.error("Failed to fetch messages");
    } finally {
      setLoading(false);
    }
  };

  // socket.io setup useeffect
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  // message delete and notification handling useeffect
  useEffect(() => {
    const messageHandler = (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        if (!notifications.includes(newMessageReceived)) {
          setNotifications([...notifications, newMessageReceived]);
          setReload(!reload);
        }
      } else {
        setMessages((prevMessages) => [...prevMessages, newMessageReceived]);
      }
    };

    const deleteHandler = ({ messageId, chatId }) => {
      if (SelectedChat && SelectedChat._id === chatId) {
        setMessages((prevMessages) =>
          prevMessages.filter((msg) => msg._id !== messageId)
        );
      }
    };

    socket.on("message recived", messageHandler);
    socket.on("message deleted", deleteHandler);

    return () => {
      socket.off("message recived", messageHandler);
      socket.off("message deleted", deleteHandler);
    };
  }, [selectedChatCompare, notifications, SelectedChat]);

  const handleSendMessage = async () => {
    socket.emit("stop typing", SelectedChat._id);
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

        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        console.log(error);
        toast.error("Failed to send message");
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

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", SelectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;

    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", SelectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  //delete message handler
  const handleDeleteMessage = async (messageId) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      await axios.delete(`/api/message/${messageId}`, config);

      // Update local state immediately for sender
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg._id !== messageId)
      );

      // Emit delete event for other users
      socket.emit("delete message", {
        messageId: messageId,
        chatId: SelectedChat._id,
      });

      toast.success("Message deleted successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete message");
    }
  };

  useEffect(() => {
    fetchMessage();
    selectedChatCompare = SelectedChat;
  }, [SelectedChat]);

  useEffect(() => {
    socket.on("message recived", (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        //give notification
        if (!notifications.includes(newMessageReceived)) {
          setNotifications([...notifications, newMessageReceived]);
          setReload(!reload);
        }
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });
  });

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
          <div className="flex-1 bg-zinc-900/50 rounded-xl flex flex-col gap-3 p-3 shadow-inner ">
            {loading ? (
              <div className="flex-1 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-zinc-600 border-t-purple-500"></div>
              </div>
            ) : (
              <div className="flex flex-col h-full">
                <div
                  id="message-container"
                  className="h-[calc(100vh-277px)] overflow-y-auto pr-2 space-y-2 scrollbar-thin scrollbar-thumb-zinc-600 scrollbar-track-zinc-800 hideScrollbar"
                >
                  {messages.map((message, index) => {
                    const isCurrentUser = message.sender._id === user._id;
                    const isPreviousMessageFromSameSender =
                      index > 0 &&
                      messages[index - 1].sender._id === message.sender._id;
                    const isNextMessageFromSameSender =
                      index < messages.length - 1 &&
                      messages[index + 1].sender._id === message.sender._id;
                    const showAvatar =
                      !isCurrentUser && !isNextMessageFromSameSender;

                    return (
                      <div
                        key={message._id}
                        className={`flex ${
                          isCurrentUser ? "justify-end" : "justify-start"
                        } ${isPreviousMessageFromSameSender ? "mt-1" : "mt-3"}`}
                      >
                        {!isCurrentUser && (
                          <div className="flex items-end">
                            {showAvatar && SelectedChat.isGroupChat ? (
                              <img
                                src={message.sender.picture}
                                alt={message.sender.name}
                                className="w-6 h-6 rounded-full mr-2 mb-1 object-cover"
                              />
                            ) : (
                              SelectedChat.isGroupChat && (
                                <div className="w-6 mr-2" />
                              )
                            )}
                            <div
                              className={`max-w-[70%] min-w-[120px] rounded-lg px-3 py-1.5 bg-zinc-700 text-zinc-200`}
                            >
                              {SelectedChat.isGroupChat &&
                                !isPreviousMessageFromSameSender && (
                                  <div className="text-xs font-bold mb-0.5 text-purple-300">
                                    {message.sender.name}
                                  </div>
                                )}
                              <div className="break-words text-sm whitespace-pre-wrap">
                                {message.content}
                              </div>
                              <div className="text-[10px] text-nowrap mt-0.5 text-zinc-400">
                                {new Date(message.createdAt).toLocaleTimeString(
                                  [],
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {isCurrentUser && (
                          <div className=" group max-w-[70%] min-w-[120px]">
                            <div className="rounded-lg px-3 py-1.5 bg-purple-600 text-white">
                              <div className="break-words text-sm whitespace-pre-wrap">
                                {message.content}
                              </div>
                              <div className="flex items-center justify-between gap-2 mt-0.5">
                                <div className="text-[10px] text-zinc-300">
                                  {new Date(
                                    message.createdAt
                                  ).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </div>
                                <button
                                  onClick={() =>
                                    handleDeleteMessage(message._id)
                                  }
                                  className="text-zinc-300  hover:text-red-400 transition-colors md:opacity-0 md:group-hover:opacity-100"
                                >
                                  <i className="ri-delete-bin-line"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  <div ref={messagesEndRef} />
                </div>
                <div className="w-full">
                  <div style={{ visibility: isTyping ? "visible" : "hidden" }}>
                    <TypingIndicator />
                  </div>

                  <div className="w-full flex gap-3 pt-2">
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
              </div>
            )}
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
