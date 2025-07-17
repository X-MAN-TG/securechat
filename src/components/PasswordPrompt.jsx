import React, { useEffect, useState } from 'react';

const PasswordPrompt = ({ onSubmit, onClose }) => {
  const [password, setPassword] = useState('');
  const [hint, setHint] = useState('');

  useEffect(() => {
    // Randomly select one of the hint images
    const hints = ['/hint1.jpg', '/hint2.jpg', '/hint3.jpg'];
    const randomHint = hints[Math.floor(Math.random() * hints.length)];
    setHint(randomHint);
  }, []);

  const handleSubmit = () => {
    onSubmit(password);
  };

  return (
    <div className="popup-backdrop">
      <div className="popup-content">
        <h2>🔒 Enter Password</h2>
        <p>Enter the password to send your message. Refer to the hint below:</p>
        {hint && (
          <div className="hint-section">
            <div className="hint-image">
              <img src={hint} alt="Password hint" />
            </div>
          </div>
        )}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
          <button onClick={handleSubmit}>Submit</button>
          <button onClick={onClose} style={{ backgroundColor: '#dc2626' }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordPrompt;
