import { db } from '../config/db.js'
import { doc, getDoc, setDoc, deleteDoc, updateDoc } from "firebase/firestore";

//Method to create a new user
export const postUserData = async (req, res) => {
    try{
        const { firstName, lastName, email, password } = req.body;
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({error: "Data not in all fields"});
        }
        const location = "Gainesville, Florida";
        const userData = {
            firstName,
            lastName,
            email,
            password,
            location
        };

        await setDoc(doc(db, "users", email), userData);
        console.log("New user successfully created in database");
        return res.status(200).json({message: "New user successfully created", data: userData});
    }catch (error){
        return res.status(500).json({message: "User data not created", error: error.message});
    }
};

//Method for getting user location
export const getUserLocation = async (req, res) => {
    const {email} = req.params;
    try{
        const firebaseDocument = doc(db, "users", email);
        const documentSnapshot = await getDoc(firebaseDocument);

        if (documentSnapshot.exists()){
            const data = documentSnapshot.data();
            res.json({
                location: data.location
            }); 
        }else{
            return res.status(404).json({
                error: "Location of user not found"
            });
        }
    }catch{
        return res.status(500).json({
            error: "Error retrieving user location"
        });
    }
};

//Method for updating user location
export const updateUserLocation = async (req, res) => {
   try{
        const { email, newLocation } = req.params;

        if (!newLocation){
            return res.status(400).send("No location in body");
        } 
        if (!email){
            return res.status(400).send("No email in paramter");
        } 

        const userRef = doc(db, "users", email);
        await updateDoc(userRef, {location: newLocation});
        return res.status(200).json({message: "User updated successfully"});
    }catch (error){
        return res.status(500).json({message: "User updating unsucessful", error: error.message});
    }
};

//Method to get user data based on first and last name
export const getAllUserData = async (req, res) => {
    const {email} = req.params;
    try{
        const firebaseDocument = doc(db, "users", email);
        const documentSnapshot = await getDoc(firebaseDocument);

        if (documentSnapshot.exists()){
            res.json({
                 firstName: documentSnapshot.data().firstName,
                 lastName: documentSnapshot.data().lastName,
                 location: documentSnapshot.data().location
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

//Method for deleting user data (don't necessarily need this)
export const deleteUserData = async (req, res) => {
    try{
        const {firstname, lastname} = req.query;
        const user = firstname + " " + lastname;
        const userRef = doc(db, "users", user);

        await deleteDoc(userRef);
        return res.status(200).json({message: "User deleted successfully"});
    }catch (error){
        return res.status(500).json({message: "Usere deletion unsucessful", error: error.message});
    }
};