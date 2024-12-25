import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [SelectedChat, setSelectedChat] = useState("");
  const [chats, setChats] = useState([]);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const currentPath = window.location.pathname;

     if (!userInfo && currentPath === "/login") {
       return; // Skip authentication check for login page
     }
     
    if (userInfo) {
      setUser(userInfo);

   
      // Check token expiration
      const token = userInfo.token;
      const isTokenExpired = () => {
        if (!token) return true;
        const { exp } = JSON.parse(atob(token.split(".")[1])); // Decode JWT
        return Date.now() >= exp * 1000; // Compare with current time
      };

      if (isTokenExpired()) {
        localStorage.removeItem("userInfo");
        setUser(null);
        navigate("/"); // Redirect to login
        toast.error("Session expired. Please log in again.");
      }
    } else {
      setUser(null);
      navigate("/");
    }
  }, [navigate]);

  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        SelectedChat,
        setSelectedChat,
        chats,
        setChats,
        notifications,
        setNotifications,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
