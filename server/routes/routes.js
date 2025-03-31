import express from 'express';
import { getUserData, postUserData, deleteUserData, updateUserData } from '../handlers/userHandlers.js';
import { getArticleData } from '../handlers/dataHandlers.js';
import { getWeatherAPIData } from '../handlers/weatherHandlers.js';

const router = express.Router();

//The user functions
router.get('/user/get/:firstname/:lastname', getUserData);
router.post('/user/post', postUserData);
router.patch('/user/update/:firstname/:lastname/:password', updateUserData);
router.delete('/user/delete/:firstname/:lastname', getUserData);

//Data functions
router.get('/info/get', getArticleData);

//Weather API functions
router.get('/weather/get', getWeatherAPIData);

export default router;