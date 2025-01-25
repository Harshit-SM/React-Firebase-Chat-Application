import { Route, Routes, useNavigate } from "react-router-dom"
import Login from "./pages/LoginFolder/login"
import Chat from "./pages/ChatFolder/chat"
import ProfileUpdate from "./pages/ProfileUpdate-Folder/ProfileUpdate"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/ReactToastify.css'
import { useContext, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./config/firebase";
import { AppContext } from "./context/AppContext";


const App = () => {
 const navigate = useNavigate();
const {loadUserData} = useContext(AppContext)

useEffect(() =>{
  onAuthStateChanged(auth, async (user) =>{
     if(user){
      navigate('/chat')
      console.log(user);
      await loadUserData(user.uid)
     }
     else{
        navigate('/')
     }


  })
},[])

  return (
    <>
    <ToastContainer/>
      <Routes>
        <Route path="/" element={<Login/>}></Route>
        <Route path="/chat" element={<Chat/>}></Route>
        <Route path="/Profile" element={<ProfileUpdate/>}></Route>
      </Routes>
    </>
  )
}

export default App
