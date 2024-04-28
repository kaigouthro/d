import React from 'react';

export function playNotificationSound() {
    const notificationSound = new Audio('/sounds/notification.mp3');
    notificationSound.play();
}

export function showNotification(title: string, options: NotificationOptions) {
    if (Notification.permission === "granted") {
      new Notification(title, options);
    }
}

export const NotificationSoundButton: React.FC = () => {

  return <button onClick={playNotificationSound}>Play Notification Sound</button>;
};