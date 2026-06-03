import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const AppContext = createContext();
const BACKEND = 'http://localhost:5000';

export function AppProvider({ children }) {
  const [threats,       setThreats]       = useState([]);
  const [normalCount,   setNormalCount]   = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount,   setUnreadCount]   = useState(0);
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [activeModal,   setActiveModal]   = useState(null);
  const [timeFilter,    setTimeFilter]    = useState('All');
  const [connected,     setConnected]     = useState(false);
  const [stats,         setStats]         = useState({ total: 0, high: 0, medium: 0, low: 0, byType: {} });
  const [httpCodes,     setHttpCodes]     = useState([
    { code: 200, label: 'OK',                    color: '#2ED573', value: 0 },
    { code: 404, label: 'Not Found',             color: '#7C6FF7', value: 0 },
    { code: 403, label: 'Forbidden',             color: '#FFB020', value: 0 },
    { code: 500, label: 'Internal Server Error', color: '#FF4757', value: 0 },
  ]);

  const pendingModal = useRef(null);


  useEffect(() => {
    try {
      const savedNotifs = localStorage.getItem('mel_notifications');
      if (savedNotifs) setNotifications(JSON.parse(savedNotifs));
      const savedUnread = localStorage.getItem('mel_unread');
      if (savedUnread) setUnreadCount(parseInt(savedUnread, 10));
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem('mel_notifications', JSON.stringify(notifications)); } catch {}
  }, [notifications]);

  useEffect(() => {
    try { localStorage.setItem('mel_unread', String(unreadCount)); } catch {}
  }, [unreadCount]);


  useEffect(() => {
    fetch(`${BACKEND}/api/threats`)
      .then(r => r.json())
      .then(data => {
        if (data.threats) {
          const sorted = data.threats.slice().reverse();
          setThreats(sorted);
          const counts = { 200: 0, 403: 0, 404: 0, 500: 0 };
          data.threats.forEach(t => {
            if (counts[t.statusCode] !== undefined) counts[t.statusCode]++;
          });
          setHttpCodes(prev => prev.map(c => ({ ...c, value: counts[c.code] || 0 })));
        }
      })
      .catch(console.error);

    fetch(`${BACKEND}/api/threats/stats`)
      .then(r => r.json())
      .then(data => setStats(data))
      .catch(console.error);

    fetch(`${BACKEND}/api/normal/count`)
      .then(r => r.json())
      .then(data => setNormalCount(data.count || 0))
      .catch(console.error);
  }, []);

  // Show modal from pendingModal ref
  useEffect(() => {
    if (pendingModal.current) {
      setActiveModal(pendingModal.current);
      pendingModal.current = null;
    }
  });

  // Socket connection
  useEffect(() => {
    const socket = io(BACKEND, { transports: ['websocket'] });

    socket.on('connect',    () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));

    socket.on('new_threat', (threat) => {
      console.log('🚨 new_threat received:', threat);

      setThreats(prev => [threat, ...prev]);

      setStats(prev => ({
        ...prev,
        total: prev.total + 1,
        [threat.severity?.toLowerCase()]: (prev[threat.severity?.toLowerCase()] || 0) + 1,
        byType: {
          ...prev.byType,
          [threat.type]: (prev.byType?.[threat.type] || 0) + 1,
        }
      }));

      setHttpCodes(prev => prev.map(c =>
        c.code === (threat.statusCode || 200) ? { ...c, value: c.value + 1 } : c
      ));

      setNotifications(prev => [{
        ...threat,
        read:    false,
        notifId: Date.now() + Math.random(),
      }, ...prev].slice(0, 50));

      setUnreadCount(prev => prev + 1);

      if (alertsEnabled) {
        pendingModal.current = threat;
        setActiveModal(null); // clear first, useEffect above will set new one
      }
    });

    socket.on('normal_count', (count) => {
      setNormalCount(count);
    });

    return () => socket.disconnect();
  }, [alertsEnabled]);

  const filteredThreats = threats.filter(t => {
    if (timeFilter === 'All') return true;
    const now        = Date.now();
    const threatTime = new Date(t.timestamp).getTime();
    const ranges = {
      '1 hr':   1  * 60 * 60 * 1000,
      '1 Day':  24 * 60 * 60 * 1000,
      '1 Week': 7  * 24 * 60 * 60 * 1000,
    };
    return now - threatTime <= ranges[timeFilter];
  });

  const filteredStats = {
    total:  filteredThreats.length,
    high:   filteredThreats.filter(t => t.severity === 'high').length,
    medium: filteredThreats.filter(t => t.severity === 'medium').length,
    low:    filteredThreats.filter(t => t.severity === 'low').length,
    byType: filteredThreats.reduce((acc, t) => {
      acc[t.type] = (acc[t.type] || 0) + 1;
      return acc;
    }, {}),
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const closeModal = () => setActiveModal(null);

  return (
    <AppContext.Provider value={{
      threats,
      filteredThreats,
      filteredStats,
      httpCodes,
      normalCount,
      connected,
      notifications,
      unreadCount,
      markAllRead,
      alertsEnabled,
      setAlertsEnabled,
      activeModal,
      setActiveModal,
      closeModal,
      timeFilter,
      setTimeFilter,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);