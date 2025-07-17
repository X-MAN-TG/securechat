import React from 'react';
import '../../style.css';

const MessageBubble = ({ sender, text, timestamp }) => {
  const formattedTime = new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className={`bubble-wrapper ${sender === 'client' ? 'right' : 'left'}`}>
      <div className={`bubble ${sender}`}>
        <span className="bubble-text">{text}</span>
        <span className="bubble-time">{formattedTime}</span>
      </div>
    </div>
  );
};

export default MessageBubble;
