import { useState, useMemo, useRef, useEffect } from 'react';
import {
  Box, Typography, Select, MenuItem,
  Table, TableBody, TableCell,
  TableContainer, TableHead,
  TableRow, Paper, Chip, IconButton, Tooltip as MuiTooltip,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { DashboardLayout } from '../components/layout';
import ListAltIcon from '@mui/icons-material/ListAlt';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import GppBadIcon from '@mui/icons-material/GppBad';
import SecurityIcon from '@mui/icons-material/Security';
import { StatCard } from '../components/ui';
import { useApp } from '../context/AppContext';


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
  if (t.includes('XSS') || t.includes('Cross-Site')) return '#7C6FF7';
  if (t.includes('SSRF'))       return '#4ECDC4';
  if (t.includes('Command'))    return '#FF6B35';
  if (t.includes('Path'))       return '#FFB020';
  if (t.includes('Local File')) return '#2ED573';
  if (t.includes('XXE'))        return '#A29BFE';
  return '#A0A3B1';
};


const methodColor = (m) => m === 'GET' ? '#2ED573' : '#A78BFA';


const responseColor = (code) => {
  if (code === 200) return '#2ED573';
  if (code === 404) return '#7C6FF7';
  if (code === 403) return '#FFB020';
  if (code === 500) return '#FF4757';
  return '#A0A3B1';
};


const shortType = (type = '') => {
  if (type.includes('DDoS'))            return 'DDoS';
  if (type.includes('NoSQL'))           return 'NoSQLi';
  if (type.includes('SQL Injection'))  return 'SQLi';
  if (type.includes('XSS') || type.includes('Cross-Site')) return 'XSS';
  if (type.includes('SSRF'))           return 'SSRF';
  if (type.includes('Command'))        return 'CMDi';
  if (type.includes('Path'))           return 'Path';
  if (type.includes('Local File'))     return 'LFI';
  if (type.includes('XXE'))            return 'XXE';
  return type.slice(0, 6);
};


const selectSx = {
  color: '#ffffff', fontSize: '0.8rem',
  backgroundColor: '#2A2D3E', borderRadius: '8px', minWidth: 180,
  '.MuiOutlinedInput-notchedOutline': { border: 'none' },
  '.MuiSvgIcon-root': { color: '#A78BFA' },
  '&:hover': { backgroundColor: '#313550' },
};


const menuItemSx = {
  fontSize: '0.82rem', color: '#ffffff',
  backgroundColor: '#2A2D3E',
  '&:hover': { backgroundColor: '#313550' },
  '&.Mui-selected': { backgroundColor: '#3a3d5c' },
};

// Custom component for tooltip only when text is truncated
function TruncatedTooltip({ text, children, placement = 'top' }) {
  const ref = useRef(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    if (ref.current) {
      setIsTruncated(ref.current.scrollWidth > ref.current.clientWidth);
    }
  }, [text]);

  if (!isTruncated) {
    return <Box ref={ref}>{children}</Box>;
  }

  return (
    <MuiTooltip 
      title={text} 
      placement={placement}
      sx={{
        '& .MuiTooltip-tooltip': {
          fontSize: '0.75rem',
          padding: '4px 8px',
          backgroundColor: '#2A2D3E',
          color: '#ffffff',
          maxWidth: 400,
          wordBreak: 'break-word',
        },
        '& .MuiTooltip-arrow': {
          color: '#2A2D3E',
        },
      }}
    >
      <Box ref={ref}>{children}</Box>
    </MuiTooltip>
  );
}

export default function LogsPage() {
  const { filteredThreats, filteredStats, normalCount, refreshThreats } = useApp();


  const [severity,   setSeverity]   = useState('ALL');
  const [attackType, setAttackType] = useState('ALL');
  const [server,     setServer]     = useState('ALL');
  const [refreshing, setRefreshing] = useState(false);


  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      if (typeof refreshThreats === 'function') await refreshThreats();
    } finally {
      setTimeout(() => setRefreshing(false), 600);
    }
  };


  const attackTypes = useMemo(() =>
    [...new Set(filteredThreats.map(t => shortType(t.type)))],
    [filteredThreats]
  );


  const servers = useMemo(() =>
    [...new Set(filteredThreats.map(t => t.server).filter(Boolean))],
    [filteredThreats]
  );


  const filtered = useMemo(() => filteredThreats.filter((t) => {
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
          LOGS
        </Typography>


        <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
          <Box sx={{ flex: 1 }}>
            <StatCard title="TOTAL LOGS"     value={filteredStats.total.toLocaleString()} icon={<ListAltIcon sx={{ fontSize: 32 }} />}      borderColor="#4ECDC4" />
          </Box>
          <Box sx={{ flex: 1 }}>
            <StatCard title="HIGH"           value={filteredStats.high.toLocaleString()}  icon={<WarningAmberIcon sx={{ fontSize: 32 }} />} borderColor="#FF4757" />
          </Box>
          <Box sx={{ flex: 1 }}>
            <StatCard title="MEDIUM"         value={filteredStats.medium.toLocaleString()} icon={<GppBadIcon sx={{ fontSize: 32 }} />}      borderColor="#FFB020" />
          </Box>
          <Box sx={{ flex: 1 }}>
            <StatCard title="NORMAL TRAFFIC" value={normalCount.toLocaleString()}          icon={<SecurityIcon sx={{ fontSize: 32 }} />}    borderColor="#2ED573" />
          </Box>
        </Box>


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


          <Select value={severity} onChange={(e) => setSeverity(e.target.value)} size="small" sx={selectSx} MenuProps={{ PaperProps: { style: { color: '#ffffff' } } }}>
            <MenuItem value="ALL"    sx={menuItemSx}>ALL SEVERITY</MenuItem>
            <MenuItem value="high"   sx={menuItemSx}>High</MenuItem>
            <MenuItem value="medium" sx={menuItemSx}>Medium</MenuItem>
            <MenuItem value="low"    sx={menuItemSx}>Low</MenuItem>
          </Select>


          <Select value={attackType} onChange={(e) => setAttackType(e.target.value)} size="small" sx={selectSx} MenuProps={{ PaperProps: { style: { color: '#ffffff' } } }}>
            <MenuItem value="ALL" sx={menuItemSx}>ALL ATTACK TYPES</MenuItem>
            {attackTypes.map(type => (
              <MenuItem key={type} value={type} sx={menuItemSx}>{type}</MenuItem>
            ))}
          </Select>


          <Select value={server} onChange={(e) => setServer(e.target.value)} size="small" sx={selectSx} MenuProps={{ PaperProps: { style: { color: '#ffffff' } } }}>
            <MenuItem value="ALL" sx={menuItemSx}>ALL SERVERS</MenuItem>
            {servers.map(s => (
              <MenuItem key={s} value={s} sx={menuItemSx}>{s}</MenuItem>
            ))}
          </Select>


          {/* Count + Refresh pushed to right */}
          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ color: '#A0A3B1', fontSize: '0.78rem' }}>
              Showing {filtered.length} of {filteredThreats.length} entries
            </Typography>
            <IconButton
              onClick={handleRefresh}
              size="small"
              sx={{
                color: '#7C6FF7',
                backgroundColor: '#7C6FF711',
                border: '1px solid #7C6FF733',
                borderRadius: '8px',
                p: 0.6,
                transition: 'all 0.2s',
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
        </Box>


        {/* Logs Table */}
        <Box sx={{ backgroundColor: '#1E2235', borderRadius: '12px', p: 2.5 }}>
          <TableContainer component={Paper} sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {['LOG ID', 'TIMESTAMP', 'SERVERS', 'APPLICATIONS',
                    'METHODS', 'ENDPOINT', 'ATTACK TYPE',
                    'PARAMETER', 'RESPONSE', 'SEVERITY'].map((col) => (
                    <TableCell key={col} sx={{
                      color: '#9A90B7', fontSize: '0.68rem', fontWeight: 600,
                      letterSpacing: '0.08em', borderBottom: '1px solid #2A2D3E',
                      py: 1, whiteSpace: 'nowrap',
                    }}>
                      {col}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} sx={{
                      textAlign: 'center', color: '#A78BFA',
                      fontSize: '0.82rem', border: 'none', py: 4,
                    }}>
                      {filteredThreats.length === 0
                        ? 'No logs yet. Send an attack from Kali to see it here.'
                        : 'No logs match the selected filters'}
                    </TableCell>
                  </TableRow>
                ) : filtered.map((row, i) => (
                  <TableRow key={i} sx={{ '&:hover': { backgroundColor: '#252840' } }}>


                    {/* LOG ID */}
                    <TableCell sx={{ color: '#C2AEFE', fontSize: '0.78rem', borderBottom: '1px solid #2A2D3E', py: 0.9, fontWeight: 500 }}>
                      {row.id || `#${String(i + 1).padStart(3, '0')}`}
                    </TableCell>


                    {/* TIMESTAMP */}
                    <TableCell sx={{ color: '#C2AEFE', fontSize: '0.78rem', borderBottom: '1px solid #2A2D3E', py: 0.9, whiteSpace: 'nowrap' }}>
                      {new Date(row.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </TableCell>


                    {/* SERVERS */}
                    <TableCell sx={{ color: '#C2AEFE', fontSize: '0.78rem', borderBottom: '1px solid #2A2D3E', py: 0.9 }}>
                      {row.server || '—'}
                    </TableCell>


                    {/* APPLICATIONS */}
                    <TableCell 
                      sx={{ 
                        color: '#C2AEFE', 
                        fontSize: '0.75rem', 
                        borderBottom: '1px solid #2A2D3E', 
                        py: 0.9, 
                        maxWidth: 130, 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis', 
                        whiteSpace: 'nowrap'
                      }}
                    >
                      <TruncatedTooltip text={row.application || '—'}>
                        <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {row.application || '—'}
                        </Box>
                      </TruncatedTooltip>
                    </TableCell>


                    {/* METHODS */}
                    <TableCell sx={{ borderBottom: '1px solid #2A2D3E', py: 0.9 }}>
                      <Typography sx={{ color: methodColor(row.method), fontSize: '0.78rem', fontWeight: 600 }}>
                        {row.method || '—'}
                      </Typography>
                    </TableCell>


                    {/* ENDPOINT */}
                    <TableCell sx={{ color: '#C2AEFE', fontSize: '0.75rem', borderBottom: '1px solid #2A2D3E', py: 0.9, fontFamily: 'monospace', maxWidth: 130, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {row.target?.split('?')[0] || '—'}
                    </TableCell>


                    {/* ATTACK TYPE */}
                    <TableCell sx={{ borderBottom: '1px solid #2A2D3E', py: 0.9 }}>
                      <Chip label={shortType(row.type)} size="small" sx={{
                        backgroundColor: `${threatColor(row.type)}22`,
                        color: threatColor(row.type),
                        fontWeight: 700, fontSize: '0.7rem',
                        height: 22, borderRadius: '6px',
                      }} />
                    </TableCell>


                    {/* PARAMETER */}
                    <TableCell 
                      sx={{ 
                        color: '#C2AEFE', 
                        fontSize: '0.75rem', 
                        borderBottom: '1px solid #2A2D3E', 
                        py: 0.9, 
                        maxWidth: 100, 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis', 
                        whiteSpace: 'nowrap'
                      }}
                    >
                      <TruncatedTooltip 
                        text={row.parameter || row.detectedIn?.substring(0, 200) || '—'}
                      >
                        <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {row.parameter || row.detectedIn?.substring(0, 15) || '—'}
                        </Box>
                      </TruncatedTooltip>
                    </TableCell>


                    {/* RESPONSE */}
                    <TableCell sx={{ borderBottom: '1px solid #2A2D3E', py: 0.9 }}>
                      <Typography sx={{ color: responseColor(row.statusCode), fontSize: '0.78rem', fontWeight: 600 }}>
                        {row.statusCode || 200}
                      </Typography>
                    </TableCell>


                    {/* SEVERITY */}
                    <TableCell sx={{ borderBottom: '1px solid #2A2D3E', py: 0.9 }}>
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