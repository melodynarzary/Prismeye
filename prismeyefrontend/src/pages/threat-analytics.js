import { Box, Typography, Tooltip as MuiTooltip } from '@mui/material';
import { DashboardLayout } from '../components/layout';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ListIcon from '@mui/icons-material/List';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import { StatCard } from '../components/ui';
import {
  LineChart, Line, XAxis, YAxis,
  Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { useApp } from '../context/AppContext';

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

const DONUT_COLORS = {
  ddos:  '#35a1ff',
  sqli:  '#FF4757',
  xss:   '#7C6FF7',
  ssrf:  '#4ECDC4',
  cmd:   '#FF6B35',
  path:  '#FFB020',
  lfi:   '#2ED573',
  nosql: '#bbe437',
  xxe:   '#F8BBD9',
  crlf:  '#e350ad',
};

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

const keyToLabel = (key) => ATTACK_LINES.find(a => a.key === key)?.label || key;

const truncate = (str, max = 12) =>
  str && str.length > max ? str.substring(0, max) + '...' : str;

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
          <Typography key={entry.name} sx={{ color: entry.color, fontSize: '0.75rem' }}>
            {entry.name}: {entry.value}
          </Typography>
        ))}
      </Box>
    );
  }
  return null;
};

export default function ThreatAnalyticsPage() {
  const { filteredThreats, filteredStats } = useApp();

  const topAttackType = (() => {
    if (!filteredThreats || filteredThreats.length === 0) return '—';
    const keyCount = {};
    filteredThreats.forEach(t => {
      const key = typeToKey(t.type);
      if (key) keyCount[key] = (keyCount[key] || 0) + 1;
    });
    if (Object.keys(keyCount).length === 0) return '—';
    const topKey = Object.entries(keyCount).sort(([,a],[,b]) => b - a)[0][0];
    return keyToLabel(topKey);
  })();

  const mostTargeted = (() => {
    if (!filteredThreats || filteredThreats.length === 0) return '—';
    const counts = {};
    filteredThreats.forEach(t => {
      if (t.target) {
        const endpoint = t.target.split('?')[0];
        if (endpoint && endpoint !== '/') {
          counts[endpoint] = (counts[endpoint] || 0) + 1;
        }
      }
    });
    if (Object.keys(counts).length === 0) return '—';
    return Object.entries(counts).sort(([,a],[,b]) => b - a)[0]?.[0] || '—';
  })();

  const chartData = (() => {
    if (!filteredThreats || filteredThreats.length === 0) return [];
    const buckets = {};
    filteredThreats.forEach(t => {
      const d = new Date(t.timestamp);
      const bucket = `${d.getHours()}:${String(d.getMinutes()).padStart(2, '00')}`;
      if (!buckets[bucket]) {
        buckets[bucket] = { time: bucket, ddos: 0, sqli: 0, xss: 0, ssrf: 0, cmd: 0, path: 0, lfi: 0, nosql: 0, xxe: 0 };
      }
      const key = typeToKey(t.type);
      if (key) buckets[bucket][key]++;
    });
    return Object.values(buckets)
      .sort((a, b) => a.time.localeCompare(b.time))
      .slice(-20);
  })();

  const donutData = (() => {
    if (!filteredThreats || filteredThreats.length === 0) return [];
    const keyCount = {};
    filteredThreats.forEach(t => {
      const key = typeToKey(t.type);
      if (key) keyCount[key] = (keyCount[key] || 0) + 1;
    });
    const total = Object.values(keyCount).reduce((a, b) => a + b, 0);
    if (total === 0) return [];
    return Object.entries(keyCount)
      .map(([key, count]) => ({
        name:  keyToLabel(key),
        value: Math.round((count / total) * 100),
        color: DONUT_COLORS[key] || '#A0A3B1',
      }))
      .sort((a, b) => b.value - a.value);
  })();

  return (
    <DashboardLayout>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

        <Typography sx={{
          fontSize: '1.3rem', fontWeight: 700,
          letterSpacing: '0.15em', color: '#7C6FF7',
        }}>
          THREAT ANALYTICS
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
          <Box sx={{ flex: 1 }}>
            <StatCard
              title="TOTAL ATTACKS"
              value={(filteredStats.total || 0).toLocaleString()}
              icon={<WarningAmberIcon sx={{ fontSize: 32 }} />}
              borderColor="#FF4757"
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <StatCard
              title="TOP ATTACK TYPE"
              value={topAttackType}
              icon={<ListIcon sx={{ fontSize: 32 }} />}
              borderColor="#4ECDC4"
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <MuiTooltip title={mostTargeted !== '—' ? mostTargeted : ''} placement="bottom" arrow>
              <Box>
                <StatCard
                  title="MOST TARGETED"
                  value={truncate(mostTargeted, 12)}
                  icon={<TrackChangesIcon sx={{ fontSize: 32 }} />}
                  borderColor="#7C6FF7"
                />
              </Box>
            </MuiTooltip>
          </Box>
        </Box>

        {/* Attack Trends */}
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
                    <Line key={item.key} type="monotone" dataKey={item.key} stroke={item.color} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
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

        {/* Bottom Row */}
        <Box sx={{ display: 'flex', gap: 2 }}>

          {/* Threat Distribution */}
          <Box sx={{
            flex: 2, backgroundColor: '#1E2235', borderRadius: '12px',
            p: 2.5, minHeight: 280, display: 'flex', flexDirection: 'column',
          }}>
            <Typography sx={{ color: '#7C6FF7', fontWeight: 600, fontSize: '0.95rem', mb: 1.5 }}>
              Threat Distribution
            </Typography>
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 4 }}>
              <Box sx={{ position: 'relative', width: 180, height: 180, flexShrink: 0 }}>
                <PieChart width={180} height={180}>
                  <Pie
                    data={donutData.length > 0 ? donutData : [{ name: 'empty', value: 1, color: '#2A2D3E' }]}
                    cx={85} cy={85}
                    innerRadius={55} outerRadius={85}
                    dataKey="value" strokeWidth={0}
                  >
                    {(donutData.length > 0 ? donutData : [{ color: '#2A2D3E' }]).map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
                <Box sx={{
                  position: 'absolute', top: '50%', left: '50%',
                  transform: 'translate(-50%, -50%)', textAlign: 'center',
                }}>
                  <Typography sx={{ color: '#ffffff', fontWeight: 700, fontSize: '1rem', lineHeight: 1.2 }}>
                    {filteredStats.total > 0 ? (filteredStats.total >= 1000 ? `${(filteredStats.total / 1000).toFixed(1)}K` : filteredStats.total) : '0'}
                  </Typography>
                  <Typography sx={{ color: '#A78BFA', fontSize: '0.65rem', fontWeight: 600 }}>
                    ATTACKS
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {donutData.length > 0 ? donutData.map((item) => (
                  <Box key={item.name} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: item.color, flexShrink: 0 }} />
                    <Typography sx={{ color: '#A78BFA', fontSize: '0.82rem', minWidth: 50 }}>
                      {item.name}
                    </Typography>
                    <Typography sx={{ color: '#ffffff', fontSize: '0.82rem', fontWeight: 600 }}>
                      {item.value}%
                    </Typography>
                  </Box>
                )) : (
                  <Typography sx={{ color: '#A0A3B1', fontSize: '0.8rem' }}>No data yet...</Typography>
                )}
              </Box>
            </Box>
          </Box>

          {/* Severity Summary */}
          <Box sx={{
            flex: 3, backgroundColor: '#1E2235', borderRadius: '12px',
            p: 2.5, minHeight: 280,
          }}>
            <Typography sx={{
              color: '#7C6FF7', fontWeight: 600,
              fontSize: '0.85rem', letterSpacing: '0.1em', mb: 2,
            }}>
              SEVERITY SUMMARY
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {[
                { label: 'High',   color: '#FF4757', value: filteredStats.high   || 0 },
                { label: 'Medium', color: '#FFB020', value: filteredStats.medium || 0 },
                { label: 'Low',    color: '#2ED573', value: filteredStats.low    || 0 },
              ].map((item) => (
                <Box key={item.label} sx={{
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between',
                  py: 1, borderBottom: '1px solid #2A2D3E',
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: item.color }} />
                    <Typography sx={{ color: item.color, fontSize: '0.88rem', fontWeight: 600 }}>
                      {item.label}
                    </Typography>
                  </Box>
                  <Typography sx={{ color: '#ffffff', fontSize: '1rem', fontWeight: 700 }}>
                    {item.value.toLocaleString()}
                  </Typography>
                </Box>
              ))}
            </Box>
            <Box sx={{
              mt: 3, width: '100%', height: 10,
              borderRadius: 5, overflow: 'hidden', display: 'flex',
            }}>
              <Box sx={{ flex: filteredStats.high   || 0, backgroundColor: '#FF4757', transition: 'flex 0.4s ease' }} />
              <Box sx={{ flex: filteredStats.medium || 0, backgroundColor: '#FFB020', transition: 'flex 0.4s ease' }} />
              <Box sx={{ flex: filteredStats.low    || 0, backgroundColor: '#2ED573', transition: 'flex 0.4s ease' }} />
              {filteredStats.total === 0 && <Box sx={{ flex: 1, backgroundColor: '#2A2D3E' }} />}
            </Box>
          </Box>
        </Box>
      </Box>
    </DashboardLayout>
  );
}