//Aidan's code
import { getDatabase, ref, push, get, child } from 'firebase/database';
import { app } from '../config/db.js';

const db = getDatabase(app);

//POST /api/chat/send
export const sendMessage = async (req, res) => {
  const { location, sender, text } = req.body;

  //Check if any fields are missing
  if (!location || !sender || !text){
    return res.status(400).json({ message: 'Missing fields' });
  }

  try{
    const chatRef = ref(db, `chats/${location}`);
    await push(chatRef, {
      sender,
      text,
      timestamp: Date.now(),
    });

    return res.status(200).json({ message: 'Message sent' });
  }catch (err){
    return res.status(500).json({ message: 'Failed to send message', error: err.message });
  }
};

//GET /api/chat/:location
export const getMessages = async (req, res) => {
  const { location } = req.params;

  //Check if any fields are missing
  if (!location){
    return res.status(400).json({ message: 'Location is required' });
  }

  try{
    const snapshot = await get(ref(db, `chats/${location}`));
    const messages = [];

    if (snapshot.exists()) {
      const data = snapshot.val();
      for (const key in data) {
        messages.push(data[key]);
      }
    }

    return res.status(200).json({ messages });
  }catch (err){
    return res.status(500).json({ message: 'Failed to fetch messages', error: err.message });
  }
};
