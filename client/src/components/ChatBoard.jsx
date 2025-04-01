import React, { useState, useEffect } from 'react';

export default function ChatBoard({ onNavigate }) {
  // Load messages from localStorage
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('chatMessages');
    return saved ? JSON.parse(saved) : [];
  });

  const [input, setInput] = useState('');
  const [tag, setTag] = useState('safe');

  // Save messages to localStorage every time they change
  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage = {
      id: Date.now(),
      text: input,
      tag,
    };

    setMessages([newMessage, ...messages]);
    setInput('');
  };

  const getTagStyle = (tag) => {
    switch (tag) {
      case 'safe':
        return { backgroundColor: '#4caf50', color: 'white' }; // green
      case 'help':
        return { backgroundColor: '#f44336', color: 'white' }; // red
      case 'offer':
        return { backgroundColor: '#2196f3', color: 'white' }; // blue
      default:
        return {};
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Community Board</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <textarea
          rows="3"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ width: '100%', padding: '10px' }}
        />
        <div style={{ marginTop: '10px' }}>
          <label>
            <input
              type="radio"
              name="tag"
              value="safe"
              checked={tag === 'safe'}
              onChange={() => setTag('safe')}
            /> Safe
          </label>
          <label style={{ marginLeft: '10px' }}>
            <input
              type="radio"
              name="tag"
              value="help"
              checked={tag === 'help'}
              onChange={() => setTag('help')}
            /> Need Help
          </label>
          <label style={{ marginLeft: '10px' }}>
            <input
              type="radio"
              name="tag"
              value="offer"
              checked={tag === 'offer'}
              onChange={() => setTag('offer')}
            /> Offering Help
          </label>
        </div>
        <button type="submit" style={{ marginTop: '10px' }}>
          Post Message
        </button>
      </form>

      <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
        {messages.map((msg) => (
          <li
            key={msg.id}
            style={{
              ...getTagStyle(msg.tag),
              padding: '10px',
              marginBottom: '10px',
              borderRadius: '5px',
            }}
          >
            <strong>[{msg.tag.toUpperCase()}]</strong> {msg.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
