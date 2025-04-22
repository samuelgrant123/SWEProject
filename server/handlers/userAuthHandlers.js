import { app } from '../config/db.js';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/db.js';

//Get the firebase auth
const auth = getAuth(app);

//The handler for the signup endpoint
export const signup = async (req, res) => {
  const { email, password, displayName } = req.body;
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName });
    console.log("Signup successful");
    return res.status(200).json({ message: "Signup successful", email: userCredential.user.email, displayName: userCredential.user.displayName});
  }catch (error){
    console.log("Signup not successful");
    return res.status(400).json({ message: error.message });
  }
};

//The handler for the login endpoint
export const login = async (req, res) => {
  const { email, password } = req.body;
  try{
    //Execute the firebase sign in command
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("Login successful");
    return res.status(200).json({message: "Login successful", email: user.email, displayName: user.displayName || "User"});
  }catch (error){
    console.log("Login not successful");
    return res.status(400).json({ message: error.message });
  }
};

//The handler for upating the  username of the current user
export const updateUserName = async (req, res) => {
  try {
    const { email, newName } = req.params;

    if (!email || !newName){
      return res.status(400).json({ error: "Missing parameters" });
    }

    const userRef = doc(db, "users", email);
    await updateDoc(userRef, { username: newName });

    return res.status(200).json({ message: "Username updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to update username", error: error.message });
  }
};

//The handler for the log out feature
export const signOutUser = async (req, res) => {
  try{
    await signOut(auth);
    console.log("Sign out successful");
    return res.status(200).json({ message: "Sign out successful" });
  }catch (error){
    console.error("Signout not successful", error);
    return res.status(400).json({ message: error.message });
  }
};
