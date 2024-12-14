import React, { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import { getSender, getSenderFull } from "../Config/ChatLogics";
import ProfileModel from "./ProfileModel";

const SingleChat = () => {
  const [groupSetting, setGroupSetting] = useState(false);
  const [openProfile, closeProfile] = useState(
  const {user , SelectedChat } = ChatState();
  console.log(SelectedChat);

  return (
    <>
      {SelectedChat ? (
        <>
          <div className="bg-zinc-800 w-full h-fit justify-between flex p-2 rounded-xl items-center text-center">
            <h1 className="text-3xl font-semibold">
              {getSender(user, SelectedChat.users)}
            </h1>
            <ProfileModel user={getSenderFull(user, SelectedChat.users)} />
            <button
              onClick={() => setGroupSetting(true)}
              className="text-2xl text-white hover:text-purple-500 hover:bg-zinc-300 p-1 px-2 rounded-xl transition-colors "
            >
              <i className="ri-settings-3-line"></i>
            </button>
            {groupSetting && (
              <GroupSettingModel
                setIsGropuchatOpen={setGroupSetting}
                reload={reload}
                setReload={setReload}
              />
            )}
          </div>
          <div className="flex-1 bg-zinc-700 rounded-xl flex flex-col gap-2 p-2">
            <div className="w-full flex-1"></div>
            <div className="w-full flex gap-2">
              <input
                className="p-2 bg-zinc-800 text-white placeholder-zinc-400  rounded-xl w-full border-[2px] border-zinc-600  outline-none "
                type="text"
                name=""
                id=""
              />
              <button className="px-3 bg-zinc-800 hover:bg-zinc-900 rounded-xl">
                <i className="ri-send-plane-2-fill text-purple-600 hover:to-purple-700"></i>
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="w-full h-full flex flex-col justify-center items-center gap-4">
            <div className="flex items-center justify-center w-32 h-32 bg-zinc-800 rounded-full">
              <i className="ri-chat-3-fill text-4xl text-purple-600"></i>
            </div>
            <h1 className="text-4xl font-semibold">Select a chat</h1>
          </div>
        </>
      )}
    </>
  );
};

export default SingleChat;
