import { useState } from 'react';
import {
  Box, Typography,
  Table, TableBody, TableCell,
  TableContainer, TableHead,
  TableRow, Paper, Chip
} from '@mui/material';
import DashboardLayout from '../components/layout/DashboardLayout';
import { StatCard, AlertModal } from '../components/ui';
import SecurityIcon from '@mui/icons-material/Security';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ShieldIcon from '@mui/icons-material/Shield';
import StorageIcon from '@mui/icons-material/Storage';
import {
  LineChart, Line, XAxis, YAxis,
  Tooltip, ResponsiveContainer
} from 'recharts';

const trendData = [
  { time: '16:00', SQLi: 180, XSS: 80,  DDoS: 120, SSRF: 60  },
  { time: '16:15', SQLi: 220, XSS: 100, DDoS: 150, SSRF: 75  },
  { time: '16:30', SQLi: 280, XSS: 130, DDoS: 180, SSRF: 85  },
  { time: '16:45', SQLi: 380, XSS: 160, DDoS: 200, SSRF: 95  },
  { time: '17:00', SQLi: 550, XSS: 190, DDoS: 230, SSRF: 110 },
];

const recentAlerts = [
  { time: '16:47', server: 'Server 2', application: 'Banking',     threatType: 'SQLi', parameter: 'username',  severity: 'High',   response: 500 },
  { time: '16:44', server: 'Server 1', application: 'LesArtisans', threatType: 'XSS',  parameter: 'password',  severity: 'Medium', response: 404 },
  { time: '16:41', server: 'Server 3', application: 'E-commerce',  threatType: 'DDoS', parameter: '/search',   severity: 'Low',    response: 200 },
  { time: '16:30', server: 'Server 4', application: 'LesArtisans', threatType: 'SQLi', parameter: 'password',  severity: 'High',   response: 500 },
  { time: '16:25', server: 'Server 3', application: 'Banking',     threatType: 'SSRF', parameter: 'url',       severity: 'Medium', response: 403 },
  { time: '16:18', server: 'Server 2', application: 'E-commerce',  threatType: 'DDoS', parameter: '/product',  severity: 'Low',    response: 200 },
  { time: '16:11', server: 'Server 5', application: 'Ka Bible',    threatType: 'XSS',  parameter: 'password',  severity: 'Medium', response: 404 },
  { time: '16:03', server: 'Server 1', application: 'Payment svg', threatType: 'SQLi', parameter: 'email',     severity: 'High',   response: 500 },
];

const applications = [
  { name: 'LesArtisans', server: 'Server 1' },
  { name: 'Payment svg', server: 'Server 4' },
  { name: 'Ka Bible',    server: 'Server 2' },
  { name: 'Banking',     server: 'Server 3' },
  { name: 'E-Commerce',  server: 'Server 5' },
];

const httpCodes = [
  { code: 200, label: 'OK',                    color: '#2ED573', value: 41200, display: '41.2K' },
  { code: 404, label: 'Not Found',             color: '#7C6FF7', value: 6840,  display: '6,840' },
  { code: 403, label: 'Forbidden',             color: '#FFB020', value: 3921,  display: '3,921' },
  { code: 500, label: 'Internal Server Error', color: '#FF4757', value: 1847,  display: '1,847' },
];

const maxHttp = 41200;

const severityColor = (s) => {
  if (s === 'High')   return '#FF4757';
  if (s === 'Medium') return '#FFB020';
  return '#2ED573';
};

const threatColor = (t) => {
  if (t === 'SQLi') return '#FF4757';
  if (t === 'XSS')  return '#7C6FF7';
  if (t === 'DDoS') return '#FF6B9D';
  if (t === 'SSRF') return '#4ECDC4';
  return '#A0A3B1';
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
          <Typography key={entry.name} sx={{
            color: entry.color,
            fontSize: '0.75rem',
          }}>
            {entry.name}: {entry.value}
          </Typography>
        ))}
      </Box>
    );
  }
  return null;
};

export default function DashboardPage() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <DashboardLayout>
      <AlertModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        attackType="SQL Injection"
        server="Server 1"
        application="E-commerce"
      />

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

        {/* Title */}
        <Typography sx={{
          fontSize: '1.3rem',
          fontWeight: 700,
          letterSpacing: '0.15em',
          color: '#7C6FF7',
        }}>
          DASHBOARD
        </Typography>

        {/* Stat Cards */}
        <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
          <Box sx={{ flex: 1 }}>
            <StatCard title="TOTAL ATTACKS"   value="8,420" icon={<SecurityIcon sx={{ fontSize: 32 }} />}     borderColor="#4ECDC4" />
          </Box>
          <Box sx={{ flex: 1 }}>
            <StatCard title="HIGH SEVERITY"   value="1,235" icon={<WarningAmberIcon sx={{ fontSize: 32 }} />} borderColor="#FF4757" />
          </Box>
          <Box sx={{ flex: 1 }}>
            <StatCard title="MEDIUM SEVERITY" value="845"   icon={<ShieldIcon sx={{ fontSize: 32 }} />}       borderColor="#FFB020" />
          </Box>
          <Box sx={{ flex: 1 }}>
            <StatCard title="ACTIVE SERVERS"  value="5"     icon={<StorageIcon sx={{ fontSize: 32 }} />}      borderColor="#2ED573" />
          </Box>
        </Box>

        {/* Main Content */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'stretch', width: '100%' }}>

          {/* Left Side */}
          <Box sx={{ flex: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>

            {/* Attack Trends */}
            <Box sx={{
              backgroundColor: '#1E2235',
              borderRadius: '12px',
              p: 2.5,
              height: 320,
              display: 'flex',
              flexDirection: 'column',
            }}>
              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 1.5,
              }}>
                <Typography sx={{ color: '#7C6FF7', fontWeight: 600, fontSize: '0.95rem' }}>
                  Attack Trends
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  {[
                    { label: 'SQLi', color: '#7C6FF7' },
                    { label: 'XSS',  color: '#FF6B9D' },
                    { label: 'DDoS', color: '#2ED573' },
                    { label: 'SSRF', color: '#4ECDC4' },
                  ].map((item) => (
                    <Box key={item.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Box sx={{ width: 20, height: 3, backgroundColor: item.color, borderRadius: 2 }} />
                      <Typography sx={{ color: '#A0A3B1', fontSize: '0.72rem' }}>{item.label}</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <XAxis
                      dataKey="time"
                      stroke="#2A2D3E"
                      tick={{ fill: '#A0A3B1', fontSize: 11 }}
                    />
                    <YAxis
                      stroke="#2A2D3E"
                      tick={{ fill: '#A0A3B1', fontSize: 11 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="SQLi" stroke="#7C6FF7" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="XSS"  stroke="#FF6B9D" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="DDoS" stroke="#2ED573" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="SSRF" stroke="#4ECDC4" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Box>

            {/* Recent Alerts Table */}
            <Box sx={{ backgroundColor: '#1E2235', borderRadius: '12px', p: 2.5 }}>
              <Typography sx={{
                color: '#7C6FF7', fontWeight: 600,
                letterSpacing: '0.1em', fontSize: '0.9rem', mb: 1.5,
              }}>
                RECENT ALERTS
              </Typography>
              <TableContainer component={Paper} sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      {['TIME', 'SERVERS', 'APPLICATION', 'THREAT TYPE', 'PARAMETER', 'SEVERITY', 'RESPONSE'].map((col) => (
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
                    {recentAlerts.map((row, i) => (
                      <TableRow key={i} sx={{ '&:hover': { backgroundColor: '#252840' } }}>
                        <TableCell sx={{ color: '#C2AEFE', fontSize: '0.78rem', borderBottom: '1px solid #2A2D3E', py: 0.8 }}>
                          {row.time}
                        </TableCell>
                        <TableCell sx={{ color: '#C2AEFE', fontSize: '0.78rem', borderBottom: '1px solid #2A2D3E', py: 0.8 }}>
                          {row.server}
                        </TableCell>
                        <TableCell sx={{ color: '#C2AEFE', fontSize: '0.78rem', borderBottom: '1px solid #2A2D3E', py: 0.8 }}>
                          {row.application}
                        </TableCell>
                        <TableCell sx={{ borderBottom: '1px solid #2A2D3E', py: 0.8 }}>
                          <Chip label={row.threatType} size="small" sx={{
                            backgroundColor: `${threatColor(row.threatType)}22`,
                            color: threatColor(row.threatType),
                            fontWeight: 700, fontSize: '0.7rem',
                            height: 22, borderRadius: '6px',
                          }} />
                        </TableCell>
                        <TableCell sx={{ color: '#C2AEFE', fontSize: '0.78rem', borderBottom: '1px solid #2A2D3E', py: 0.8 }}>
                          {row.parameter}
                        </TableCell>
                        <TableCell sx={{ borderBottom: '1px solid #2A2D3E', py: 0.8 }}>
                          <Chip label={row.severity} size="small" sx={{
                            backgroundColor: `${severityColor(row.severity)}22`,
                            color: severityColor(row.severity),
                            fontWeight: 700, fontSize: '0.7rem',
                            height: 22, borderRadius: '6px',
                          }} />
                        </TableCell>
                        <TableCell sx={{ borderBottom: '1px solid #2A2D3E', py: 0.8 }}>
                          <Typography sx={{
                            color: row.response === 200 ? '#2ED573' : '#FF4757',
                            fontSize: '0.78rem', fontWeight: 600,
                          }}>
                            {row.response}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Box>

          {/* Right Side */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>

            {/* Applications Panel */}
            <Box sx={{ backgroundColor: '#1E2235', borderRadius: '12px', p: 2.5, flex: 1, minHeight: 320 }}>
              <Typography sx={{ color: '#7C6FF7', fontWeight: 600, fontSize: '0.95rem', mb: 1.5 }}>
                Applications
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {applications.map((app, i) => (
                  <Box key={i} sx={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', py: 1,
                    borderBottom: i < applications.length - 1 ? '1px solid #2A2D3E' : 'none',
                  }}>
                    <Typography sx={{ color: '#ffffff', fontSize: '0.85rem' }}>
                      {app.name}
                    </Typography>
                    <Typography sx={{ color: '#A0A3B1', fontSize: '0.78rem' }}>
                      {app.server}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* HTTP Response Codes */}
            <Box sx={{ backgroundColor: '#1E2235', borderRadius: '12px', p: 2.5, flex: 1 }}>
              <Typography sx={{ color: '#7C6FF7', fontWeight: 600, fontSize: '0.95rem', mb: 2 }}>
                HTTP Response Codes
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {httpCodes.map((item) => (
                  <Box key={item.code}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography sx={{ color: '#ffffff', fontSize: '0.82rem', fontWeight: 600, minWidth: 32 }}>
                          {item.code}
                        </Typography>
                        <Typography sx={{ color: '#A0A3B1', fontSize: '0.75rem' }}>
                          {item.label}
                        </Typography>
                      </Box>
                      <Typography sx={{ color: '#ffffff', fontSize: '0.78rem', fontWeight: 600 }}>
                        {item.display}
                      </Typography>
                    </Box>
                    <Box sx={{ height: 6, backgroundColor: '#2A2D3E', borderRadius: 3, overflow: 'hidden' }}>
                      <Box sx={{
                        height: '100%',
                        width: `${(item.value / maxHttp) * 100}%`,
                        backgroundColor: item.color,
                        borderRadius: 3,
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