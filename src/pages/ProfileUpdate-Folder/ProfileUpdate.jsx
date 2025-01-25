import { useContext, useEffect, useState } from 'react'
import assets from '../../assets/assets'
import './ProfileUpdate.css'
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify/unstyled';
import upload from '../../library/upload';
import { AppContext } from '../../context/AppContext';

const ProfileUpdate = () => {

const navigate = useNavigate()
const [image,setimage] = useState(false);
const [name ,setName] = useState("")
const [bio, setBio] = useState("")
const [uid, setUid] = useState("")
const [prevImage, SetPrevImage] = useState("")
const {setUserData} = useContext(AppContext)


// const profileUpdate = async (e) => {
//   e.preventDefault();

//   try {
//     if (!prevImage && image) {
    
//       toast.error("Upload Profile Picture")
//        console.log("harshit");
       
//     }
//     const docRef = doc(db, "users",uid)
//     if (image) {
//       const imageUrl = await upload(image)
//       SetPrevImage(imageUrl)
//       await updateDoc(docRef,{
//         avatar:imageUrl,
//         bio:bio,
//         name:name
//       })
//     }
//     else{
//       await updateDoc(docRef,{
//         bio:bio,
//         name:name
//       })
//     }

//     const snap = await getDoc(docRef)
//     setUserData(snap.data());
//     navigate('/chat')
    
//   } catch (error) {
//     console.error(error);
//     toast.error(error.message)
    
//   }

// }

// useEffect(()=>{
//   onAuthStateChanged(auth , async (user) => {
//     if (user) {
//        setUid(user.uid)
//        const docRef =doc(db , "users",user.uid);
//        const docSnap = await getDoc(docRef);
//        if (docSnap.data().name) {
//         setName(docSnap.data().name)
        
//        }
//        if (docSnap.data().bio) {
//         setBio(docSnap.data().bio)
        
//        }
//        if (docSnap.data().avatar) {
//         SetPrevImage(docSnap.data().avtar)
        
//        }
//     }
//     else{
//       navigate('/')
//     }
    
//   })
// })

const profileUpdate = async (e) => {
  e.preventDefault();

  try {
    if (!prevImage && image) {
      toast.error("Upload Profile Picture");
      return;
    }

    const docRef = doc(db, "users", uid);
    if (image) {
      const imageUrl = await upload(image); // Upload the image
      await updateDoc(docRef, {
        avatar: imageUrl,
        bio,
        name,
      });
      SetPrevImage(imageUrl); // Update state with new avatar
    } else {
      await updateDoc(docRef, {
        bio,
        name,
      });
    }

    // Fetch updated user data and update context
    const snap = await getDoc(docRef);
    setUserData(snap.data());

    toast.success("Profile updated successfully!");
    navigate('/chat'); // Redirect after update
  } catch (error) {
    console.error(error);
    toast.error("Failed to update profile: " + error.message);
  }
};


useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (user) {
      setUid(user.uid); // Set user ID
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        setName(userData.name || ""); // Use empty string if name is not set
        setBio(userData.bio || "");   // Use empty string if bio is not set
        SetPrevImage(userData.avatar || assets.avatar_icon); // Set default avatar if none exists
      }
    } else {
      navigate('/'); // Redirect if not authenticated
    }
  });

  return () => unsubscribe(); // Cleanup the listener
}, [navigate]);

  return (
    <div className='profile'>
      <div className="profile-container">
        <form onSubmit={profileUpdate}>
          <h3>Profile Details</h3>
          <label htmlFor="avatar">
            <input onChange={(e)=> setimage(e.target.files[0])} type="file"  id='avatar' accept='.png, .jpg, .jpeg' hidden/>
            <img src={image ? URL.createObjectURL(image) : assets.avatar_icon} alt="" />
            Upload profile image
          </label>
          <input onChange={(e) => setName(e.target.value)}  value = {name} type="text" placeholder='Your name' required/>
          <textarea  onChange={(e) => setBio(e.target.value)}  value = {bio} placeholder='Write profile bio' required></textarea>
          <button type='submit'>Save</button>
        </form>
        <img className='profile-pic' src={image ?  URL.createObjectURL(image) : prevImage ? prevImage : assets.logo_icon} alt="" />
      </div>
      
    </div>
  )
}

export default ProfileUpdate
