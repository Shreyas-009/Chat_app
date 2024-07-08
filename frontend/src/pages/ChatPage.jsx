import React, { useEffect, useState } from 'react'
import axios from 'axios';

const ChatPage = () => {
  const [chats , setChats] = useState([]); 
  const [userinfo , setUserinfo] = useState([]);

  const FetchData = async () => {
    const data = await axios.get("/api/chat");
    setChats(data.data);
  };


  useEffect(() => {
    const user = localStorage.getItem("userInfo");
    setUserinfo(user);
    // console.log("userinfo : ", user);
    FetchData();
  }, []);

  return (
    <>
      <div>ChatPage</div>
      {/* {chats.map((value, index, array) => {
        return (
          <div key={index}>
            {value.chatName} : {value._id}
          </div>
        );
      })} */}
      <h1>{userinfo.name}</h1>
      <h1>{userinfo.email}</h1>
      <h1>{userinfo.token}</h1>
      <img className="" src={userinfo.picture} alt="" />
    </>
  );
}

export default ChatPage;