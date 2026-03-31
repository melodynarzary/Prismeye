import { useState, useMemo } from 'react';
import {
  Box, Typography, Select, MenuItem,
  Table, TableBody, TableCell,
  TableContainer, TableHead,
  TableRow, Paper, Chip
} from '@mui/material';
import DashboardLayout from '../components/layout/DashboardLayout';
import ListAltIcon from '@mui/icons-material/ListAlt';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import GppBadIcon from '@mui/icons-material/GppBad';
import SecurityIcon from '@mui/icons-material/Security';
import { StatCard } from '../components/ui';

const allLogs = [
  { id: 101, timestamp: '16:47:03', server: 'Server 2', application: 'E-commerce',  method: 'POST', endpoint: '/product',                  attackType: 'XSS',  parameter: 'username', response: 200, severity: 'Low'    },
  { id: 102, timestamp: '16:44:21', server: 'Server 1', application: 'Banking',     method: 'GET',  endpoint: '/api/banking/search',         attackType: 'XSS',  parameter: '/search',  response: 200, severity: 'Low'    },
  { id: 103, timestamp: '16:25:03', server: 'Server 3', application: 'Ka Bible',    method: 'GET',  endpoint: '/api/ka bible/login',         attackType: 'SQLi', parameter: 'username', response: 500, severity: 'High'   },
  { id: 104, timestamp: '15:40:03', server: 'Server 2', application: 'LesArtisans', method: 'POST', endpoint: '/api/LesArtisans/auth',       attackType: 'SQLi', parameter: 'password', response: 500, severity: 'High'   },
  { id: 105, timestamp: '15:30:11', server: 'Server 4', application: 'Banking',     method: 'GET',  endpoint: '/api/banking/transfer',       attackType: 'SQLi', parameter: 'id',       response: 500, severity: 'High'   },
  { id: 106, timestamp: '15:22:44', server: 'Server 1', application: 'Ka Bible',    method: 'POST', endpoint: '/api/ka bible/search',        attackType: 'XSS',  parameter: 'query',    response: 200, severity: 'Low'    },
  { id: 107, timestamp: '15:10:03', server: 'Server 5', application: 'E-commerce',  method: 'GET',  endpoint: '/api/products',               attackType: 'DDoS', parameter: '-',        response: 404, severity: 'Medium' },
  { id: 108, timestamp: '15:02:55', server: 'Server 3', application: 'Payment svc', method: 'POST', endpoint: '/api/payment/confirm',        attackType: 'SSRF', parameter: 'callback', response: 403, severity: 'Medium' },
  { id: 109, timestamp: '14:55:03', server: 'Server 2', application: 'Banking',     method: 'POST', endpoint: '/api/banking/login',          attackType: 'SQLi', parameter: 'username', response: 500, severity: 'High'   },
  { id: 110, timestamp: '14:40:22', server: 'Server 1', application: 'LesArtisans', method: 'GET',  endpoint: '/api/LesArtisans/profile',    attackType: 'XSS',  parameter: 'bio',      response: 200, severity: 'Low'    },
];

const severityColor = (s) => {
  if (s === 'High')   return '#FF4757';
  if (s === 'Medium') return '#FFB020';
  return '#2ED573';
};

const threatColor = (t) => {
  if (t === 'SQLi') return '#FF4757';
  if (t === 'XSS')  return '#7C6FF7';
  if (t === 'DDoS') return '#2ED573';
  if (t === 'SSRF') return '#4ECDC4';
  return '#A0A3B1';
};

const methodColor = (m) => m === 'GET' ? '#2ED573' : '#A78BFA';

const selectSx = {
  color: '#9A90B7',
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
  color: '#9A90B7',
  backgroundColor: '#2A2D3E',
  '&:hover': { backgroundColor: '#313550' },
  '&.Mui-selected': { backgroundColor: '#3a3d5c' },
};

export default function LogsPage() {
  const [severity,   setSeverity]   = useState('ALL');
  const [attackType, setAttackType] = useState('ALL');
  const [server,     setServer]     = useState('ALL');

  const filtered = useMemo(() => allLogs.filter((log) => {
    if (severity   !== 'ALL' && log.severity   !== severity)   return false;
    if (attackType !== 'ALL' && log.attackType !== attackType) return false;
    if (server     !== 'ALL' && log.server     !== server)     return false;
    return true;
  }), [severity, attackType, server]);

  const totalLogs    = 54403;
  const high         = 1847;
  const medium       = 8420;
  const normalTraffic = 44136;

  return (
    <DashboardLayout>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

        {/* Title */}
        <Typography sx={{
          fontSize: '1.3rem', fontWeight: 700,
          letterSpacing: '0.15em', color: '#7C6FF7',
        }}>
          LOGS
        </Typography>

        {/* Stat Cards */}
        <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
          <Box sx={{ flex: 1 }}>
            <StatCard title="TOTAL LOGS"     value="54,403" icon={<ListAltIcon sx={{ fontSize: 32 }} />}      borderColor="#4ECDC4" />
          </Box>
          <Box sx={{ flex: 1 }}>
            <StatCard title="HIGH"           value="1,847"  icon={<WarningAmberIcon sx={{ fontSize: 32 }} />} borderColor="#FF4757" />
          </Box>
          <Box sx={{ flex: 1 }}>
            <StatCard title="MEDIUM"         value="8,420"  icon={<GppBadIcon sx={{ fontSize: 32 }} />}       borderColor="#FFB020" />
          </Box>
          <Box sx={{ flex: 1 }}>
            <StatCard title="NORMAL TRAFFIC" value="44,136" icon={<SecurityIcon sx={{ fontSize: 32 }} />}     borderColor="#2ED573" />
          </Box>
        </Box>

        {/* Filter Bar */}
        <Box sx={{
          backgroundColor: '#1E2235', borderRadius: '12px',
          p: 2, display: 'flex', alignItems: 'center', gap: 2,
        }}>
          <Typography sx={{
            color: '#C2AEFE', fontSize: '0.85rem',
            fontWeight: 600, letterSpacing: '0.1em',
          }}>
            FILTER BY
          </Typography>

          {/* Severity Filter */}
          <Select value={severity} onChange={(e) => setSeverity(e.target.value)} size="small" sx={selectSx}>
            <MenuItem value="ALL"    sx={menuItemSx}>ALL SEVERITY</MenuItem>
            <MenuItem value="High"   sx={menuItemSx}>High</MenuItem>
            <MenuItem value="Medium" sx={menuItemSx}>Medium</MenuItem>
            <MenuItem value="Low"    sx={menuItemSx}>Low</MenuItem>
          </Select>

          {/* Attack Type Filter */}
          <Select value={attackType} onChange={(e) => setAttackType(e.target.value)} size="small" sx={selectSx}>
            <MenuItem value="ALL"  sx={menuItemSx}>ALL ATTACK TYPES</MenuItem>
            <MenuItem value="SQLi" sx={menuItemSx}>SQLi</MenuItem>
            <MenuItem value="XSS"  sx={menuItemSx}>XSS</MenuItem>
            <MenuItem value="DDoS" sx={menuItemSx}>DDoS</MenuItem>
            <MenuItem value="SSRF" sx={menuItemSx}>SSRF</MenuItem>
          </Select>

          {/* Server Filter */}
          <Select value={server} onChange={(e) => setServer(e.target.value)} size="small" sx={selectSx}>
            <MenuItem value="ALL"      sx={menuItemSx}>ALL SERVERS</MenuItem>
            <MenuItem value="Server 1" sx={menuItemSx}>Server 1</MenuItem>
            <MenuItem value="Server 2" sx={menuItemSx}>Server 2</MenuItem>
            <MenuItem value="Server 3" sx={menuItemSx}>Server 3</MenuItem>
            <MenuItem value="Server 4" sx={menuItemSx}>Server 4</MenuItem>
            <MenuItem value="Server 5" sx={menuItemSx}>Server 5</MenuItem>
          </Select>

          {/* Results count */}
          <Typography sx={{ color: '#A0A3B1', fontSize: '0.78rem', ml: 'auto' }}>
            Showing {filtered.length} of {allLogs.length} entries
          </Typography>
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
                      textAlign: 'center', color: '#C2AEFE',
                      fontSize: '0.82rem', border: 'none', py: 4,
                    }}>
                      No logs match the selected filters
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((row) => (
                    <TableRow key={row.id} sx={{ '&:hover': { backgroundColor: '#252840' } }}>
                      <TableCell sx={{ color: '#C2AEFE', fontSize: '0.78rem', borderBottom: '1px solid #2A2D3E', py: 0.9, fontWeight: 600 }}>
                        {row.id}
                      </TableCell>
                      <TableCell sx={{ color: '#C2AEFE', fontSize: '0.78rem', borderBottom: '1px solid #2A2D3E', py: 0.9 }}>
                        {row.timestamp}
                      </TableCell>
                      <TableCell sx={{ color: '#C2AEFE', fontSize: '0.78rem', borderBottom: '1px solid #2A2D3E', py: 0.9 }}>
                        {row.server}
                      </TableCell>
                      <TableCell sx={{ color: '#C2AEFE', fontSize: '0.78rem', borderBottom: '1px solid #2A2D3E', py: 0.9 }}>
                        {row.application}
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid #2A2D3E', py: 0.9 }}>
                        <Typography sx={{ color: methodColor(row.method), fontSize: '0.78rem', fontWeight: 600 }}>
                          {row.method}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ color: '#C2AEFE', fontSize: '0.75rem', borderBottom: '1px solid #2A2D3E', py: 0.9, fontFamily: 'monospace' }}>
                        {row.endpoint}
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid #2A2D3E', py: 0.9 }}>
                        <Chip label={row.attackType} size="small" sx={{
                          backgroundColor: `${threatColor(row.attackType)}22`,
                          color: threatColor(row.attackType),
                          fontWeight: 700, fontSize: '0.7rem',
                          height: 22, borderRadius: '6px',
                        }} />
                      </TableCell>
                      <TableCell sx={{ color: '#C2AEFE', fontSize: '0.78rem', borderBottom: '1px solid #2A2D3E', py: 0.9 }}>
                        {row.parameter}
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid #2A2D3E', py: 0.9 }}>
                        <Typography sx={{
                          color: row.response === 200 ? '#2ED573' : row.response === 404 ? '#A78BFA' : '#FF4757',
                          fontSize: '0.78rem', fontWeight: 600,
                        }}>
                          {row.response}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid #2A2D3E', py: 0.9 }}>
                        <Chip label={row.severity} size="small" sx={{
                          backgroundColor: `${severityColor(row.severity)}22`,
                          color: severityColor(row.severity),
                          fontWeight: 700, fontSize: '0.7rem',
                          height: 22, borderRadius: '6px',
                        }} />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

      </Box>
    </DashboardLayout>
  );
}
