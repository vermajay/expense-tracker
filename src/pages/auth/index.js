import {auth, provider} from '../../config/firebase' 
import { signInWithPopup } from 'firebase/auth'
import {toast} from "react-hot-toast";
import {useNavigate, Navigate} from 'react-router-dom'
import { useGetUserInfo } from "../../hooks/useGetUserInfo"

const Auth = () => {

  const navigate = useNavigate();
  const {isAuth} = useGetUserInfo();

  const signInWithGoogle = async() => {
    try{
      const results = await signInWithPopup(auth, provider);
      toast.success("Signed in successfully");
      navigate("track");
      const authInfo = {
        userId: results.user.uid,
        name: results.user.displayName,
        profilePhoto: results.user.photoURL,
        isAuth: true
      }
      localStorage.setItem("auth", JSON.stringify(authInfo));
    }
    catch(error){
      toast.error(error.message);
    }
  }

  if(isAuth) return <Navigate to="track"/>

  return (
    <div>
      <button onClick={signInWithGoogle}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >sign in with google</button>
    </div>
  )
}

export default Auth