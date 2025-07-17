import React, { useState, useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import PasswordPrompt from './PasswordPrompt';

const ChatBox = ({ name, sessionId, messages, replies, onSend, onReply }) => {
  const [input, setInput] = useState('');
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [pendingMessage, setPendingMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const messageEndRef = useRef(null);

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:3000/ws?session=${sessionId}`);
    ws.onmessage = e => {
      try {
        const data = JSON.parse(e.data);
        if (data.type === 'reply') {
          onReply(data.payload);
        }
      } catch (err) {
        console.error('Error parsing message:', err);
      }
    };
    ws.onopen = () => console.log('WebSocket connected');
    ws.onclose = () => console.warn('WebSocket disconnected');

    setSocket(ws);
    return () => ws.close();
  }, [sessionId]);

  const handleSendClick = () => {
    if (input.trim() !== '') {
      setPendingMessage(input);
      setShowPasswordPrompt(true);
    }
  };

  const handlePasswordSubmit = async password => {
    const payload = {
      name,
      message: pendingMessage,
      password,
      sessionId,
    };

    try {
      const res = await fetch('/api/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        onSend({ text: pendingMessage, timestamp: new Date().toISOString() });
      }
    } catch (err) {
      console.error('Message sending failed:', err);
    }

    setPendingMessage('');
    setInput('');
    setShowPasswordPrompt(false);
  };

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, replies]);

  return (
    <div className="chatbox">
      <div className="messages">
        {messages.map((msg, idx) => (
          <MessageBubble key={`m-${idx}`} sender="client" text={msg.text} timestamp={msg.timestamp} />
        ))}
        {replies.map((rep, idx) => (
          <MessageBubble key={`r-${idx}`} sender="admin" text={rep.text} timestamp={rep.timestamp} />
        ))}
        <div ref={messageEndRef} />
      </div>

      <div className="input-area">
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button onClick={handleSendClick}>Send</button>
      </div>

      {showPasswordPrompt && (
        <PasswordPrompt
          onSubmit={handlePasswordSubmit}
          onClose={() => setShowPasswordPrompt(false)}
        />
      )}
    </div>
  );
};

export default ChatBox;