// client/src/components/ChatBoard.jsx
import React, { useEffect, useState, useRef } from 'react';
import { getDatabase, ref, onChildAdded, push } from 'firebase/database';
import { auth } from '../Firebase';
import './ChatBoard.css';

export default function ChatBoard() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const db = getDatabase();
  const userLocation = localStorage.getItem('userLocation') || 'Unknown';
  const locationKey = userLocation.replace(/\s+/g, '_');
  const username = auth.currentUser?.displayName || 'Guest';
  const messagesRef = useRef(null);

  useEffect(() => {
    const chatRef = ref(db, `chats/${locationKey}`);
    messagesRef.current = [];

    const unsubscribe = onChildAdded(chatRef, (snapshot) => {
      const msg = snapshot.val();
      // Avoid adding duplicates
      if (!messagesRef.current.some(m => m.timestamp === msg.timestamp && m.text === msg.text)) {
        messagesRef.current.unshift(msg); // newest first
        setMessages([...messagesRef.current]);
      }
    });

    return () => {
      // Firebase doesn't expose an offChildAdded so we reset manually
      messagesRef.current = [];
    };
  }, [locationKey]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const chatRef = ref(db, `chats/${locationKey}`);
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
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
