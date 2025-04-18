import express from 'express';
import { getAllUserData, postUserData, deleteUserData, updateUserLocation, getUserLocation } from '../handlers/userHandlers.js';
import { signup, login, getUser, signOutUser } from '../handlers/userAuthHandlers.js';

const router = express.Router();

//Authentication functions
router.post('/auth/login', login);
router.post('/auth/signup', signup);
router.get('/auth/user', getUser);
router.delete('/auth/signout', signOutUser);

//The user functions
router.post('/user/post', postUserData);
router.get('/user/getLocation/:email', getUserLocation);
router.patch('/user/updateLocation/:email/:newLocation', updateUserLocation);
router.get('/user/getAllData/:email', getAllUserData);

//Extra user functions - not currently being used
router.delete('/user/delete/:firstname/:lastname', deleteUserData);

export default router;