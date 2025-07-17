import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ChatBox from './components/ChatBox';
import NotificationPopup from './components/NotificationPopup';

const App = () => {
  const [name, setName] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [started, setStarted] = useState(false);
  const [messages, setMessages] = useState([]);
  const [replies, setReplies] = useState([]);

  useEffect(() => {
    let existingSession = sessionStorage.getItem('projectx-session');
    if (!existingSession) {
      existingSession = uuidv4();
      sessionStorage.setItem('projectx-session', existingSession);
    }
    setSessionId(existingSession);
  }, []);

  const handleStart = () => {
    if (name.trim()) {
      setStarted(true);
    }
  };

  const handleSendMessage = (msg) => {
    setMessages(prev => [...prev, msg]);
  };

  const handleReceiveReply = (reply) => {
    setReplies(prev => [...prev, reply]);
  };

  if (!started) {
    return (
      <div className="popup-backdrop gradient-background">
        <div className="popup-content modern-box">
          <h2>✨ Welcome to Project X</h2>
          <p className="subtext">A secure, encrypted chat for special moments.<br />Your identity is safe with us.</p>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <button className="primary-button" onClick={handleStart}>Start chatting</button>

          <div className="info-block">
            <h3>What is this project?</h3>
            <p>This is Project X Chat — a live, encrypted communication platform created with love for a lost friend. It's a two-way protected interface to resolve past misunderstandings.</p>

            <h3>Purpose</h3>
            <p>The client and developer, X MAN, have unresolved questions. This secure chat serves as their bridge.</p>

            <h3>Privacy</h3>
            <p>No data is stored. Everything is encrypted and confidential.</p>

            <h3>How to Use</h3>
            <p>Type your message — it’ll be delivered directly to X MAN. No signups, no tracking.</p>

            <p><i>For more information, contact the developer.</i></p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <NotificationPopup />
      <ChatBox
        name={name}
        sessionId={sessionId}
        messages={messages}
        replies={replies}
        onSend={handleSendMessage}
        onReply={handleReceiveReply}
      />
      <div className="dev-credit">
        🛠 <a href="https://t.me/Mr_Panda_Boy" target="_blank" rel="noopener noreferrer">Developed by X MAN</a> for his lost friend
      </div>
    </div>
  );
};

export default App;
