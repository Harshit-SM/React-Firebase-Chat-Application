import { useContext, useEffect, useState } from "react";
import assets from "../../assets/assets";
import { logout } from "../../config/firebase";
import "./RightSidebar.css";
import { AppContext } from "../../context/AppContext";

const RightSidebar = () => {
  const { chatUser, messages, sidebarVisible, chatVisible} = useContext(AppContext);
  const [msgImages, setMsgImages] = useState([]);

       


console.log(Date.now());


  useEffect(() => {
    let tempVar = [];
    messages.map((msg) => {
      if (msg.image) {
        tempVar.push(msg.image);
      }
    });
    setMsgImages(tempVar);
  }, [messages]);

  return chatUser ? (
    <div className={!sidebarVisible ? "rs" : " rs show"}>
      <div className="rs-profile">
        <img src="/src/assets/profile_icon.png" alt="" />
        <h3>
        {Date.now()-chatUser.userData.lastSeen <= 150000 ? <img className="dot" src={assets.green_dot} alt="" /> :null}
          {chatUser.userData.name}{" "}
         
        </h3>
        <p> {chatUser.userData.bio}</p>
      </div>
      <hr />
      <div className="rs-media">
        <p>media</p>
        <div>
          {msgImages.map((url, index) => {
          return  <img key={index} src={url}  onClick={()=>window.open(url)} alt="" />;
          })}
        </div>
      </div>
      <button onClick={() => logout()}>Logout</button>
    </div>
  ) : (
    <div className="rs">
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
};

export default RightSidebar;
