import React, { useEffect } from 'react'
import axios from 'axios';

const ChatPage = () => {
  
  const FetchData = async () => {
    const data = await axios.get("/api/chat");
    console.log(data);
  };

  useEffect(() => {
    FetchData();
  }, []);

  return (
    <div>ChatPage</div>
  )
}

export default ChatPage;