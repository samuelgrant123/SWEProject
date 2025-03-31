import firebase from 'firebase/compat/app';
import db from './server/config/db.js';
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";

//Method to get user data based on id
export const getUserData = async (req, res) => {
    const {firstname, lastname} = req.query;

    try{
        const firebaseDocument = doc(db, "users", firstname + " " + lastname);
        const documentSnapshot = await getDoc(firebaseDocument);

        if (documentSnapshot.exists()){
            res.json({
                id: docSnap.id, 
                ...docSnap.data() 
            }); 
        }else{
            return res.status(404).json({
                error: "Document not found"
            });
        }

    }catch{
        return res.status(500).json({
            error: "Error retrieving document"
        });
    }
};

//Method to create a new user
export const postUserData = async (req, res) => {
    try{
        const { firstname, lastname, username, password } = req.body;
        if (!firstname || !lastname || !username || !password) {
            return res.status(400).json({error: "Data not in all fields"});
        }
        const userData = {
            firstname,
            lastname,
            username,
            password
        };

        await setDoc(doc(db, "users", firstname +  " " + lastname), userData);

        return res.status(200).json({message: "New user successfully created", data: userData});
    }catch (error){
        return res.status(500).json({message: "User data not created", error: error.message});
    }
};

//Method for updating user data
export const updateUserData = async (req, res) => {
   try{
        const { firstname, lastname, password } = req.query;
        if (!firstname || !lastname || !password){
            return res.status(400).send("Not enough parameters");
        } 

        const userRef = doc(db, "users", firstname + " " + lastname);
        await updateDoc(userRef, {password: password});
        return res.status(200).json({message: "User updated successfully"});
    }catch (error){
        return res.status(500).json({message: "User updating unsucessful", error: error.message});
    }
  
};

//Method for deleting user data
export const deleteUserData = async (req, res) => {
    try{
        const {firstname, lastname} = req.query;
        const user = firstname + " " + lastname; // The document ID of the user
        const userRef = doc(db, "users", user); // Reference to the document

        await deleteDoc(userRef);
        return res.status(200).json({message: "User deleted successfully"});
    }catch (error){
        return res.status(500).json({message: "Usere deletion unsucessful", error: error.message});
    }
};