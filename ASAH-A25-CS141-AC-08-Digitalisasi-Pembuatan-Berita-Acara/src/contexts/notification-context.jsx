import React, { createContext, useContext, useState } from 'react';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'approval',
      title: 'BAPB-XYZ-234 membutuhkan persetujuan',
      time: '2 jam yang lalu',
      description: 'Dokumen dari PT. Jaya Abadi menunggu review',
      read: false,
      documentId: 'BAPB-XYZ-234',
      actions: ['Review']
    },
    {
      id: 2,
      type: 'approved',
      title: 'BAPP-ABC-235 telah disetujui',
      time: '5 jam yang lalu',
      description: 'Direksi telah menyetujui dokumen Anda',
      read: false,
      documentId: 'BAPP-ABC-235',
      actions: ['Lihat Dokumen']
    },
    {
      id: 3,
      type: 'system',
      title: 'Maintenance System',
      time: '1 hari yang lalu',
      description: 'Akan ada maintenance system pada 25 Okt 2024',
      read: true,
      actions: []
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      read: false,
      time: 'Baru saja',
      ...notification
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const value = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    addNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
