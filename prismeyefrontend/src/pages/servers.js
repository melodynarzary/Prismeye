import {
  Box, Typography, Chip,
  Table, TableBody, TableCell,
  TableContainer, TableHead,
  TableRow, Paper
} from '@mui/material';
import DashboardLayout from '../components/layout/DashboardLayout';
import StorageIcon from '@mui/icons-material/Storage';
import SecurityIcon from '@mui/icons-material/Security';
import GppBadIcon from '@mui/icons-material/GppBad';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { StatCard } from '../components/ui';

const servers = [
  { name: 'Server 1', application: 'E-commerce',  threatLevel: 'Low',    uptime: '99.8%', cpu: 42, memory: 55, network: '1.2 GB/s' },
  { name: 'Server 2', application: 'Banking',      threatLevel: 'High',   uptime: '97.3%', cpu: 91, memory: 88, network: '4.7 GB/s' },
  { name: 'Server 3', application: 'Payment svc',  threatLevel: 'Medium', uptime: '98.8%', cpu: 74, memory: 70, network: '2.8 GB/s' },
  { name: 'Server 4', application: 'LesArtisans',  threatLevel: 'Medium', uptime: '99.2%', cpu: 78, memory: 65, network: '3.1 GB/s' },
  { name: 'Server 5', application: 'Ka Bible',     threatLevel: 'Low',    uptime: '96.2%', cpu: 38, memory: 47, network: '0.8 GB/s' },
];

const threatColor = (t) => {
  if (t === 'High')   return '#FF4757';
  if (t === 'Medium') return '#FFB020';
  return '#2ED573';
};

const barColor = (val) => {
  if (val >= 85) return '#FF4757';
  if (val >= 65) return '#FFB020';
  return '#2ED573';
};

function ProgressBar({ value }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Box sx={{
        width: 120, height: 6,
        backgroundColor: '#2A2D3E',
        borderRadius: 3, overflow: 'hidden',
      }}>
        <Box sx={{
          height: '100%',
          width: `${value}%`,
          backgroundColor: barColor(value),
          borderRadius: 3,
        }} />
      </Box>
      <Typography sx={{
        color: barColor(value),
        fontSize: '0.78rem',
        fontWeight: 600,
        minWidth: 32,
      }}>
        {value}%
      </Typography>
    </Box>
  );
}

export default function ServersPage() {
  return (
    <DashboardLayout>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

        {/* Title */}
        <Typography sx={{
          fontSize: '1.3rem', fontWeight: 700,
          letterSpacing: '0.15em', color: '#7C6FF7',
        }}>
          SERVERS
        </Typography>

        {/* Stat Cards */}
        <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
          <Box sx={{ flex: 1 }}>
            <StatCard title="TOTAL SERVERS" value="5" icon={<StorageIcon sx={{ fontSize: 32 }} />}      borderColor="#4ECDC4" />
          </Box>
          <Box sx={{ flex: 1 }}>
            <StatCard title="LOW"           value="2" icon={<SecurityIcon sx={{ fontSize: 32 }} />}     borderColor="#2ED573" />
          </Box>
          <Box sx={{ flex: 1 }}>
            <StatCard title="MEDIUM"        value="2" icon={<GppBadIcon sx={{ fontSize: 32 }} />}       borderColor="#FFB020" />
          </Box>
          <Box sx={{ flex: 1 }}>
            <StatCard title="HIGH"          value="1" icon={<WarningAmberIcon sx={{ fontSize: 32 }} />} borderColor="#FF4757" />
          </Box>
        </Box>

        {/* Servers Table */}
        <Box sx={{ backgroundColor: '#1E2235', borderRadius: '12px', p: 2.5 }}>
          <TableContainer component={Paper} sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {['SERVERS', 'APPLICATIONS', 'THREAT LEVEL', 'UPTIME', 'CPU USAGE', 'MEMORY', 'NETWORK'].map((col) => (
                    <TableCell key={col} sx={{
                      color: '#9A90B7', fontSize: '0.72rem', fontWeight: 600,
                      letterSpacing: '0.08em', borderBottom: '1px solid #2A2D3E',
                      py: 1.5, whiteSpace: 'nowrap',
                    }}>
                      {col}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {servers.map((row, i) => (
                  <TableRow key={i} sx={{ '&:hover': { backgroundColor: '#252840' } }}>

                    <TableCell sx={{ color: '#ffffff', fontSize: '0.85rem', fontWeight: 700, borderBottom: '1px solid #2A2D3E', py: 1.8 }}>
                      {row.name}
                    </TableCell>

                    <TableCell sx={{ color: '#C2AEFE', fontSize: '0.82rem', borderBottom: '1px solid #2A2D3E', py: 1.8 }}>
                      {row.application}
                    </TableCell>

                    <TableCell sx={{ borderBottom: '1px solid #2A2D3E', py: 1.8 }}>
                      <Chip label={row.threatLevel} size="small" sx={{
                        backgroundColor: `${threatColor(row.threatLevel)}22`,
                        color: threatColor(row.threatLevel),
                        fontWeight: 700, fontSize: '0.75rem',
                        height: 24, borderRadius: '20px',
                        border: `1px solid ${threatColor(row.threatLevel)}44`,
                      }} />
                    </TableCell>

                    <TableCell sx={{ color: '#C2AEFE', fontSize: '0.82rem', fontWeight: 600, borderBottom: '1px solid #2A2D3E', py: 1.8 }}>
                      {row.uptime}
                    </TableCell>

                    <TableCell sx={{ borderBottom: '1px solid #2A2D3E', py: 1.8 }}>
                      <ProgressBar value={row.cpu} />
                    </TableCell>

                    <TableCell sx={{ borderBottom: '1px solid #2A2D3E', py: 1.8 }}>
                      <ProgressBar value={row.memory} />
                    </TableCell>

                    <TableCell sx={{
                      color: row.network === '4.7 GB/s' ? '#FF4757' : '#C2AEFE',
                      fontSize: '0.82rem', fontWeight: 600,
                      borderBottom: '1px solid #2A2D3E', py: 1.8,
                    }}>
                      {row.network}
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
