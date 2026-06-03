import { useMemo, useState, useEffect, useRef } from 'react';
import {
  Box, Typography, Select, MenuItem, Chip,
  Table, TableBody, TableCell,
  TableContainer, TableHead,
  TableRow, Paper, IconButton, Tooltip as MuiTooltip,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { DashboardLayout } from '../components/layout';
import { useApp } from '../context/AppContext';

const BACKEND = 'http://localhost:5000';

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
  if (t.includes('XXE'))        return '#A29BFE';
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
  if (type.includes('DDoS'))                               return 'DDoS';
  if (type.includes('NoSQL'))                              return 'NoSQLi';
  if (type.includes('SQL Injection'))                      return 'SQLi';
  if (type.includes('XSS') || type.includes('Cross-Site')) return 'XSS';
  if (type.includes('SSRF'))                               return 'SSRF';
  if (type.includes('Command'))                            return 'CMDi';
  if (type.includes('Path'))                               return 'Path';
  if (type.includes('Local File'))                         return 'LFI';
  if (type.includes('XXE'))                                return 'XXE';
  return type.slice(0, 6);
};

const selectSx = {
  color: '#ffffff',
  fontSize: '0.8rem',
  backgroundColor: '#2A2D3E',
  borderRadius: '8px',
  minWidth: 180,
  '.MuiOutlinedInput-notchedOutline': { border: 'none' },
  '.MuiSvgIcon-root': { color: '#A78BFA' },
  '&:hover': { backgroundColor: '#313550' },
};

const menuItemSx = {
  fontSize: '0.82rem',
  color: '#ffffff',
  backgroundColor: '#2A2D3E',
  '&:hover': { backgroundColor: '#313550' },
  '&.Mui-selected': { backgroundColor: '#3a3d5c' },
};

// Always shows tooltip on hover with full text
// Truncation (…) is handled by CSS on the inner Box
function TruncatedTooltip({ text, children, placement = 'top' }) {
  return (
    <MuiTooltip
      title={text || ''}
      placement={placement}
      arrow
      enterDelay={300}
      componentsProps={{
        tooltip: {
          sx: {
            fontSize:        '0.75rem',
            px:              1.5,
            py:              0.8,
            backgroundColor: '#2A2D3E',
            color:           '#ffffff',
            maxWidth:        420,
            wordBreak:       'break-all',
            border:          '1px solid #3A3D5C',
            boxShadow:       '0 4px 12px rgba(0,0,0,0.4)',
          },
        },
        arrow: { sx: { color: '#2A2D3E' } },
      }}
    >
      <Box
        sx={{
          overflow:     'hidden',
          textOverflow: 'ellipsis',
          whiteSpace:   'nowrap',
          cursor:       'default',
        }}
      >
        {children}
      </Box>
    </MuiTooltip>
  );
}

export default function ThreatAssessmentPage() {
  const { filteredThreats, filteredStats, refreshThreats } = useApp();
  const [severity,      setSeverity]      = useState('ALL');
  const [attackType,    setAttackType]    = useState('ALL');
  const [server,        setServer]        = useState('ALL');
  const [refreshing,    setRefreshing]    = useState(false);
  const [serverMetrics, setServerMetrics] = useState(null);

  useEffect(() => {
    const fetchMetrics = () => {
      fetch(`${BACKEND}/api/server/metrics`)
        .then(r => r.json())
        .then(data => setServerMetrics(data))
        .catch(() => {});
    };
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      if (typeof refreshThreats === 'function') await refreshThreats();
    } finally {
      setTimeout(() => setRefreshing(false), 600);
    }
  };

  const appMap = useMemo(() => {
    const map = {};
    (filteredThreats || []).forEach(t => {
      if (t.server && t.application) map[t.server] = t.application;
    });
    if (serverMetrics?.name && serverMetrics?.application) {
      map[serverMetrics.name] = serverMetrics.application;
    }
    return map;
  }, [filteredThreats, serverMetrics]);

  const getAppName = (row) =>
    row.application || appMap[row.server] || serverMetrics?.application || '—';

  const severityData = useMemo(() => [
    { label: 'High',   color: '#FF4757', value: filteredStats.high   || 0 },
    { label: 'Medium', color: '#FFB020', value: filteredStats.medium || 0 },
    { label: 'Low',    color: '#2ED573', value: filteredStats.low    || 0 },
  ], [filteredStats]);

  const total = filteredStats.total || 0;

  const topTargeted = useMemo(() => {
    if (!filteredThreats || filteredThreats.length === 0) return [];
    const counts = {};
    filteredThreats.forEach(t => {
      if (t.target) counts[t.target] = (counts[t.target] || 0) + 1;
    });
    const colors = ['#FF4757', '#A78BFA', '#4ECDC4', '#FFB020', '#2ED573'];
    return Object.entries(counts)
      .sort(([,a],[,b]) => b - a)
      .slice(0, 3)
      .map(([name, hits], i) => ({ name, hits, color: colors[i] }));
  }, [filteredThreats]);

  const attackTypes = useMemo(() => {
    if (!filteredThreats) return [];
    const types = new Set(filteredThreats.map(t => shortType(t.type)));
    return [...types];
  }, [filteredThreats]);

  const servers = useMemo(() => {
    if (!filteredThreats) return [];
    const s = new Set(filteredThreats.map(t => t.server).filter(Boolean));
    return [...s];
  }, [filteredThreats]);

  const filtered = useMemo(() => (filteredThreats || []).filter((t) => {
    if (severity   !== 'ALL' && t.severity?.toLowerCase() !== severity.toLowerCase()) return false;
    if (attackType !== 'ALL' && shortType(t.type) !== attackType)                     return false;
    if (server     !== 'ALL' && t.server !== server)                                  return false;
    return true;
  }), [filteredThreats, severity, attackType, server]);

  return (
    <DashboardLayout>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

        <Typography sx={{
          fontSize: '1.3rem', fontWeight: 700,
          letterSpacing: '0.15em', color: '#7C6FF7',
        }}>
          THREAT ASSESSMENT
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>

          {/* Severity Summary */}
          <Box sx={{ flex: 1, backgroundColor: '#1E2235', borderRadius: '12px', p: 2.5 }}>
            <Typography sx={{
              color: '#ffffff', fontWeight: 600,
              fontSize: '0.85rem', letterSpacing: '0.1em', mb: 2,
            }}>
              SEVERITY SUMMARY
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {severityData.map((item) => (
                <Box key={item.label} sx={{
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between',
                  py: 1, borderBottom: '1px solid #2A2D3E',
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: item.color }} />
                    <Typography sx={{ color: item.color, fontSize: '0.9rem', fontWeight: 600 }}>
                      {item.label}
                    </Typography>
                  </Box>
                  <Typography sx={{ color: '#ffffff', fontSize: '1rem', fontWeight: 700 }}>
                    {item.value.toLocaleString()}
                  </Typography>
                </Box>
              ))}
            </Box>
            <Box sx={{ display: 'flex', height: 10, borderRadius: 3, overflow: 'hidden', mt: 2.5 }}>
              {total > 0 ? severityData.map((item) => (
                <Box key={item.label} sx={{
                  width: `${(item.value / total) * 100}%`,
                  backgroundColor: item.color,
                  transition: 'width 0.4s ease',
                }} />
              )) : (
                <Box sx={{ width: '100%', backgroundColor: '#2A2D3E' }} />
              )}
            </Box>
          </Box>

          {/* Top Targeted */}
          <Box sx={{ flex: 1, backgroundColor: '#1E2235', borderRadius: '12px', p: 2.5 }}>
            <Typography sx={{
              color: '#ffffff', fontWeight: 600,
              fontSize: '0.85rem', letterSpacing: '0.1em', mb: 2,
            }}>
              TOP TARGETED
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {topTargeted.length === 0 ? (
                <Typography sx={{ color: '#A0A3B1', fontSize: '0.8rem', mt: 1 }}>
                  No data yet...
                </Typography>
              ) : topTargeted.map((item) => (
                <Box key={item.name} sx={{
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between',
                  py: 1, borderBottom: '1px solid #2A2D3E',
                }}>
                  <MuiTooltip
                    title={item.name}
                    placement="top"
                    arrow
                    enterDelay={300}
                    componentsProps={{
                      tooltip: {
                        sx: {
                          fontSize: '0.75rem', px: 1.5, py: 0.8,
                          backgroundColor: '#2A2D3E', color: '#ffffff',
                          maxWidth: 420, wordBreak: 'break-all',
                          border: '1px solid #3A3D5C',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                        },
                      },
                      arrow: { sx: { color: '#2A2D3E' } },
                    }}
                  >
                    <Typography sx={{
                      color: '#ffffff', fontSize: '0.9rem', fontWeight: 500,
                      maxWidth: 160, overflow: 'hidden',
                      textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      cursor: 'default',
                    }}>
                      {item.name}
                    </Typography>
                  </MuiTooltip>
                  <Chip
                    label={`${item.hits.toLocaleString()} Hits`}
                    size="small"
                    sx={{
                      backgroundColor: `${item.color}33`,
                      color:           item.color,
                      fontWeight:      700,
                      fontSize:        '0.75rem',
                      height:          24,
                      borderRadius:    '20px',
                      border:          `1px solid ${item.color}55`,
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        <Typography sx={{
          fontSize: '1.3rem', fontWeight: 700,
          letterSpacing: '0.1em', color: '#7C6FF7',
        }}>
          RECENT ALERTS
        </Typography>

        {/* Filter Bar */}
        <Box sx={{
          backgroundColor: '#1E2235', borderRadius: '12px',
          p: 2, display: 'flex', alignItems: 'center', gap: 2,
        }}>
          <Typography sx={{
            color: '#A78BFA', fontSize: '0.85rem',
            fontWeight: 600, letterSpacing: '0.1em',
          }}>
            FILTER BY
          </Typography>

          <Select
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
            size="small" sx={selectSx}
            MenuProps={{ PaperProps: { style: { color: '#ffffff' } } }}
          >
            <MenuItem value="ALL"    sx={menuItemSx}>ALL SEVERITY</MenuItem>
            <MenuItem value="high"   sx={menuItemSx}>High</MenuItem>
            <MenuItem value="medium" sx={menuItemSx}>Medium</MenuItem>
            <MenuItem value="low"    sx={menuItemSx}>Low</MenuItem>
          </Select>

          <Select
            value={attackType}
            onChange={(e) => setAttackType(e.target.value)}
            size="small" sx={selectSx}
            MenuProps={{ PaperProps: { style: { color: '#ffffff' } } }}
          >
            <MenuItem value="ALL" sx={menuItemSx}>ALL ATTACK TYPES</MenuItem>
            {attackTypes.map(type => (
              <MenuItem key={type} value={type} sx={menuItemSx}>{type}</MenuItem>
            ))}
          </Select>

          <Select
            value={server}
            onChange={(e) => setServer(e.target.value)}
            size="small" sx={selectSx}
            MenuProps={{ PaperProps: { style: { color: '#ffffff' } } }}
          >
            <MenuItem value="ALL" sx={menuItemSx}>ALL SERVERS</MenuItem>
            {servers.map(s => (
              <MenuItem key={s} value={s} sx={menuItemSx}>{s}</MenuItem>
            ))}
          </Select>

          {/* Count + Refresh */}
          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ color: '#A0A3B1', fontSize: '0.78rem' }}>
              Showing {filtered.length} of {filteredThreats?.length || 0} entries
            </Typography>
            <IconButton
              onClick={handleRefresh}
              size="small"
              disableRipple
              sx={{
                color:           '#7C6FF7',
                backgroundColor: 'transparent',
                border:          'none',
                p:               0.6,
                '&:hover':       { backgroundColor: 'transparent' },
              }}
            >
              <RefreshIcon
                fontSize="small"
                sx={{
                  fontSize:  '1rem',
                  animation: refreshing ? 'spin 0.6s linear infinite' : 'none',
                  '@keyframes spin': {
                    '0%':   { transform: 'rotate(0deg)'   },
                    '100%': { transform: 'rotate(360deg)' },
                  },
                }}
              />
            </IconButton>
          </Box>
        </Box>

        {/* Alerts Table */}
        <Box sx={{ backgroundColor: '#1E2235', borderRadius: '12px', p: 2.5 }}>
          <TableContainer component={Paper} sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {['TIME', 'SERVERS', 'APPLICATION', 'THREAT TYPE', 'PARAMETER', 'SEVERITY', 'RESPONSE'].map((col) => (
                    <TableCell key={col} sx={{
                      color: '#9A90B7', fontSize: '0.72rem', fontWeight: 600,
                      letterSpacing: '0.08em', borderBottom: '1px solid #2A2D3E', py: 1,
                    }}>
                      {col}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} sx={{ textAlign: 'center', color: '#A78BFA', fontSize: '0.82rem', border: 'none', py: 4 }}>
                      {!filteredThreats || filteredThreats.length === 0
                        ? 'No threats detected yet.'
                        : 'No alerts match the selected filters'}
                    </TableCell>
                  </TableRow>
                ) : filtered.map((row, i) => (
                  <TableRow key={i} sx={{ '&:hover': { backgroundColor: '#252840' } }}>

                    {/* TIME */}
                    <TableCell sx={{ color: '#C2AEFE', fontSize: '0.78rem', borderBottom: '1px solid #2A2D3E', py: 1 }}>
                      {new Date(row.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </TableCell>

                    {/* SERVER */}
                    <TableCell sx={{ borderBottom: '1px solid #2A2D3E', py: 1, maxWidth: 130 }}>
                      <TruncatedTooltip text={row.server || '—'}>
                        <Box sx={{ color: '#C2AEFE', fontSize: '0.78rem' }}>
                          {row.server || '—'}
                        </Box>
                      </TruncatedTooltip>
                    </TableCell>

                    {/* APPLICATION */}
                    <TableCell sx={{ borderBottom: '1px solid #2A2D3E', py: 1, maxWidth: 130 }}>
                      <TruncatedTooltip text={getAppName(row)}>
                        <Box sx={{ color: '#C2AEFE', fontSize: '0.78rem' }}>
                          {getAppName(row)}
                        </Box>
                      </TruncatedTooltip>
                    </TableCell>

                    {/* THREAT TYPE */}
                    <TableCell sx={{ borderBottom: '1px solid #2A2D3E', py: 1 }}>
                      <Chip label={shortType(row.type)} size="small" sx={{
                        backgroundColor: `${threatColor(row.type)}22`,
                        color:           threatColor(row.type),
                        fontWeight:      700,
                        fontSize:        '0.7rem',
                        height:          22,
                        borderRadius:    '6px',
                      }} />
                    </TableCell>

                    {/* PARAMETER */}
                    <TableCell sx={{ borderBottom: '1px solid #2A2D3E', py: 1, maxWidth: 130 }}>
                      <TruncatedTooltip text={row.parameter || row.detectedIn || row.method || '—'}>
                        <Box sx={{ color: '#C2AEFE', fontSize: '0.78rem' }}>
                          {row.parameter || row.detectedIn?.substring(0, 20) || row.method || '—'}
                        </Box>
                      </TruncatedTooltip>
                    </TableCell>

                    {/* SEVERITY */}
                    <TableCell sx={{ borderBottom: '1px solid #2A2D3E', py: 1 }}>
                      <Chip
                        label={row.severity ? row.severity.charAt(0).toUpperCase() + row.severity.slice(1) : '—'}
                        size="small"
                        sx={{
                          backgroundColor: `${severityColor(row.severity)}22`,
                          color:           severityColor(row.severity),
                          fontWeight:      700,
                          fontSize:        '0.7rem',
                          height:          22,
                          borderRadius:    '6px',
                        }}
                      />
                    </TableCell>

                    {/* RESPONSE */}
                    <TableCell sx={{ borderBottom: '1px solid #2A2D3E', py: 1 }}>
                      <Typography sx={{ color: responseColor(row.statusCode), fontSize: '0.78rem', fontWeight: 600 }}>
                        {row.statusCode || 403}
                      </Typography>
                    </TableCell>

                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </DashboardLayout>
  );
}