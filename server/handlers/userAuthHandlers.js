import { app } from '../config/db.js';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';

const auth = getAuth(app);

export const signup = async (req, res) => {
  const { email, password, displayName } = req.body;
  try {
    const userCredential = 
    await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName });


    console.log("Signup successful");
    return res.status(200).json({
      message: "Signup successful",
      email: userCredential.user.email,
      displayName: userCredential.user.displayName
    });
  } catch (error) {
    console.log("Signup not successful");
    return res.status(400).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("Login successful");
    return res.status(200).json({
      message: "Login successful",
      email: user.email,
      displayName: user.displayName || "User"
    });
  } catch (error) {
    console.log("Login not successful");
    return res.status(400).json({ message: error.message });
  }
};

export const updateUserName = async (req, res) => {
  try {
    const { email, newName } = req.params;

    if (!email || !newName) {
      return res.status(400).json({ error: "Missing parameters" });
    }

    const userRef = doc(db, "users", email);
    await updateDoc(userRef, { firstName: newName });

    return res.status(200).json({ message: "Username updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to update username", error: error.message });
  }
};


export const getUser = async (req, res) => {
  return res.status(501).json({ message: "Not implemented. Use session or localStorage client-side." });
};

export const signOutUser = async (req, res) => {
  try {
    await signOut(auth);
    console.log("Sign out successful");
    return res.status(200).json({ message: "Sign out successful" });
  } catch (error) {
    console.error("Signout not successful", error);
    return res.status(400).json({ message: error.message });
  }
};
