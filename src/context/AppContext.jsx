import { createContext, useEffect, useState } from "react";
import { auth, db } from "../config/firebase";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [chatData, setChatData] = useState([]);
  const [chatUser, setChatUser] = useState(null);
  const [messagesId, setMessagesId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [sidebarVisible, setSidebarVisible] = useState(false); 

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible); 
  };

  const[chatVisible, setChatVisible] = useState(false)

  const loadUserData = async (uid) => {
    try {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);
      console.log(userSnap);

      const userData = userSnap.data();
      console.log(userData);

      setUserData(userData);
      if (!userData.avatar && userData.name) {
        navigate("/chat");
      } else {
        navigate("/profile");
      }
      await updateDoc(userRef, {
        lastSeen: Date.now(),
      });

      setInterval(async () => {
        if (auth.chatUser) {
          await updateDoc(userRef, {
            lastSeen: Date.now(),
          });
        }
      }, 60000);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (userData) {
      const chatRef = doc(db, "chats", userData.id);
      console.log(chatRef);

      const unSub = onSnapshot(chatRef, async (res) => {
        const chatItems = res.data().chatData;
        console.log(chatData);

        if (!Array.isArray(chatItems)) {
          console.error("chatsData is not an array or is undefined.");
          return;
        }

        console.log(chatItems);
        const tempData = [];
        for (const item of chatItems) {
          const userRef = doc(db, "users", item.rId);
          const userSnap = await getDoc(userRef);
          const userData = userSnap.data();
          tempData.push({ ...item, userData });
        }
        setChatData(tempData.sort((a, b) => b.updatedAt - a.updatedAt));
        console.log(tempData);
      });
      console.log(chatData);

      return () => {
        unSub();
      };
    }
  }, [userData]);

  useEffect(() => {
    if (!chatVisible) {
      setSidebarVisible(false); // Automatically close the sidebar when chat is not visible
    }
  }, [chatVisible]);

  const value = {
    userData,
    setUserData,
    chatData,
    setChatData,
    loadUserData,
    messages,
    setMessages,
    messagesId,
    setMessagesId,
    chatUser,
    setChatUser,
    chatVisible,setChatVisible,
    toggleSidebar, sidebarVisible,setSidebarVisible
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
