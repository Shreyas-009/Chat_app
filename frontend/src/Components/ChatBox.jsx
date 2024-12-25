import React, { useState } from "react";
import SingleChat from "./Miscellaneous/SingleChat";
import { ChatState } from "../Context/ChatProvider";

const ChatBox = ({ reload, setReload }) => {
  const { SelectedChat } = ChatState();

  return (
    <div
      className={`${
        SelectedChat ? "flex" : "hidden"
      } md:flex flex-1 bg-zinc-800 rounded-xl overflow-hidden flex-col p-2 gap-2`}
    >
      <SingleChat setReload={setReload} reload={reload} />
    </div>
  );
};

export default ChatBox;
