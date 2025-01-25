import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, signOut} from "firebase/auth";
import { collection, doc, getDocs, getFirestore, query, setDoc, where } from "firebase/firestore";
import { toast } from "react-toastify";



const firebaseConfig = {
  apiKey: "AIzaSyCLXx_V2wLwpWwi8QVeFXmP7zoxFdmysCA",
  authDomain: "react-chat-web-app-fb0b0.firebaseapp.com",
  projectId: "react-chat-web-app-fb0b0",
  storageBucket: "react-chat-web-app-fb0b0.firebasestorage.app",
  messagingSenderId: "301223860403",
  appId: "1:301223860403:web:424392453af8ada60a78c6",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


const signup = async (username,email,password) => {
  
  try {
    const res = await createUserWithEmailAndPassword(auth,email,password);
    const user = res.user;
     await setDoc(doc(db,"users",user.uid),{
      id:user.uid,
      username:username.toLowerCase(),
      email,
      name:"",
      avatar:"",
      bio:"",
      lastSeen:Date.now()
     })
     await setDoc(doc(db,"chats",user.uid),{
        chatData:[]
     }
    
    )
  } catch (error) {
      console.log(error);
      toast.error(error.code.split('/')[1].split('-').join(" "));  }
}

const login = async (email,password) => {

  try {
     await signInWithEmailAndPassword(auth,email,password);
  } catch (error) {
    console.log(error);
    toast.error(error.code.split('/')[1].split('-').join(" "));
    
  }
  
}

const logout = async() => {

  try {
    signOut(auth)
  } catch (error) {
    console.log(error);
    toast.error(error.code.split('/')[1].split('-').join(" "));
  }

}

const resetPassword = async (email) => {
  if (!email) {
    toast.error('Enter your email')
    return null
  }
  try {
    const userRef = collection(db,'users');
    const q = query(userRef,where("email","==",email))
    const querySnap = await getDocs(q);
    if (!querySnap.empty) {
      await sendPasswordResetEmail(auth,email);
      toast.success("Reset Email Sent");
    }
    else{
      toast.error("Email doesn't exists");
    }
  } catch (error) {
    console.error(error);
    toast.error(error.message);
  }
  
}

export{signup , login , logout , auth ,db , resetPassword}
