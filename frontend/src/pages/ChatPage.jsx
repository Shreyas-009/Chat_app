import React, { useState } from "react";
import SideBar from "../Components/Miscellaneous/SideBar";
import MyChats from "../Components/MyChats";
import ChatBox from "../Components/ChatBox";
import { ChatState } from "../Context/ChatProvider";
import ProfileModel from "../Components/Miscellaneous/ProfileModel";

const ChatPage = () => {
  const { user } = ChatState();
  const [openProfile, setOpenProfile] = useState(false);

  return (
    <div className="w-full h-full bg-zinc-900 flex flex-col">
      {user && (
        <SideBar openProfile={openProfile} setOpenProfile={setOpenProfile} />
      )}
      <div className="flex-1 flex  justify-center w-full  bg-zinc-700 p-2">
        {user && <MyChats />}
        {user && <ChatBox />}
        {openProfile && (
          <ProfileModel
            user={user}
            openProfile={openProfile}
            setOpenProfile={setOpenProfile}
          />
        )}
      </div>
    </div>
  );
};

export default ChatPage;
