import React, { useState, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import NotificationPopup from './NotificationPopup';

const ChatBox = () => {
  const [messages, setMessages] = useState(() => {
    const stored = localStorage.getItem('messages');
    return stored ? JSON.parse(stored) : [];
  });

  const [message, setMessage] = useState('');
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    localStorage.setItem('messages', JSON.stringify(messages));
  }, [messages]);

  const sendToTelegram = async (msg, pwd) => {
    try {
      await fetch('/api/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: msg, password: pwd, name })
      });
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2500);
    } catch (err) {
      console.error('Telegram Error:', err);
    }
  };

  const handleSend = () => {
    if (!message.trim()) return;
    setShowPasswordPopup(true);
  };

  const confirmSend = () => {
    const newMsg = {
      text: message,
      sender: 'client',
      timestamp: new Date().toISOString()
    };
    setMessages([...messages, newMsg]);
    sendToTelegram(message, password);
    setMessage('');
    setPassword('');
    setShowPasswordPopup(false);
  };

  return (
    <div id="chatContainer">
      <div id="chatBox">
        {messages.map((msg, i) => (
          <MessageBubble key={i} {...msg} />
        ))}
      </div>

      <div style={{ display: 'flex', padding: '8px' }}>
        <input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={e => setMessage(e.target.value)}
          id="messageInput"
        />
        <button id="sendMessage" onClick={handleSend}>Send</button>
      </div>

      {showPasswordPopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>Enter password</h3>
            <div id="hintContainer">
              <img src="/hint1.jpg" alt="hint1" />
              <img src="/hint2.jpg" alt="hint2" />
              <img src="/hint3.jpg" alt="hint3" />
            </div>
            <input
              type="password"
              placeholder="Password..."
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <input
              type="text"
              placeholder="Enter your name..."
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <button onClick={confirmSend}>Submit</button>
          </div>
        </div>
      )}

      {showPopup && <NotificationPopup text="✅ Message sent" />}
    </div>
  );
};

export default ChatBox;
