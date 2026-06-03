'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/router';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Avatar,
  Switch,
  Badge,
} from '@mui/material';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import LogoutIcon from '@mui/icons-material/Logout';
import { useApp } from '../../context/AppContext';

const timeFilters = ['1 hr', '1 Day', '1 Week', 'All'];

const shortType = (type = '') => {
  if (type.includes('DDoS')) return 'DDoS';
  if (type.includes('NoSQL')) return 'NoSQLi';
  if (type.includes('SQL Injection')) return 'SQLi';
  if (type.includes('XSS') || type.includes('Cross-Site')) return 'XSS';
  if (type.includes('SSRF')) return 'SSRF';
  if (type.includes('Command')) return 'CMDi';
  if (type.includes('Path')) return 'Path';
  if (type.includes('Local File')) return 'LFI';
  if (type.includes('XXE')) return 'XXE';
  return type.slice(0, 6);
};

const severityColor = (s) => {
  if (!s) return '#A0A3B1';
  if (s === 'high') return '#FF4757';
  if (s === 'medium') return '#FFB020';
  return '#2ED573';
};

export default function TopBar() {
  const router = useRouter();
  const {
    notifications,
    unreadCount,
    alertsEnabled,
    setAlertsEnabled,
    timeFilter,
    setTimeFilter,
    markAllRead,
    setActiveModal,
  } = useApp();

  const [name, setName] = useState('Admin');
  const [mounted, setMounted] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('just now');
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    const u = localStorage.getItem('user');
    if (u) {
      try {
        const parsed = JSON.parse(u);
        setName(parsed.name || 'Admin');
      } catch {
        setName('Admin');
      }
    }
  }, []);

  const latestAttackTime = useMemo(() => {
    if (!notifications || notifications.length === 0) return null;
    return Math.max(...notifications.map((n) => new Date(n.timestamp).getTime()));
  }, [notifications]);

  useEffect(() => {
    const updateLastUpdated = () => {
      if (!latestAttackTime) {
        setLastUpdated('No attacks yet');
        return;
      }
      const secs = Math.floor((Date.now() - latestAttackTime) / 1000);
      if (secs < 60) setLastUpdated(`${secs} secs ago`);
      else if (secs < 3600) setLastUpdated(`${Math.floor(secs / 60)} mins ago`);
      else if (secs < 86400) setLastUpdated(`${Math.floor(secs / 3600)} hrs ago`);
      else setLastUpdated(`${Math.floor(secs / 86400)} days ago`);
    };

    updateLastUpdated();
    const interval = setInterval(updateLastUpdated, 1000);
    return () => clearInterval(interval);
  }, [latestAttackTime]);

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleNotifOpen = () => {
    setNotifOpen((prev) => !prev);
    setProfileOpen(false);
    if (!notifOpen) markAllRead();
  };

  const handleProfileOpen = () => {
    setProfileOpen((prev) => !prev);
    setNotifOpen(false);
  };

  const handleLogout = () => {
    router.push('/');
  };

  if (!mounted) return null;

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{ backgroundColor: '#0F1123', borderBottom: '1px solid #1E2235' }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: 2, minHeight: '52px !important' }}>
        <Typography sx={{ color: '#A0A3B1', fontSize: '0.8rem' }}>
          Last Updated {lastUpdated}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {timeFilters.map((t) => (
            <Typography
              key={t}
              onClick={() => setTimeFilter(t)}
              sx={{
                fontSize: '0.78rem',
                cursor: 'pointer',
                color: timeFilter === t ? '#ffffff' : '#A0A3B1',
                backgroundColor: timeFilter === t ? '#2A2D3E' : 'transparent',
                px: 1.2,
                py: 0.4,
                borderRadius: '6px',
                fontWeight: timeFilter === t ? 700 : 400,
                transition: 'all 0.2s',
                '&:hover': { color: '#ffffff', backgroundColor: '#2A2D3E' },
              }}
            >
              {t}
            </Typography>
          ))}

          <Box ref={notifRef} sx={{ position: 'relative' }}>
            <IconButton onClick={handleNotifOpen} sx={{ color: '#A0A3B1', p: 0.5 }}>
              <Badge
                badgeContent={unreadCount}
                color="error"
                sx={{ '& .MuiBadge-badge': { fontSize: '0.6rem', minWidth: 16, height: 16 } }}
              >
                <NotificationsNoneIcon fontSize="small" />
              </Badge>
            </IconButton>

            {notifOpen && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  width: 360,
                  backgroundColor: '#1E2235',
                  border: '1px solid #2A2D3E',
                  borderRadius: '12px',
                  zIndex: 1000,
                  overflow: 'hidden',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                }}
              >
                <Box
                  sx={{
                    px: 2,
                    py: 1.5,
                    borderBottom: '1px solid #2A2D3E',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Typography sx={{ color: '#ffffff', fontWeight: 700, fontSize: '0.9rem' }}>
                    Notifications
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography sx={{ color: '#A0A3B1', fontSize: '0.72rem' }}>Alert popup</Typography>
                    <Switch
                      size="small"
                      checked={alertsEnabled}
                      onChange={(e) => setAlertsEnabled(e.target.checked)}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': { color: '#7C6FF7' },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#7C6FF7' },
                      }}
                    />
                  </Box>
                </Box>

                <Box sx={{ maxHeight: 380, overflowY: 'auto' }}>
                  {notifications.length === 0 ? (
                    <Box sx={{ py: 4, textAlign: 'center' }}>
                      <Typography sx={{ color: '#A0A3B1', fontSize: '0.82rem' }}>
                        No notifications yet
                      </Typography>
                    </Box>
                  ) : (
                    notifications.map((notif) => (
                      <Box
                        key={notif.notifId}
                        onClick={() => {
                          setActiveModal(notif);
                          setNotifOpen(false);
                        }}
                        sx={{
                          px: 2,
                          py: 1.5,
                          borderBottom: '1px solid #2A2D3E',
                          backgroundColor: notif.read ? 'transparent' : 'rgba(124,111,247,0.05)',
                          display: 'flex',
                          gap: 1.5,
                          alignItems: 'flex-start',
                          '&:hover': { backgroundColor: '#252840' },
                          cursor: 'pointer',
                        }}
                      >
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            backgroundColor: severityColor(notif.severity),
                            mt: 0.6,
                            flexShrink: 0,
                          }}
                        />
                        <Box sx={{ flex: 1 }}>
                          <Typography sx={{ color: '#ffffff', fontSize: '0.82rem', fontWeight: 600 }}>
                            {shortType(notif.type)} detected
                          </Typography>
                          <Typography sx={{ color: '#A0A3B1', fontSize: '0.72rem', mt: 0.2 }}>
                            {notif.server || 'Server 1'} · {notif.target || '—'}
                          </Typography>
                          <Typography sx={{ color: '#5C5F7A', fontSize: '0.68rem', mt: 0.2 }}>
                            {new Date(notif.timestamp).toLocaleTimeString()}
                          </Typography>
                        </Box>
                        {!notif.read && (
                          <Box
                            sx={{
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              backgroundColor: '#7C6FF7',
                              mt: 0.8,
                              flexShrink: 0,
                            }}
                          />
                        )}
                      </Box>
                    ))
                  )}
                </Box>
              </Box>
            )}
          </Box>

          <Box
            ref={profileRef}
            sx={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}
            onClick={handleProfileOpen}
          >
            <Typography sx={{ color: '#ffffff', fontWeight: 600, fontSize: '0.85rem' }}>
              {name}
            </Typography>
            <Avatar src="/avatar.jpg" sx={{ width: 32, height: 32, backgroundColor: '#7C6FF7' }} />

            {profileOpen && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  width: 180,
                  backgroundColor: '#1E2235',
                  border: '1px solid #2A2D3E',
                  borderRadius: '10px',
                  zIndex: 1000,
                  overflow: 'hidden',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                }}
              >
                <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #2A2D3E' }}>
                  <Typography sx={{ color: '#ffffff', fontWeight: 700, fontSize: '0.85rem' }}>
                    {name}
                  </Typography>
                </Box>
                <Box
                  onClick={handleLogout}
                  sx={{
                    px: 2,
                    py: 1.2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: '#252840' },
                  }}
                >
                  <LogoutIcon sx={{ fontSize: 16, color: '#FF4757' }} />
                  <Typography sx={{ color: '#FF4757', fontSize: '0.82rem', fontWeight: 600 }}>
                    Logout
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}