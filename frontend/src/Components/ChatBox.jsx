import React, { useState } from "react";
import GroupSettingModel from "./Miscellaneous/GroupSettingModel";
import SingleChat from "./Miscellaneous/SingleChat";
const ChatBox = ({ reload, setReload }) => {
  const [groupSetting, setGroupSetting] = useState(false);

  return (
    <div className="hidden md:flex flex-1 bg-zinc-600 rounded-xl overflow-hidden flex-col p-2 gap-2">
      <SingleChat />
    </div>
  );
};

export default ChatBox;
