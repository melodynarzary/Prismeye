import { Box, Typography } from '@mui/material';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ListAltIcon from '@mui/icons-material/ListAlt';
import StorageIcon from '@mui/icons-material/Storage';
import SettingsIcon from '@mui/icons-material/Settings';
import ShieldIcon from '@mui/icons-material/Shield';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const PURPLE = '#7C6FF7';
const GREEN = '#2ED573';
const AMBER = '#FFB020';
const RED = '#FF4757';

const legend = [
  { name: 'DDoS', color: '#49C6E5' },
  { name: 'SQLi', color: '#FF5B6E' },
  { name: 'XSS', color: '#8B7BFF' },
  { name: 'SSRF', color: '#5DD39E' },
  { name: 'CMDi', color: '#FF9F43' },
  { name: 'Path', color: '#FFB020' },
  { name: 'LFI', color: '#26C281' },
  { name: 'NoSQLi', color: '#F368E0' },
  { name: 'XXE', color: '#FF8FAB' },
  { name: 'CRLF', color: '#6C5CE7' },
];

const chartLines = [
  { points: '0,140 50,138 100,135 150,130 200,100 250,60 300,30 350,50 400,130 450,138 500,140', color: '#49C6E5', width: 1.5 },
  { points: '0,140 50,138 100,120 150,80 200,20 250,80 300,120 350,130 400,138 450,140 500,140', color: '#FF5B6E', width: 2 },
  { points: '0,140 50,139 100,132 150,110 200,70 250,100 300,125 350,135 400,139 450,140 500,140', color: '#8B7BFF', width: 1.5 },
  { points: '0,140 50,139 100,137 150,136 200,134 250,136 300,137 350,138 400,139 450,139 500,140', color: '#5DD39E', width: 1 },
  { points: '0,140 50,139 100,138 150,137 200,136 250,137 300,138 350,139 400,139 450,140 500,140', color: '#FF9F43', width: 1 },
];

const alerts = [
  ['11:45 AM', 'DESKTOP-G0QQS57', 'Unknown', 'CRLF', '/api/test', 'High', '200'],
  ['03:16 PM', 'DESKTOP-G0QQS57', 'LesArtisans', 'SQLi', "id=' OR 1=1--", 'High', '200'],
  ['02:08 PM', 'DESKTOP-G0QQS57', 'KaBible', 'SQLi', "id=' OR 1=1--", 'High', '200'],
  ['12:58 PM', 'DESKTOP-G0QQS57', 'LesArtisans', 'SQLi', "id=' OR 1=1--", 'High', '200'],
  ['12:54 PM', 'DESKTOP-G0QQS57', 'LesArtisans', 'SQLi', "id=' OR 1=1--", 'High', '200'],
  ['10:51 AM', 'DESKTOP-G0QQS57', 'Unknown', 'SQLi', "id=' OR 1=1--", 'High', '200'],
  ['07:27 PM', 'DESKTOP-G0QQS57', 'Unknown', 'XSS', 'q=<script>alert(1)', 'High', '200'],
];

const applications = [
  ['Unknown', 'DESKTOP-G00...', 3],
  ['LesArtisans', 'DESKTOP-G00...', 3],
  ['KaBible', 'DESKTOP-G00...', 1],
  ['Web Application', 'DESKTOP-G00...', 32],
  ['Web Application', 'Server 1', 520],
];

const httpCodes = [
  { code: '200', label: 'OK', val: 111, color: '#2ED573', bar: 22 },
  { code: '404', label: 'Not Found', val: 6, color: '#7C6FF7', bar: 2 },
  { code: '403', label: 'Forbidden', val: 405, color: '#FFB020', bar: 100 },
  { code: '500', label: 'Internal Server Error', val: 37, color: '#FF4757', bar: 8 },
];

const threatColor = (type) => {
  if (type === 'SQLi') return { bg: 'rgba(255,91,110,0.16)', color: '#FF5B6E' };
  if (type === 'XSS') return { bg: 'rgba(139,123,255,0.16)', color: '#8B7BFF' };
  if (type === 'CRLF') return { bg: 'rgba(108,92,231,0.16)', color: '#6C5CE7' };
  return { bg: 'rgba(124,111,247,0.16)', color: PURPLE };
};

export default function DashboardMock() {
  const statCards = [
    { title: 'TOTAL ATTACKS', value: '559', color: '#4ECDC4', icon: <ShieldIcon sx={{ fontSize: 28 }} /> },
    { title: 'HIGH SEVERITY', value: '392', color: '#FF4757', icon: <WarningAmberIcon sx={{ fontSize: 28 }} /> },
    { title: 'MEDIUM SEVERITY', value: '118', color: '#FFB020', icon: <ShieldIcon sx={{ fontSize: 28 }} /> },
    { title: 'ACTIVE SERVERS', value: '2', color: '#2ED573', icon: <StorageIcon sx={{ fontSize: 28 }} /> },
  ];

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 960,
        mx: 'auto',
        background: '#0b0e1f',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.06)',
        boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
        color: '#dfe3ff',
        fontSize: '0.8rem',
      }}
    >
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '200px 1fr' }, minHeight: 580 }}>
        <Box
          sx={{
            background: '#161929',
            borderRight: { md: '1px solid rgba(255,255,255,0.05)' },
            p: 2,
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            alignItems: 'center',
            pt: 3,
            height: '100%',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ mb: 1, color: PURPLE }}>
            <RemoveRedEyeIcon sx={{ fontSize: 36 }} />
          </Box>

          <Typography
            sx={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 700,
              mb: 2.5,
              letterSpacing: 0.6,
              fontSize: '0.92rem',
              color: '#ffffff',
              lineHeight: 1,
            }}
          >
            Prism<span style={{ color: PURPLE }}>Eye</span>
          </Typography>

          <Box sx={{ width: '100%', px: 1.2, flex: 1 }}>
            {[
              { label: 'DASHBOARD', icon: DashboardIcon, active: true },
              { label: 'THREAT ANALYTICS', icon: ShowChartIcon, active: false },
              { label: 'THREAT ASSESSMENT', icon: AssessmentIcon, active: false },
              { label: 'LOGS', icon: ListAltIcon, active: false },
              { label: 'SERVERS', icon: StorageIcon, active: false },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <Box
                  key={i}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    px: 1.2,
                    py: 0.9,
                    borderRadius: '10px',
                    mb: 0.4,
                    backgroundColor: item.active ? 'rgba(124,111,247,0.15)' : 'transparent',
                    borderLeft: item.active ? '3px solid #7C6FF7' : '3px solid transparent',
                    color: item.active ? '#ffffff' : '#7f84a3',
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    letterSpacing: '0.03em',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <Box sx={{ width: 18, display: 'flex', justifyContent: 'center', color: item.active ? PURPLE : '#7f84a3', flexShrink: 0 }}>
                    <Icon sx={{ fontSize: 15 }} />
                  </Box>
                  {item.label}
                </Box>
              );
            })}
          </Box>

          <Box sx={{ width: '100%', px: 1.2, pb: 2 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                px: 1.2,
                py: 0.9,
                borderRadius: '10px',
                color: '#A78BFA',
                fontSize: '0.65rem',
                fontWeight: 600,
                letterSpacing: '0.03em',
                whiteSpace: 'nowrap',
              }}
            >
              <Box sx={{ width: 18, display: 'flex', justifyContent: 'center', color: '#A78BFA', flexShrink: 0 }}>
                <SettingsIcon sx={{ fontSize: 15 }} />
              </Box>
              SETTINGS
            </Box>
          </Box>
        </Box>

        <Box sx={{ background: '#0f1120', p: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography sx={{ color: '#8d90aa', fontSize: '0.7rem' }}>Last Updated 1 days ago</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              {['1 hr', '1 Day', '1 Week'].map((x) => (
                <Typography key={x} sx={{ fontSize: '0.7rem', color: '#8d90aa' }}>
                  {x}
                </Typography>
              ))}
              <Box sx={{ background: PURPLE, color: '#fff', px: 1, py: 0.2, borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700 }}>
                All
              </Box>
              <Typography sx={{ fontSize: '0.7rem', color: '#8d90aa' }}>🔔</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography sx={{ fontSize: '0.7rem', color: '#fff', fontWeight: 600 }}>USER</Typography>
                <AccountCircleIcon sx={{ fontSize: 22, color: PURPLE }} />
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography sx={{ color: PURPLE, fontWeight: 800, letterSpacing: '0.18em', fontSize: '0.95rem' }}>
              DASHBOARD
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, background: 'rgba(46,213,115,0.12)', border: '1px solid rgba(46,213,115,0.3)', borderRadius: '999px', px: 1.2, py: 0.3 }}>
              <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: '#2ED573', '@keyframes pulse': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.3 } }, animation: 'pulse 1.5s infinite' }} />
              <Typography sx={{ fontSize: '0.65rem', color: '#2ED573', fontWeight: 700 }}>LIVE</Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1.2 }}>
            {statCards.map((s, i) => (
              <Box
                key={i}
                sx={{
                  backgroundColor: '#1E2235',
                  borderRadius: '12px',
                  borderTop: `3px solid ${s.color}`,
                  height: '160px',
                  width: '100%',
                }}
              >
                <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
                    <Box>
                      <Typography sx={{ color: '#A0A3B1', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', mb: 1.5 }}>
                        {s.title}
                      </Typography>
                      <Typography sx={{ color: '#ffffff', fontSize: '2.2rem', fontWeight: 700, lineHeight: 1 }}>
                        {s.value}
                      </Typography>
                    </Box>
                    <Box sx={{ color: s.color, mt: 0.5, display: 'flex', alignItems: 'center' }}>
                      {s.icon}
                    </Box>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 1.2 }}>
            <Box sx={{ background: '#1E2235', borderRadius: '10px', p: 1.5 }}>
              <Typography sx={{ color: PURPLE, fontWeight: 700, fontSize: '0.82rem', mb: 1 }}>
                Attack Trends
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                {legend.map((item, i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                    <Box sx={{ width: 16, height: 2.5, borderRadius: '2px', background: item.color }} />
                    <Typography sx={{ color: '#8d90aa', fontSize: '0.6rem' }}>{item.name}</Typography>
                  </Box>
                ))}
              </Box>
              <Box sx={{ position: 'relative', height: 130 }}>
                <svg width="100%" height="130" viewBox="0 0 500 140" preserveAspectRatio="none">
                  {[0, 35, 70, 105, 140].map((y, i) => (
                    <line key={i} x1="0" y1={y} x2="500" y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                  ))}
                  {[60, 45, 30, 15, 0].map((val, i) => (
                    <text key={i} x="2" y={i * 35 + 10} fill="#8d90aa" fontSize="8">
                      {val}
                    </text>
                  ))}
                  {chartLines.map((line, i) => (
                    <polyline key={i} points={line.points} fill="none" stroke={line.color} strokeWidth={line.width} />
                  ))}
                </svg>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.3 }}>
                  {['21:20', '21:47', '22:48', '8:53', '9:00', '9:21', '9:31', '9:38', '9:44', '9:53'].map((t, i) => (
                    <Typography key={i} sx={{ fontSize: '0.52rem', color: '#8d90aa' }}>
                      {t}
                    </Typography>
                  ))}
                </Box>
              </Box>
            </Box>

            <Box sx={{ background: '#1E2235', borderRadius: '10px', p: 1.5 }}>
              <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '0.85rem', mb: 1.2 }}>
                Applications
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.9 }}>
                {applications.map((a, i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography sx={{ color: '#c9cde4', fontSize: '0.72rem', flex: 1 }}>{a[0]}</Typography>
                    <Typography sx={{ color: '#8d90aa', fontSize: '0.65rem', mx: 1 }}>{a[1]}</Typography>
                    <Box sx={{ background: 'rgba(255,71,87,0.15)', color: '#FF4757', border: '1px solid rgba(255,71,87,0.3)', borderRadius: '999px', px: 0.8, py: 0.15, fontSize: '0.62rem', fontWeight: 700, flexShrink: 0 }}>
                      {a[2]} hits
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 1.2 }}>
            <Box sx={{ background: '#1E2235', borderRadius: '10px', p: 1.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.2 }}>
                <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '0.85rem' }}>RECENT ALERTS</Typography>
                <Typography sx={{ color: PURPLE, fontSize: '0.7rem' }}>↻</Typography>
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: '60px 1fr 80px 50px 1fr 50px 45px', gap: 0.5, mb: 0.8 }}>
                {['TIME', 'SERVER', 'APPLICATION', 'THREAT TYPE', 'PARAMETER', 'SEVERITY', 'RESPONSE'].map((h) => (
                  <Typography key={h} sx={{ color: '#8d90aa', fontSize: '0.58rem', fontWeight: 600, letterSpacing: '0.05em' }}>
                    {h}
                  </Typography>
                ))}
              </Box>
              {alerts.map((r, i) => {
                const tc = threatColor(r[3]);
                return (
                  <Box key={i} sx={{ display: 'grid', gridTemplateColumns: '60px 1fr 80px 50px 1fr 50px 45px', gap: 0.5, py: 0.6, borderBottom: '1px solid rgba(255,255,255,0.04)', alignItems: 'center' }}>
                    <Typography sx={{ color: '#cfd3ea', fontSize: '0.62rem' }}>{r[0]}</Typography>
                    <Typography sx={{ color: '#cfd3ea', fontSize: '0.62rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r[1]}</Typography>
                    <Typography sx={{ color: '#cfd3ea', fontSize: '0.62rem' }}>{r[2]}</Typography>
                    <Box sx={{ background: tc.bg, color: tc.color, borderRadius: '6px', px: 0.8, py: 0.2, fontSize: '0.6rem', fontWeight: 700, width: 'fit-content' }}>{r[3]}</Box>
                    <Typography sx={{ color: '#cfd3ea', fontSize: '0.6rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r[4]}</Typography>
                    <Box sx={{ background: 'rgba(255,71,87,0.14)', color: '#FF4757', borderRadius: '999px', px: 0.8, py: 0.15, fontSize: '0.6rem', fontWeight: 700, width: 'fit-content' }}>
                      {r[5]}
                    </Box>
                    <Typography sx={{ color: '#2ED573', fontSize: '0.62rem', fontWeight: 700 }}>{r[6]}</Typography>
                  </Box>
                );
              })}
            </Box>

            <Box sx={{ background: '#1E2235', borderRadius: '10px', p: 1.5 }}>
              <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '0.85rem', mb: 1.5 }}>
                HTTP Response Codes
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {httpCodes.map((x, i) => (
                  <Box key={i}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                        <Box sx={{ width: 30, height: 22, borderRadius: '6px', background: `${x.color}22`, color: x.color, fontSize: '0.65rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${x.color}44` }}>
                          {x.code}
                        </Box>
                        <Typography sx={{ color: '#cfd3ea', fontSize: '0.7rem' }}>{x.label}</Typography>
                      </Box>
                      <Typography sx={{ color: '#fff', fontSize: '0.75rem', fontWeight: 700 }}>{x.val}</Typography>
                    </Box>
                    <Box sx={{ height: 6, borderRadius: '999px', background: 'rgba(255,255,255,0.05)' }}>
                      <Box sx={{ width: `${x.bar}%`, height: '100%', borderRadius: '999px', background: x.color }} />
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
