import express from 'express';
import { getUserData, postUserData, deleteUserData, updateUserData } from '../handlers/userHandlers.js';

const router = express.Router();

router.get('/user/get/:firstname/:lastname', getUserData);
router.post('/user/post', postUserData);
router.patch('/user/update/:firstname/:lastname/:password', updateUserData);
router.delete('/user/delete/:firstname/:lastname', getUserData);

export default router;