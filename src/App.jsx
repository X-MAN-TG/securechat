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
    // Generate or restore persistent session
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
      <div className="popup-backdrop">
        <div className="popup-content">
          <h2>✨ Welcome to Project X</h2>
          <p>A highly encrypted two-way communication portal.<br />Your identity is safe.</p>
          <input
            type="text"
            placeholder="Enter your name:"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <button onClick={handleStart}>Start chatting</button>

          <div className="info-block">
            <h3>Project X Chat</h3>
            <p><b>What is this project for?</b><br />
            This is a project X chat Developed and crafted with love For his lost friend. This is a 2 way highly protected live chat feed online platform</p>

            <p><b>Purpose of X Chat?</b><br />
            There are some misunderstandings and problems between client and Developer X MAN. He has some doubts and questions. To solve this is the most protected 2 way interface.</p>

            <p><b>Privacy and data?</b><br />
            None of your data is saved, all data is encrypted and secure</p>

            <p><b>How to use?</b><br />
            Just Type your message or hello like on other platforms and the message will be Dilevered to X MAN</p>

            <p>For more info request Dev.</p>
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
        🛠 Developed by <a href="https://t.me/Mr_Panda_Boy" target="_blank" rel="noopener noreferrer">X MAN</a> for his lost friend
      </div>
    </div>
  );
};

export default App;