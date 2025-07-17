import React, { useState, useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import PasswordPrompt from './PasswordPrompt';

const ChatBox = ({ name, sessionId, messages, replies, onSend, onReply }) => {
  const [input, setInput] = useState('');
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [pendingMessage, setPendingMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const messageEndRef = useRef(null);

  useEffect(() => {
    const ws = new WebSocket(`wss://${window.location.host}/ws?session=${sessionId}`);
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
    return () => ws.close();
  }, [sessionId]);

  const handleSendClick = () => {
    if (input.trim()) {
      setPendingMessage(input);
      setShowPasswordPrompt(true);
    }
  };

  const handlePasswordSubmit = async (password) => {
    setIsSending(true);
    setErrorMsg('');
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
      } else {
        setErrorMsg('❌ Invalid password or failed to send.');
      }
    } catch (err) {
      console.error('Send error:', err);
      setErrorMsg('🚫 Error sending message.');
    } finally {
      setIsSending(false);
      setInput('');
      setPendingMessage('');
      setShowPasswordPrompt(false);
    }
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
          disabled={isSending}
        />
        <button onClick={handleSendClick} disabled={!input.trim() || isSending}>
          {isSending ? 'Sending...' : 'Send'}
        </button>
      </div>

      {errorMsg && <p className="error-text">{errorMsg}</p>}

      {showPasswordPrompt && (
        <PasswordPrompt
          onSubmit={handlePasswordSubmit}
          onClose={() => {
            setShowPasswordPrompt(false);
            setPendingMessage('');
          }}
        />
      )}
    </div>
  );
};

export default ChatBox;
