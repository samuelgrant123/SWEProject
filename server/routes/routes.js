import express from 'express';
import { getUserData, postUserData, deleteUserData, updateUserData } from '../handlers/userHandlers.js';
import { getArticleData } from '../handlers/dataHandlers.js';
import { signup, login, getUser, signOutUser } from '../handlers/userAuthHandlers.js';

const router = express.Router();

//Authentication functions
router.post('/auth/login', login);
router.post('/auth/signup', signup);
router.get('/auth/user', getUser);
router.delete('/auth/signout', signOutUser);

//The user functions
router.get('/user/get/:firstname/:lastname', getUserData);
router.post('/user/post', postUserData);
router.patch('/user/update/:firstname/:lastname/:password', updateUserData);
router.delete('/user/delete/:firstname/:lastname', deleteUserData);

//Data functions
router.get('/info/get', getArticleData);

export default router;