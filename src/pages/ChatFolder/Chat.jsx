import "react";
import "./chat.css";
import LeftSidebar from "../../components/leftsidebar-folder/LeftSidebar";
import ChatBox from "../../components/Chatbox-folder/ChatBox";
import RightSidebar from "../../components/rightsidebar-folder/RightSidebar";

const Chat = () => {
  return (
    <div className="chat">
      <div className="chat-container">
        <LeftSidebar />
        <ChatBox />
        <RightSidebar />
      </div>
    </div>
  );
};

export default Chat;
