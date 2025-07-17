import React, { useEffect, useState } from 'react';

const NotificationPopup = () => {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const hasAsked = localStorage.getItem('askedNotification');
    if (!hasAsked && Notification.permission !== 'granted') {
      setShown(true);
      localStorage.setItem('askedNotification', 'yes');
    }
  }, []);

  const requestPermission = () => {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        new Notification('🔔 Notifications enabled!', {
          body: 'You will receive replies from X MAN instantly.',
          icon: '/hint2.jpg'
        });
      }
      setShown(false);
    });
  };

  if (!shown) return null;

  return (
    <div className="popup-backdrop">
      <div className="popup-content notification-box">
        <h2>🔔 Enable Notifications</h2>
        <p>To receive real-time replies from the developer (X MAN), please allow browser notifications.</p>
        <button onClick={requestPermission}>Allow Notifications</button>
      </div>
    </div>
  );
};

export default NotificationPopup;