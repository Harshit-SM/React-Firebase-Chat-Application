import { useContext, useEffect, useState } from "react";
import assets from "../../assets/assets";
import "./ChatBox.css";
import { AppContext } from "../../context/AppContext";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { toast } from "react-toastify";
import upload from "../../library/upload";



const ChatBox = () => {
  const { userData, messagesId, chatUser, messages, setMessages , chatVisible , setChatVisible, toggleSidebar, sidebarVisible,setSidebarVisible
  } =
    useContext(AppContext);

  const [input, setInput] = useState("");

  // const sendMessage = async () => {
  //   try {
  //     if (input && messagesId) {
  //       await updateDoc(doc(db, "messages", messagesId), {
  //         messages: arrayUnion({
  //           sId: userData.id,
  //           text: input,
  //           createdAt: new Date(),
  //         }),
  //       });

  //       const userIds = [chatUser.rId, userData.id];
  //       userIds.forEach(async (id) => {
  //         const userChatsRef = doc(db, "chats", id);
  //         const userChatsSnapshot = await getDoc(userChatsRef);

  //         if (userChatsSnapshot.exists()) {
  //           const userChatData = userChatsSnapshot.data();
  //           const chatIndex = userChatData.chatData.findIndex(
  //             (c) => c.messageId === messagesId
  //           );
  //           userChatData.chatData[chatIndex].lastMessage = input.slice(0, 30);
  //           userChatData.chatData[chatIndex].updatedAt = Date.now();

  //           if (userChatData.chatData[chatIndex].rId === userData.id) {
  //             userChatData.chatData[chatIndex].messageSeen = false;
  //           }
  //           await updateDoc(userChatsRef, {
  //             chatData: userChatData.chatData,
  //           });
  //         }
  //       });
  //     }
  //     console.log('hello');

  //   } catch (error) {
  //     toast.error(error.message);
  //   }
  // };

  const sendMessage = async () => {
    try {
      const trimmedInput = input.trim(); // Remove unnecessary spaces
      if (trimmedInput && messagesId) {
        // Add the message to Firestore
        await updateDoc(doc(db, "messages", messagesId), {
          messages: arrayUnion({
            sId: userData.id,
            text: trimmedInput,
            createdAt: new Date().toISOString(),
          }),
        });

        // Update chat metadata for both users
        const userIds = [chatUser.rId, userData.id];
        for (const id of userIds) {
          const userChatsRef = doc(db, "chats", id);
          const userChatsSnapshot = await getDoc(userChatsRef);

          if (userChatsSnapshot.exists()) {
            const userChatData = userChatsSnapshot.data();
            const chatIndex = userChatData.chatData.findIndex(
              (c) => c.messageId === messagesId
            );

            if (chatIndex !== -1) {
              userChatData.chatData[chatIndex].lastMessage = trimmedInput.slice(
                0,
                30
              );
              userChatData.chatData[chatIndex].updatesAt = Date.now();
              if (userChatData.chatData[chatIndex].rId === userData.id) {
                userChatData.chatData[chatIndex].messageSeen = false;
              }
              await updateDoc(userChatsRef, {
                chatData: userChatData.chatData,
              });
            } else {
              console.warn("Chat not found for messageId:", messagesId);
            }
          }
        }

        // Clear input field after sending

        toast.success("Message sent!");
      } else {
        toast.warn("Please enter a message.");
      }
    } catch (error) {
      toast.error(`Failed to send message: ${error.message}`);
    }
    setInput("");
  };

  const sendImage = async (e) => {
    try {
        const fileUrl = await upload(e.target.file[0]);
        if (fileUrl && messagesId) {
          await updateDoc(doc(db, "messages", messagesId), {
            messages: arrayUnion({
              sId: userData.id,
              image: fileUrl,
              createdAt: new Date().toISOString(),
            }),
          });
          const userIds = [chatUser.rId, userData.id];
          for (const id of userIds) {
            const userChatsRef = doc(db, "chats", id);
            const userChatsSnapshot = await getDoc(userChatsRef);
  
            if (userChatsSnapshot.exists()) {
              const userChatData = userChatsSnapshot.data();
              const chatIndex = userChatData.chatData.findIndex(
                (c) => c.messageId === messagesId
              );
  
              if (chatIndex !== -1) {
                userChatData.chatData[chatIndex].lastMessage = "Image";
                userChatData.chatData[chatIndex].updatesAt = Date.now();
                if (userChatData.chatData[chatIndex].rId === userData.id) {
                  userChatData.chatData[chatIndex].messageSeen = false;
                }
                await updateDoc(userChatsRef, {
                  chatData: userChatData.chatData,
                });
              } else {
                console.warn("Chat not found for messageId:", messagesId);
              }
            }
          }
        }
    } catch (error) {
      toast.error(error.message)
    }
    
  }

  // const convertTimestamp = (Timestamp)=>{
  //   let date = Timestamp.toDate();
  //   const hour = date.getHours();
  //   const minute = date.getMinutes();

  //   if (hour>12){
  //     return hour-12 + ":" + minute + "PM";
  //   }
  //   else {
  //     return hour + ":" + minute + "AM"
  //   }
  // }


  // const convertDate = (input) => {
  //   let date;
  //   if (input instanceof Date) {
  //     date = input; 
  //   } else if (typeof input === "number") {
  //     date = new Date(input);
  //   } else if (typeof input === "string") {
  //     date = new Date(input); 
  //   } 
  //   const hour = date.getHours();
  //   const minute = date.getMinutes().toString().padStart(2, "0"); 
  //   const period = hour >= 12 ? "PM" : "AM"; 
  //   const formattedHour = hour % 12 || 12;
  //   return `${formattedHour}:${minute} ${period}`;
  // };


  const convertDate = (input) => {
    const date = new Date(input); // Convert input to a Date object
    const hours = date.getHours(); // Get hours (0-23)
    const minutes = date.getMinutes().toString().padStart(2, "0"); // Ensure two digits
    const period = hours >= 12 ? "PM" : "AM"; // Determine AM or PM
  
    const formattedHour = hours % 12 || 12; // Convert to 12-hour format
    return `${formattedHour}:${minutes} ${period}`;
  };

  // useEffect(() => {
  //   if (messagesId) {
  //     const unSub = onSnapshot(doc(db, "messages", messagesId), (res) => {
  //       setMessages(res.data().messages.reverse());
  //       console.log(res.data().messages.reverse());
  //     });
  //     return () => {
  //       unSub();
  //     };
  //   }
  // }, [messagesId]);

  useEffect(() => {
    if (messagesId) {
      const unSub = onSnapshot(
        doc(db, "messages", messagesId),
        (res) => {
          if (res.exists()) {
            const messagesData = res.data()?.messages || [];
            setMessages([...messagesData].reverse());
          } else {
            console.warn("No messages document found.");
          }
        },
        (error) => {
          console.error("Error fetching messages:", error);
        }
      );
      return () => unSub();
    }
    
  }, [messagesId, setMessages]);
 
  return chatUser ? (
    <div className={`chat-box ${chatVisible ? "" : "hidden"}`}>
      <div className="chat-user">
        <img src="/src/assets/profile_icon.png" alt="profile.img" />
        <p>
          {chatUser.userData.name}{Date.now()-chatUser.userData.lastSeen <= 150000 ? <img className="dot" src={assets.green_dot} alt="" /> :null}
        </p>
        <img onClick={toggleSidebar} className="help" src={assets.help_icon} alt="" />
        <img onClick={()=>setChatVisible(false)} className="arrow" src={assets.arrow_icon} alt="" />
      </div>
      <div className="chat-message">
        {messages.map((msg, index) => {          
         return  <div key = {index} className={msg.sId === userData.id ? "send-msg" : "r-msg"}>
          {msg["Image"] ? <img className="msg-img" src={msg.image}/> 
          :  <p className="msg">{msg.text}</p>
        }
            <div>
              <img src="/src/assets/avatar_icon.png" alt="" />
              <p>{convertDate(msg.createdAt)}</p>
            </div>
          </div>;
        })}
      </div>
      <div className="chat-input">
        <input
          onChange={(e) => {
            setInput(e.target.value);
            console.log("Input changed:", e.target.value);
          }}
          type="text"
          value={input}
          placeholder="Send a message"
        />
        <input onChange={sendImage} type="file" id="image" accept="image/png, image/jpeg " hidden />
        <label htmlFor="image">
          <img src={assets.gallery_icon} alt="" />
        </label>
        <img onClick={sendMessage} src={assets.send_button} alt="" />
      </div>
    </div>
  ) : (
    <div className={`chat_welcome ${chatVisible ? "" : "hidden"}`}>
      <img src={assets.logo_icon} alt="" />
      <p>Chat anytime anywhere</p>
    </div>
  );
};

export default ChatBox;
