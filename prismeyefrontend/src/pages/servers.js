import { useMemo, useState, useEffect } from 'react';
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
import { useApp } from '../context/AppContext';

const BACKEND = 'http://localhost:5000';

const threatColor = (t) => {
  if (!t) return '#2ED573';
  if (t === 'high')   return '#FF4757';
  if (t === 'medium') return '#FFB020';
  return '#2ED573';
};

const threatLabel = (t) => {
  if (!t) return 'Low';
  return t.charAt(0).toUpperCase() + t.slice(1);
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
        fontSize: '0.78rem', fontWeight: 600, minWidth: 32,
      }}>
        {value}%
      </Typography>
    </Box>
  );
}

export default function ServersPage() {
  const { filteredThreats } = useApp();
  const [metrics, setMetrics] = useState(null);

  // fetch real server metrics every 10 seconds
  useEffect(() => {
    const fetchMetrics = () => {
      fetch(`${BACKEND}/api/server/metrics`)
        .then(r => r.json())
        .then(data => setMetrics(data))
        .catch(console.error);
    };
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 10000);
    return () => clearInterval(interval);
  }, []);

  const serverRows = useMemo(() => {
    // group threats by server
    const serverStats = {};
    filteredThreats.forEach(t => {
      const name = t.server || (metrics?.name) || 'Unknown';
      if (!serverStats[name]) {
        serverStats[name] = { total: 0, high: 0, medium: 0, low: 0 };
      }
      serverStats[name].total++;
      const sev = t.severity?.toLowerCase();
      if (sev === 'high')        serverStats[name].high++;
      else if (sev === 'medium') serverStats[name].medium++;
      else                       serverStats[name].low++;
    });

    // get all unique server names from threats + current server
    const allServers = new Set([
      ...(metrics ? [metrics.name] : []),
      ...filteredThreats.map(t => t.server).filter(Boolean),
    ]);

    const getThreatLevel = (name) => {
      const s = serverStats[name];
      if (!s || s.total === 0) return 'low';
      if (s.high > 0)          return 'high';
      if (s.medium > 0)        return 'medium';
      return 'low';
    };

    return [...allServers].map(name => {
      const isCurrent = metrics && name === metrics.name;
      return {
        name,
        application:  isCurrent ? metrics.application : 'Remote Server',
        uptime:       isCurrent ? metrics.uptime      : '—',
        cpu:          isCurrent ? metrics.cpu         : null,
        memory:       isCurrent ? metrics.memory      : null,
        ip:           isCurrent ? metrics.ip          : '—',
        threatLevel:  getThreatLevel(name),
        totalThreats: serverStats[name]?.total || 0,
      };
    });
  }, [filteredThreats, metrics]);

  const threatCounts = useMemo(() => ({
    high:   serverRows.filter(s => s.threatLevel === 'high').length,
    medium: serverRows.filter(s => s.threatLevel === 'medium').length,
    low:    serverRows.filter(s => s.threatLevel === 'low').length,
  }), [serverRows]);

  return (
    <DashboardLayout>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

        <Typography sx={{
          fontSize: '1.3rem', fontWeight: 700,
          letterSpacing: '0.15em', color: '#7C6FF7',
        }}>
          SERVERS
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
          <Box sx={{ flex: 1 }}>
            <StatCard
              title="TOTAL SERVERS"
              value={String(serverRows.length || 0)}
              icon={<StorageIcon sx={{ fontSize: 32 }} />}
              borderColor="#4ECDC4"
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <StatCard
              title="LOW"
              value={String(threatCounts.low)}
              icon={<SecurityIcon sx={{ fontSize: 32 }} />}
              borderColor="#2ED573"
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <StatCard
              title="MEDIUM"
              value={String(threatCounts.medium)}
              icon={<GppBadIcon sx={{ fontSize: 32 }} />}
              borderColor="#FFB020"
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <StatCard
              title="HIGH"
              value={String(threatCounts.high)}
              icon={<WarningAmberIcon sx={{ fontSize: 32 }} />}
              borderColor="#FF4757"
            />
          </Box>
        </Box>

        <Box sx={{ backgroundColor: '#1E2235', borderRadius: '12px', p: 2.5 }}>
          <TableContainer component={Paper} sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {['SERVER', 'APPLICATION', 'IP ADDRESS', 'THREAT LEVEL', 'TOTAL ATTACKS', 'CPU USAGE', 'MEMORY', 'UPTIME'].map((col) => (
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
                {serverRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} sx={{ textAlign: 'center', color: '#A78BFA', fontSize: '0.82rem', border: 'none', py: 4 }}>
                      {metrics ? 'No servers detected yet.' : 'Loading server data...'}
                    </TableCell>
                  </TableRow>
                ) : serverRows.map((row, i) => (
                  <TableRow key={i} sx={{ '&:hover': { backgroundColor: '#252840' } }}>

                    <TableCell sx={{ color: '#ffffff', fontSize: '0.85rem', fontWeight: 700, borderBottom: '1px solid #2A2D3E', py: 1.8 }}>
                      {row.name}
                    </TableCell>

                    <TableCell sx={{ color: '#C2AEFE', fontSize: '0.82rem', borderBottom: '1px solid #2A2D3E', py: 1.8 }}>
                      {row.application}
                    </TableCell>

                    <TableCell sx={{ color: '#C2AEFE', fontSize: '0.82rem', borderBottom: '1px solid #2A2D3E', py: 1.8 }}>
                      {row.ip}
                    </TableCell>

                    <TableCell sx={{ borderBottom: '1px solid #2A2D3E', py: 1.8 }}>
                      <Chip
                        label={threatLabel(row.threatLevel)}
                        size="small"
                        sx={{
                          backgroundColor: `${threatColor(row.threatLevel)}22`,
                          color: threatColor(row.threatLevel),
                          fontWeight: 700, fontSize: '0.75rem',
                          height: 24, borderRadius: '20px',
                          border: `1px solid ${threatColor(row.threatLevel)}44`,
                        }}
                      />
                    </TableCell>

                    <TableCell sx={{ borderBottom: '1px solid #2A2D3E', py: 1.8 }}>
                      <Typography sx={{
                        color: row.totalThreats > 0 ? threatColor(row.threatLevel) : '#A0A3B1',
                        fontSize: '0.82rem', fontWeight: 700,
                      }}>
                        {row.totalThreats.toLocaleString()}
                      </Typography>
                    </TableCell>

                    <TableCell sx={{ borderBottom: '1px solid #2A2D3E', py: 1.8 }}>
                      {row.cpu !== null
                        ? <ProgressBar value={row.cpu} />
                        : <Typography sx={{ color: '#A0A3B1', fontSize: '0.78rem' }}>—</Typography>
                      }
                    </TableCell>

                    <TableCell sx={{ borderBottom: '1px solid #2A2D3E', py: 1.8 }}>
                      {row.memory !== null
                        ? <ProgressBar value={row.memory} />
                        : <Typography sx={{ color: '#A0A3B1', fontSize: '0.78rem' }}>—</Typography>
                      }
                    </TableCell>

                    <TableCell sx={{ color: '#C2AEFE', fontSize: '0.82rem', fontWeight: 600, borderBottom: '1px solid #2A2D3E', py: 1.8 }}>
                      {row.uptime}
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