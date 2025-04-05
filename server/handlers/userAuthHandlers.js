import { app } from '../config/db.js';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword  } from "firebase/auth";

const auth = getAuth(app);

export const signup = async (req, res) => {
    const {email, password} = req.body;
    try{
      await createUserWithEmailAndPassword(auth, email, password);
      console.log("Signup successful");
      return res.status(200).json({message: "Signup successful"});
    }catch (error){
      console.log("Signup not successful");
      return res.status(400).json({message: error.message})
    }
};

export const login = async (req, res) => {
  const {email, password} = req.body;
    try{
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Login successful");
      return res.status(200).json({message: "Login successful"});
    }catch (error){
        console.log("Login not successful");
        return res.status(400).json({message: error.message})
    }
}
