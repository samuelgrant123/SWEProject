// server/routes/routes.js
import express from 'express';
import {
  login, signup, getUser, signOutUser, updateUserName
} from '../handlers/userAuthHandlers.js';
import {
  postUserData, getUserLocation, updateUserLocation, getAllUserData, deleteUserData
} from '../handlers/userHandlers.js';
import { sendMessage, getMessages } from '../handlers/chatHandlers.js';

const router = express.Router(); // ✅ this must come first!

// Auth routes
router.post('/auth/login', login);
router.post('/auth/signup', signup);
router.get('/auth/user', getUser);
router.delete('/auth/signout', signOutUser);

// User routes
router.post('/user/post', postUserData);
router.get('/user/getLocation/:email', getUserLocation);
router.patch('/user/updateLocation/:email/:newLocation', updateUserLocation);
router.patch('/user/updateName/:email/:newName', updateUserName);
router.get('/user/getAllData/:email', getAllUserData);
router.delete('/user/delete/:firstname/:lastname', deleteUserData);

// Chat routes
router.post('/chat/send', sendMessage);
router.get('/chat/:location', getMessages);

export default router;
