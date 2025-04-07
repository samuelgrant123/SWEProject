import { app } from '../config/db.js';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut  } from "firebase/auth";

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

export const getUser = async (req, res) => {
  try {
    res.status(200).json({ auth });
  } catch (error) {
    console.error("Getting Auth not successful", error);
    res.status(400).json({ message: error.message });
  }
};

export const signOutUser = async (req, res) => {
  signOut(auth).then(() => {
    res.status(200).json({ auth });
    console.log("Sign out successful");
  }).catch((error) => {
    console.error("Signout not successful", error);
    res.status(400).json({ message: error.message });
  });
};

