import { app } from './server/config/db.js';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword  } from "firebase/auth";

const auth = getAuth(app);

export const loginSignup = async (req, res) => {
    const {email, password, isLogin} = req.body;
    try {
        if (isLogin){
          await signInWithEmailAndPassword(auth, email, password);
        }else{
          await createUserWithEmailAndPassword(auth, email, password);
        }
        return res.status(200).json({message: "Success"});
    }catch (error){
        return res.status(400).json({message: error.message})
    }
};
