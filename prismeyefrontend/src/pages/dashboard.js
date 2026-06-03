import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import {
  Box, Typography,
  Table, TableBody, TableCell,
  TableContainer, TableHead,
  TableRow, Paper, Chip, IconButton, Tooltip as MuiTooltip
} from '@mui/material';
import { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/router';
import { DashboardLayout } from '../components/layout';
import { StatCard } from '../components/ui';
import SecurityIcon from '@mui/icons-material/Security';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ShieldIcon from '@mui/icons-material/Shield';
import StorageIcon from '@mui/icons-material/Storage';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useApp } from '../context/AppContext';

const BACKEND = 'http://localhost:5000';

const ATTACK_LINES = [
  { key: 'ddos',  label: 'DDoS',   color: '#35a1ff' },
  { key: 'sqli',  label: 'SQLi',   color: '#FF4757' },
  { key: 'xss',   label: 'XSS',    color: '#7C6FF7' },
  { key: 'ssrf',  label: 'SSRF',   color: '#4ECDC4' },
  { key: 'cmd',   label: 'CMDi',   color: '#FF6B35' },
  { key: 'path',  label: 'Path',   color: '#FFB020' },
  { key: 'lfi',   label: 'LFI',    color: '#2ED573' },
  { key: 'nosql', label: 'NoSQLi', color: '#bbe437' },
  { key: 'xxe',   label: 'XXE',    color: '#F8BBD9' },
  { key: 'crlf',  label: 'CRLF',   color: '#e350ad' },
];

const typeToKey = (type = '') => {
  if (type.includes('DDoS'))                                return 'ddos';
  if (type.includes('NoSQL'))                               return 'nosql';
  if (type.includes('SQL Injection'))                       return 'sqli';
  if (type.includes('XSS') || type.includes('Cross-Site')) return 'xss';
  if (type.includes('SSRF'))                                return 'ssrf';
  if (type.includes('Command'))                             return 'cmd';
  if (type.includes('Path'))                                return 'path';
  if (type.includes('Local File'))                          return 'lfi';
  if (type.includes('XXE'))                                 return 'xxe';
  if (type.includes('CRLF'))                                return 'crlf';
  return null;
};

const severityColor = (s) => {
  if (!s) return '#A0A3B1';
  const l = s.toLowerCase();
  if (l === 'high')   return '#FF4757';
  if (l === 'medium') return '#FFB020';
  return '#2ED573';
};

const threatColor = (t) => {
  if (!t) return '#A0A3B1';
  if (t.includes('DDoS'))       return '#35a1ff';
  if (t.includes('NoSQL'))      return '#A29BFE';
  if (t.includes('SQL'))        return '#FF4757';
  if (t.includes('XSS'))        return '#7C6FF7';
  if (t.includes('SSRF'))       return '#4ECDC4';
  if (t.includes('Command'))    return '#FF6B35';
  if (t.includes('Path'))       return '#FFB020';
  if (t.includes('Local File')) return '#2ED573';
  if (t.includes('XXE'))        return '#F8BBD9';
  if (t.includes('CRLF'))       return '#00D2FF';
  return '#A0A3B1';
};

const responseColor = (code) => {
  if (code === 200) return '#2ED573';
  if (code === 404) return '#7C6FF7';
  if (code === 403) return '#FFB020';
  if (code === 500) return '#FF4757';
  return '#A0A3B1';
};

const shortType = (type = '') => {
  if (type.includes('DDoS'))                                return 'DDoS';
  if (type.includes('NoSQL'))                               return 'NoSQLi';
  if (type.includes('SQL Injection'))                       return 'SQLi';
  if (type.includes('XSS') || type.includes('Cross-Site')) return 'XSS';
  if (type.includes('SSRF'))                                return 'SSRF';
  if (type.includes('Command'))                             return 'CMDi';
  if (type.includes('Path'))                                return 'Path';
  if (type.includes('Local File'))                          return 'LFI';
  if (type.includes('XXE'))                                 return 'XXE';
  if (type.includes('CRLF'))                                return 'CRLF';
  return type.slice(0, 8);
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Box sx={{
        backgroundColor: '#2A2D3E',
        border: '1px solid #3A3D4E',
        borderRadius: '8px',
        p: 1.5,
      }}>
        <Typography sx={{ color: '#A78BFA', fontSize: '0.75rem', mb: 0.5 }}>
          {label}
        </Typography>
        {payload.map((entry) => (
          entry.value > 0 && (
            <Typography key={entry.name} sx={{ color: entry.color, fontSize: '0.75rem' }}>
              {entry.name}: {entry.value}
            </Typography>
          )
        ))}
      </Box>
    );
  }
  return null;
};

const OverflowTooltip = ({ value, maxWidth = 120, textSx = {}, placement = 'top' }) => {
  const textRef = useRef(null);
  const [overflowed, setOverflowed] = useState(false);

  const displayValue =
    value === null || value === undefined || value === '' ? '—' : String(value);

  useEffect(() => {
    const checkOverflow = () => {
      if (textRef.current) {
        setOverflowed(textRef.current.scrollWidth > textRef.current.clientWidth);
      }
    };
    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [displayValue]);

  return (
    <MuiTooltip
      title={displayValue}
      placement={placement}
      arrow
      enterDelay={300}
      disableHoverListener={!overflowed}
      disableFocusListener={!overflowed}
      disableTouchListener={!overflowed}
      componentsProps={{
        tooltip: {
          sx: {
            fontSize: '0.75rem',
            px: 1.5, py: 0.8,
            backgroundColor: '#2A2D3E',
            color: '#ffffff',
            maxWidth: 420,
            wordBreak: 'break-all',
            border: '1px solid #3A3D5C',
            boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
          },
        },
        arrow: { sx: { color: '#2A2D3E' } },
      }}
    >
      <Box
        ref={textRef}
        sx={{
          display: 'block',
          maxWidth,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          cursor: overflowed ? 'help' : 'default',
          ...textSx,
        }}
      >
        {displayValue}
      </Box>
    </MuiTooltip>
  );
};

export default function DashboardPage() {
  const router = useRouter();
  const {
    filteredThreats,
    filteredStats,
    httpCodes,
    connected,
    refreshThreats,
  } = useApp();

  const [serverMetrics, setServerMetrics] = useState(null);
  const [refreshing,    setRefreshing]    = useState(false);
  const [authChecked,   setAuthChecked]   = useState(false);

  // ── AUTH PROTECTION ──
  // checks if token exists in localStorage or sessionStorage
  // if not found → redirects to login page immediately
  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      setAuthChecked(true);
    }
  }, []);

  useEffect(() => {
    if (!authChecked) return;
    const fetchMetrics = () => {
      fetch(`${BACKEND}/api/server/metrics`)
        .then(r => r.json())
        .then(data => setServerMetrics(data))
        .catch(console.error);
    };
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 10000);
    return () => clearInterval(interval);
  }, [authChecked]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      if (typeof refreshThreats === 'function') await refreshThreats();
    } finally {
      setTimeout(() => setRefreshing(false), 600);
    }
  };

  const activeServers = useMemo(() => {
    const servers = new Set((filteredThreats || []).map(t => t.server).filter(Boolean));
    if (serverMetrics?.name) servers.add(serverMetrics.name);
    return [...servers];
  }, [filteredThreats, serverMetrics]);

  const applications = useMemo(() => {
    const serverMap = new Map();
    (filteredThreats || []).forEach((t) => {
      const server  = String(t.server || serverMetrics?.name || 'Unknown Server').trim();
      const appName = String(
        t.application  ||
        t.app_name     ||
        t.target_app   ||
        serverMetrics?.application ||
        'Web Application'
      ).trim();

      if (!serverMap.has(server)) {
        serverMap.set(server, { server, applicationsMap: new Map(), lastSeen: 0 });
      }
      const serverEntry = serverMap.get(server);
      const ts = t.timestamp ? new Date(t.timestamp).getTime() : 0;
      if (ts > serverEntry.lastSeen) serverEntry.lastSeen = ts;

      if (!serverEntry.applicationsMap.has(appName)) {
        serverEntry.applicationsMap.set(appName, { name: appName, hits: 0, lastSeen: 0 });
      }
      const appEntry = serverEntry.applicationsMap.get(appName);
      appEntry.hits += 1;
      if (ts > appEntry.lastSeen) appEntry.lastSeen = ts;
    });

    if (serverMap.size === 0 && serverMetrics?.name) {
      const server  = String(serverMetrics.name).trim();
      const appName = String(serverMetrics.application || 'Web Application').trim();
      serverMap.set(server, {
        server,
        lastSeen: 0,
        applicationsMap: new Map([[appName, { name: appName, hits: 0, lastSeen: 0 }]]),
      });
    }

    return [...serverMap.values()]
      .sort((a, b) => b.lastSeen - a.lastSeen)
      .map(se => ({
        server: se.server,
        applications: [...se.applicationsMap.values()].sort((a, b) => b.lastSeen - a.lastSeen),
      }));
  }, [filteredThreats, serverMetrics]);

  const chartData = useMemo(() => {
    if (!filteredThreats || filteredThreats.length === 0) return [];
    const buckets = {};
    filteredThreats.forEach(t => {
      const d      = new Date(t.timestamp);
      const bucket = `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
      if (!buckets[bucket]) {
        buckets[bucket] = {
          time: bucket,
          ddos: 0, sqli: 0, xss:  0, ssrf: 0, cmd: 0,
          path: 0, lfi:  0, nosql: 0, xxe: 0, crlf: 0,
        };
      }
      const key = typeToKey(t.type);
      if (key) buckets[bucket][key]++;
    });
    return Object.values(buckets)
      .sort((a, b) => a.time.localeCompare(b.time))
      .slice(-20);
  }, [filteredThreats]);

  const recentAlerts = (filteredThreats || []).slice(0, 7);
  const maxHttp      = Math.max(...(httpCodes || []).map(c => c.value), 1);

  // dont render anything until auth is checked
  if (!authChecked) return null;

  return (
    <DashboardLayout>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography sx={{ fontSize: '1.3rem', fontWeight: 700, letterSpacing: '0.15em', color: '#7C6FF7' }}>
            DASHBOARD
          </Typography>
          <Box sx={{
            display: 'flex', alignItems: 'center', gap: 0.8,
            px: 1.5, py: 0.4, borderRadius: '20px',
            backgroundColor: connected ? '#1a3a2a' : '#3a1a1a',
            border: `1px solid ${connected ? '#2ED573' : '#FF4757'}`,
          }}>
            <Box sx={{
              width: 7, height: 7, borderRadius: '50%',
              backgroundColor: connected ? '#2ED573' : '#FF4757',
              animation: connected ? 'pulse 1.5s infinite' : 'none',
              '@keyframes pulse': { '0%, 100%': { opacity: 1 }, '50%': { opacity: 0.3 } },
            }} />
            <Typography sx={{ color: connected ? '#2ED573' : '#FF4757', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em' }}>
              {connected ? 'LIVE' : 'OFFLINE'}
            </Typography>
          </Box>
        </Box>

        {/* Stat Cards */}
        <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
          <Box sx={{ flex: 1 }}>
            <StatCard title="TOTAL ATTACKS"   value={(filteredStats?.total  || 0).toLocaleString()} icon={<SecurityIcon sx={{ fontSize: 32 }} />}     borderColor="#4ECDC4" />
          </Box>
          <Box sx={{ flex: 1 }}>
            <StatCard title="HIGH SEVERITY"   value={(filteredStats?.high   || 0).toLocaleString()} icon={<WarningAmberIcon sx={{ fontSize: 32 }} />} borderColor="#FF4757" />
          </Box>
          <Box sx={{ flex: 1 }}>
            <StatCard title="MEDIUM SEVERITY" value={(filteredStats?.medium || 0).toLocaleString()} icon={<ShieldIcon sx={{ fontSize: 32 }} />}       borderColor="#FFB020" />
          </Box>
          <Box sx={{ flex: 1 }}>
            <StatCard title="ACTIVE SERVERS"  value={String(activeServers.length || 1)}             icon={<StorageIcon sx={{ fontSize: 32 }} />}       borderColor="#2ED573" />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'stretch', width: '100%' }}>

          {/* Left column */}
          <Box sx={{ flex: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>

            {/* Attack Trends Chart */}
            <Box sx={{
              backgroundColor: '#1E2235', borderRadius: '12px',
              p: 2.5, height: 320, display: 'flex', flexDirection: 'column',
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                <Typography sx={{ color: '#7C6FF7', fontWeight: 600, fontSize: '0.95rem' }}>
                  Attack Trends
                </Typography>
                <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                  {ATTACK_LINES.map((item) => (
                    <Box key={item.key} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Box sx={{ width: 20, height: 3, backgroundColor: item.color, borderRadius: 2 }} />
                      <Typography sx={{ color: '#A78BFA', fontSize: '0.68rem' }}>{item.label}</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <XAxis dataKey="time" stroke="#3A3D4E" tick={{ fill: '#A78BFA', fontSize: 11 }} />
                      <YAxis stroke="#3A3D4E" tick={{ fill: '#A78BFA', fontSize: 11 }} allowDecimals={false} />
                      <Tooltip content={<CustomTooltip />} />
                      {ATTACK_LINES.map((item) => (
                        <Line
                          key={item.key}
                          type="monotone"
                          dataKey={item.key}
                          stroke={item.color}
                          strokeWidth={2}
                          dot={false}
                          activeDot={{ r: 4 }}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed #2A2D3E', borderRadius: '8px' }}>
                    <Typography sx={{ color: '#A0A3B1', fontSize: '0.82rem' }}>
                      Waiting for attack data...
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>

            {/* Recent Alerts Table */}
            <Box sx={{ backgroundColor: '#1E2235', borderRadius: '12px', p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography sx={{ color: '#ffffff', fontWeight: 600, letterSpacing: '0.1em', fontSize: '0.9rem' }}>
                  RECENT ALERTS
                </Typography>
                <IconButton
                  onClick={handleRefresh}
                  size="small"
                  disableRipple
                  sx={{
                    color: '#7C6FF7', backgroundColor: 'transparent',
                    border: 'none', p: 0.6,
                    '&:hover': { backgroundColor: 'transparent' },
                  }}
                >
                  <RefreshIcon
                    fontSize="small"
                    sx={{
                      fontSize: '1rem',
                      animation: refreshing ? 'spin 0.6s linear infinite' : 'none',
                      '@keyframes spin': {
                        '0%':   { transform: 'rotate(0deg)'   },
                        '100%': { transform: 'rotate(360deg)' },
                      },
                    }}
                  />
                </IconButton>
              </Box>

              <TableContainer component={Paper} sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      {['TIME', 'SERVER', 'APPLICATION', 'THREAT TYPE', 'PARAMETER', 'SEVERITY', 'RESPONSE'].map((col) => (
                        <TableCell key={col} sx={{
                          color: '#9A90B7', fontSize: '0.7rem', fontWeight: 600,
                          letterSpacing: '0.08em', borderBottom: '1px solid #2A2D3E', py: 1,
                        }}>
                          {col}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentAlerts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} sx={{ textAlign: 'center', color: '#A0A3B1', py: 4, borderBottom: 'none' }}>
                          No threats detected yet.
                        </TableCell>
                      </TableRow>
                    ) : recentAlerts.map((row, i) => {
                      const resolvedApp =
                        row.application ||
                        row.app_name    ||
                        row.target_app  ||
                        (row.server === serverMetrics?.name ? serverMetrics?.application : null) ||
                        '—';

                      return (
                        <TableRow key={i} sx={{
                          '&:hover': { backgroundColor: '#252840' },
                          animation: i === 0 ? 'flashIn 0.6s ease' : 'none',
                          '@keyframes flashIn': {
                            '0%':   { backgroundColor: '#2A2D5E' },
                            '100%': { backgroundColor: 'transparent' },
                          },
                        }}>
                          <TableCell sx={{ color: '#C2AEFE', fontSize: '0.78rem', borderBottom: '1px solid #2A2D3E', py: 0.8 }}>
                            {new Date(row.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </TableCell>
                          <TableCell sx={{ borderBottom: '1px solid #2A2D3E', py: 0.8 }}>
                            <OverflowTooltip value={row.server || '—'} maxWidth={150} textSx={{ color: '#C2AEFE', fontSize: '0.78rem' }} />
                          </TableCell>
                          <TableCell sx={{ borderBottom: '1px solid #2A2D3E', py: 0.8 }}>
                            <OverflowTooltip value={resolvedApp} maxWidth={130} textSx={{ color: '#C2AEFE', fontSize: '0.78rem' }} />
                          </TableCell>
                          <TableCell sx={{ borderBottom: '1px solid #2A2D3E', py: 0.8 }}>
                            <Chip label={shortType(row.type)} size="small" sx={{
                              backgroundColor: `${threatColor(row.type)}22`,
                              color: threatColor(row.type),
                              fontWeight: 700, fontSize: '0.7rem',
                              height: 22, borderRadius: '6px',
                            }} />
                          </TableCell>
                          <TableCell sx={{ borderBottom: '1px solid #2A2D3E', py: 0.8 }}>
                            <OverflowTooltip
                              value={row.parameter || row.detectedIn || row.method || '—'}
                              maxWidth={120}
                              textSx={{ color: '#C2AEFE', fontSize: '0.78rem' }}
                            />
                          </TableCell>
                          <TableCell sx={{ borderBottom: '1px solid #2A2D3E', py: 0.8 }}>
                            <Chip
                              label={row.severity ? row.severity.charAt(0).toUpperCase() + row.severity.slice(1) : '—'}
                              size="small"
                              sx={{
                                backgroundColor: `${severityColor(row.severity)}22`,
                                color: severityColor(row.severity),
                                fontWeight: 700, fontSize: '0.7rem',
                                height: 22, borderRadius: '6px',
                              }}
                            />
                          </TableCell>
                          <TableCell sx={{ borderBottom: '1px solid #2A2D3E', py: 0.8 }}>
                            <Typography sx={{ color: responseColor(row.statusCode), fontSize: '0.78rem', fontWeight: 600 }}>
                              {row.statusCode || 403}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Box>

          {/* Right column */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>

            {/* Applications Panel */}
            <Box sx={{ backgroundColor: '#1E2235', borderRadius: '12px', p: 2.5, height: 320, flexShrink: 0, overflowY: 'auto' }}>
              <Typography sx={{ color: '#ffffff', fontWeight: 600, fontSize: '0.95rem', mb: 1.5 }}>
                Applications
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                {applications.length === 0 ? (
                  <Typography sx={{ color: '#A0A3B1', fontSize: '0.8rem', mt: 1 }}>
                    No applications detected yet.
                  </Typography>
                ) : applications.flatMap((serverItem) =>
                    serverItem.applications.map((app, appIdx) => (
                      <Box
                        key={`${serverItem.server}-${app.name}-${appIdx}`}
                        sx={{
                          display: 'flex', justifyContent: 'space-between',
                          alignItems: 'center', py: 0.9,
                          borderBottom: '1px solid #2A2D3E',
                        }}
                      >
                        <Typography sx={{
                          color: '#A0A3B1', fontSize: '0.85rem', fontWeight: 500,
                          maxWidth: 130, overflow: 'hidden',
                          textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>
                          {app.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography sx={{
                            color: '#C2AEFE', fontSize: '0.75rem',
                            maxWidth: 100, overflow: 'hidden',
                            textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          }}>
                            {serverItem.server}
                          </Typography>
                          {app.hits > 0 && (
                            <Chip
                              label={`${app.hits} hits`}
                              size="small"
                              sx={{
                                backgroundColor: '#FF475722',
                                color: '#FF4757',
                                fontWeight: 700, fontSize: '0.68rem',
                                height: 20, borderRadius: '6px',
                              }}
                            />
                          )}
                        </Box>
                      </Box>
                    ))
                  )
                }
              </Box>
            </Box>

            {/* HTTP Response Codes */}
            <Box sx={{ backgroundColor: '#1E2235', borderRadius: '12px', p: 2.5, flex: 1 }}>
              <Typography sx={{ color: '#ffffff', fontWeight: 600, fontSize: '0.95rem', mb: 2.5 }}>
                HTTP Response Codes
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                {(httpCodes || []).map((item) => (
                  <Box key={item.code}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{
                          width: 36, height: 36, borderRadius: '8px',
                          backgroundColor: `${item.color}22`,
                          border: `1px solid ${item.color}44`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <Typography sx={{ color: item.color, fontSize: '0.78rem', fontWeight: 700 }}>
                            {item.code}
                          </Typography>
                        </Box>
                        <Typography sx={{ color: '#A0A3B1', fontSize: '0.78rem' }}>
                          {item.label}
                        </Typography>
                      </Box>
                      <Typography sx={{ color: '#ffffff', fontSize: '0.9rem', fontWeight: 700 }}>
                        {item.value.toLocaleString()}
                      </Typography>
                    </Box>
                    <Box sx={{ height: 8, backgroundColor: '#2A2D3E', borderRadius: 3, overflow: 'hidden' }}>
                      <Box sx={{
                        height: '100%',
                        width: `${(item.value / maxHttp) * 100}%`,
                        backgroundColor: item.color,
                        borderRadius: 3,
                        transition: 'width 0.4s ease',
                      }} />
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </DashboardLayout>
  );
}