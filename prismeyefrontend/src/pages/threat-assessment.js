import { useState, useMemo } from 'react';
import {
  Box, Typography, Select, MenuItem, Chip,
  Table, TableBody, TableCell,
  TableContainer, TableHead,
  TableRow, Paper
} from '@mui/material';
import DashboardLayout from '../components/layout/DashboardLayout';

const severityData = [
  { label: 'High',   color: '#FF4757', value: 1204 },
  { label: 'Medium', color: '#FFB020', value: 3871 },
  { label: 'Low',    color: '#2ED573', value: 3183 },
];

const topTargeted = [
  { name: 'Banking',     hits: 1842, color: '#FF4757' },
  { name: 'LesArtisans', hits: 1204, color: '#A78BFA' },
  { name: 'Payment svg', hits: 987,  color: '#4ECDC4' },
];

const allAlerts = [
  { time: '16:47', server: 'Server 2', application: 'Banking',     threatType: 'SQLi', parameter: 'username', severity: 'High',   response: 500 },
  { time: '16:44', server: 'Server 1', application: 'LesArtisans', threatType: 'XSS',  parameter: 'password', severity: 'Medium', response: 404 },
  { time: '16:41', server: 'Server 3', application: 'E-commerce',  threatType: 'DDoS', parameter: '/search',  severity: 'Low',    response: 200 },
  { time: '16:30', server: 'Server 4', application: 'LesArtisans', threatType: 'SQLi', parameter: 'password', severity: 'High',   response: 500 },
  { time: '16:25', server: 'Server 3', application: 'Banking',     threatType: 'SSRF', parameter: 'url',      severity: 'Medium', response: 403 },
  { time: '16:18', server: 'Server 2', application: 'E-commerce',  threatType: 'DDoS', parameter: '/product', severity: 'Low',    response: 200 },
  { time: '16:11', server: 'Server 5', application: 'Ka Bible',    threatType: 'XSS',  parameter: 'password', severity: 'Medium', response: 404 },
  { time: '16:03', server: 'Server 1', application: 'Payment svg', threatType: 'SQLi', parameter: 'email',    severity: 'High',   response: 500 },
];

const total = severityData.reduce((s, i) => s + i.value, 0);

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

const selectSx = {
  color: '#9A90B7', fontSize: '0.8rem',
  backgroundColor: '#2A2D3E', borderRadius: '8px', minWidth: 180,
  '.MuiOutlinedInput-notchedOutline': { border: 'none' },
  '.MuiSvgIcon-root': { color: '#A78BFA' },
  '&:hover': { backgroundColor: '#313550' },
};

const menuItemSx = {
  fontSize: '0.82rem', color: '#9A90B7',
  backgroundColor: '#2A2D3E',
  '&:hover': { backgroundColor: '#313550' },
  '&.Mui-selected': { backgroundColor: '#3a3d5c' },
};

export default function ThreatAssessmentPage() {
  const [severity,   setSeverity]   = useState('ALL');
  const [attackType, setAttackType] = useState('ALL');
  const [server,     setServer]     = useState('ALL');

  const filtered = useMemo(() => allAlerts.filter((a) => {
    if (severity   !== 'ALL' && a.severity   !== severity)   return false;
    if (attackType !== 'ALL' && a.threatType !== attackType) return false;
    if (server     !== 'ALL' && a.server     !== server)     return false;
    return true;
  }), [severity, attackType, server]);

  return (
    <DashboardLayout>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

        {/* Title */}
        <Typography sx={{
          fontSize: '1.3rem', fontWeight: 700,
          letterSpacing: '0.15em', color: '#7C6FF7',
        }}>
          THREAT ASSESSMENT
        </Typography>

        {/* Top Cards Row */}
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

            {/* Stacked bar */}
            <Box sx={{ display: 'flex', height: 10, borderRadius: 3, overflow: 'hidden', mt: 2.5 }}>
              {severityData.map((item) => (
                <Box key={item.label} sx={{
                  width: `${(item.value / total) * 100}%`,
                  backgroundColor: item.color,
                }} />
              ))}
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
              {topTargeted.map((item) => (
                <Box key={item.name} sx={{
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between',
                  py: 1, borderBottom: '1px solid #2A2D3E',
                }}>
                  <Typography sx={{ color: '#ffffff', fontSize: '0.9rem', fontWeight: 500 }}>
                    {item.name}
                  </Typography>
                  <Chip
                    label={`${item.hits.toLocaleString()} Hits`}
                    size="small"
                    sx={{
                      backgroundColor: `${item.color}33`,
                      color: item.color,
                      fontWeight: 700, fontSize: '0.75rem',
                      height: 24, borderRadius: '20px',
                      border: `1px solid ${item.color}55`,
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        {/* Recent Alerts Title */}
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

          <Select value={severity} onChange={(e) => setSeverity(e.target.value)} size="small" sx={selectSx}>
            <MenuItem value="ALL"    sx={menuItemSx}>ALL SEVERITY</MenuItem>
            <MenuItem value="High"   sx={menuItemSx}>High</MenuItem>
            <MenuItem value="Medium" sx={menuItemSx}>Medium</MenuItem>
            <MenuItem value="Low"    sx={menuItemSx}>Low</MenuItem>
          </Select>

          <Select value={attackType} onChange={(e) => setAttackType(e.target.value)} size="small" sx={selectSx}>
            <MenuItem value="ALL"  sx={menuItemSx}>ALL ATTACK TYPES</MenuItem>
            <MenuItem value="SQLi" sx={menuItemSx}>SQLi</MenuItem>
            <MenuItem value="XSS"  sx={menuItemSx}>XSS</MenuItem>
            <MenuItem value="DDoS" sx={menuItemSx}>DDoS</MenuItem>
            <MenuItem value="SSRF" sx={menuItemSx}>SSRF</MenuItem>
          </Select>

          <Select value={server} onChange={(e) => setServer(e.target.value)} size="small" sx={selectSx}>
            <MenuItem value="ALL"      sx={menuItemSx}>ALL SERVERS</MenuItem>
            <MenuItem value="Server 1" sx={menuItemSx}>Server 1</MenuItem>
            <MenuItem value="Server 2" sx={menuItemSx}>Server 2</MenuItem>
            <MenuItem value="Server 3" sx={menuItemSx}>Server 3</MenuItem>
            <MenuItem value="Server 4" sx={menuItemSx}>Server 4</MenuItem>
            <MenuItem value="Server 5" sx={menuItemSx}>Server 5</MenuItem>
          </Select>

          <Typography sx={{ color: '#A0A3B1', fontSize: '0.78rem', ml: 'auto' }}>
            Showing {filtered.length} of {allAlerts.length} entries
          </Typography>
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
                    <TableCell colSpan={7} sx={{
                      textAlign: 'center', color: '#A78BFA',
                      fontSize: '0.82rem', border: 'none', py: 4,
                    }}>
                      No alerts match the selected filters
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((row, i) => (
                    <TableRow key={i} sx={{ '&:hover': { backgroundColor: '#252840' } }}>
                      <TableCell sx={{ color: '#C2AEFE', fontSize: '0.78rem', borderBottom: '1px solid #2A2D3E', py: 1 }}>
                        {row.time}
                      </TableCell>
                      <TableCell sx={{ color: '#C2AEFE', fontSize: '0.78rem', borderBottom: '1px solid #2A2D3E', py: 1 }}>
                        {row.server}
                      </TableCell>
                      <TableCell sx={{ color: '#C2AEFE', fontSize: '0.78rem', borderBottom: '1px solid #2A2D3E', py: 1 }}>
                        {row.application}
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid #2A2D3E', py: 1 }}>
                        <Chip label={row.threatType} size="small" sx={{
                          backgroundColor: `${threatColor(row.threatType)}22`,
                          color: threatColor(row.threatType),
                          fontWeight: 700, fontSize: '0.7rem',
                          height: 22, borderRadius: '6px',
                        }} />
                      </TableCell>
                      <TableCell sx={{ color: '#C2AEFE', fontSize: '0.78rem', borderBottom: '1px solid #2A2D3E', py: 1 }}>
                        {row.parameter}
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid #2A2D3E', py: 1 }}>
                        <Chip label={row.severity} size="small" sx={{
                          backgroundColor: `${severityColor(row.severity)}22`,
                          color: severityColor(row.severity),
                          fontWeight: 700, fontSize: '0.7rem',
                          height: 22, borderRadius: '6px',
                        }} />
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid #2A2D3E', py: 1 }}>
                        <Typography sx={{
                          color: row.response === 200 ? '#2ED573' : '#FF4757',
                          fontSize: '0.78rem', fontWeight: 600,
                        }}>
                          {row.response}
                        </Typography>
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
