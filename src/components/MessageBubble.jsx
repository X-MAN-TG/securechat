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
        <div className="bubble-header">
          <span className="bubble-sender">{sender === 'client' ? 'You' : 'X MAN'}</span>
          <span className="bubble-time">{formattedTime}</span>
        </div>
        <div className="bubble-body">
          <span className="bubble-text">{text}</span>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
