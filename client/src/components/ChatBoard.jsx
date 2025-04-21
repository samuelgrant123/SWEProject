import React, { useEffect, useState, useRef } from 'react';
import { getDatabase, ref, onChildAdded, push } from 'firebase/database';
import './ChatBoard.css';
import { getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';

// Firebase configuration for Realtime Database
const firebaseConfig = {
  apiKey: "AIzaSyDCxdecZb3qufue6W179YBcvJDsxtDTi9k",
  authDomain: "disasterdash-a77b2.firebaseapp.com",
  projectId: "disasterdash-a77b2",
  storageBucket: "disasterdash-a77b2.appspot.com",
  messagingSenderId: "329859835226",
  appId: "1:329859835226:web:b297bc78714128a6a97f63",
  measurementId: "G-NNP2R9MN4D",
  databaseURL: "https://disasterdash-a77b2-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

export default function ChatBoard() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const userLocation = localStorage.getItem('userLocation') || 'Unknown';
  const locationKey = userLocation.replace(/\s+/g, '_');
  const username = localStorage.getItem('userDisplayName') || 'User';
  const messagesRef = useRef([]);

  useEffect(() => {
    const chatRef = ref(db, `chats/${locationKey}`);
    messagesRef.current = [];

    // Listen for new chat messages in this location
    const unsubscribe = onChildAdded(chatRef, (snapshot) => {
      const msg = snapshot.val();

      // Prevent duplicates from being added
      const exists = messagesRef.current.some(
        (m) => m.timestamp === msg.timestamp && m.text === msg.text
      );

      if (!exists) {
        messagesRef.current.unshift(msg); // add to top
        setMessages([...messagesRef.current]);
      }
    });

    // Cleanup on unmount
    return () => {
      messagesRef.current = [];
    };
  }, [locationKey]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const chatRef = ref(db, `chats/${locationKey}`);

    // Push new message to Realtime Database
    await push(chatRef, {
      text: input.trim(),
      sender: username,
      timestamp: Date.now()
    });

    setInput('');
  };

  return (
    <div className="chat-container">
      <h2>Chat Room – {userLocation}</h2>
      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className="chat-message">
            <div className="chat-header">
              <span className="chat-sender">{msg.sender}</span>
              <span className="chat-time">
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
            <div className="chat-text">{msg.text}</div>
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className="chat-form">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
