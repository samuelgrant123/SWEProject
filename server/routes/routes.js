import express from 'express';
import { login, signup, signOutUser, updateUserName } from '../handlers/userAuthHandlers.js';
import { postUserData, getUserLocation, updateUserLocation, getAllUserData, deleteUserData } from '../handlers/userHandlers.js';
import { sendMessage, getMessages } from '../handlers/chatHandlers.js';

const router = express.Router();

//User auth endpoints
router.post('/auth/login', login);
router.post('/auth/signup', signup);
router.delete('/auth/signout', signOutUser);

//User data endpoints
router.post('/user/post', postUserData);
router.get('/user/getLocation/:email', getUserLocation);
router.patch('/user/updateLocation/:email/:newLocation', updateUserLocation);
router.patch('/user/updateName/:email/:newName', updateUserName);
router.get('/user/getAllData/:email', getAllUserData);
router.delete('/user/delete/:email', deleteUserData);

//User chat endpoints
router.post('/chat/send', sendMessage);
router.get('/chat/:location', getMessages);

export default router;
