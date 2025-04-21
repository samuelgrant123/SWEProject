// server/handlers/userAuthHandlers.js
import { app } from '../config/db.js';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/db.js';

const auth = getAuth(app);

// Handle user signup
export const signup = async (req, res) => {
  const { email, password, displayName } = req.body;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
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

// Handle user login
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

// Update username in Firestore
export const updateUserName = async (req, res) => {
  const { email, newName } = req.params;

  if (!email || !newName) {
    return res.status(400).json({ error: "Missing parameters" });
  }

  try {
    const userRef = doc(db, "users", email);
    await updateDoc(userRef, { firstName: newName });

    return res.status(200).json({ message: "Username updated successfully" });
  } catch (error) {
    console.error("Error updating username:", error);
    return res.status(500).json({ message: "Failed to update username", error: error.message });
  }
};

// Stub route for getting user (not implemented)
export const getUser = async (req, res) => {
  return res.status(501).json({ message: "Not implemented. Use session or localStorage client-side." });
};

// Sign out user
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
