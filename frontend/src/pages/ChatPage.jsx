import React, { useState } from "react";
import SideBar from "../Components/Miscellaneous/SideBar";
import MyChats from "../Components/MyChats";
import ChatBox from "../Components/ChatBox";
import { ChatState } from "../Context/ChatProvider";
import ProfileModel from "../Components/Miscellaneous/ProfileModel";

const ChatPage = () => {
  const { user } = ChatState();
  const [openProfile, setOpenProfile] = useState(false);
  const [reload , setReload] = useState(false);

  return (
    <div className="w-full h-full bg-zinc-900 flex flex-col">
      {user && (
        <SideBar openProfile={openProfile} setOpenProfile={setOpenProfile} reload={reload} setReload={setReload}/>
      )}
      <div className="flex-1 flex  justify-center gap-2 w-full  bg-zinc-700 p-2">
        {user && <MyChats reload={reload} />}
        {user && <ChatBox reload={reload} setReload={setReload} />}
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