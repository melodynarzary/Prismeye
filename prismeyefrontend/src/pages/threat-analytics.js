import { Box, Typography } from '@mui/material';
import DashboardLayout from '../components/layout/DashboardLayout';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ListIcon from '@mui/icons-material/List';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import { StatCard } from '../components/ui';
import {
  LineChart, Line, XAxis, YAxis,
  Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

const trendData = [
  { time: '16:00', SQLi: 200, XSS: 100, DDoS: 150, SSRF: 80  },
  { time: '16:15', SQLi: 250, XSS: 120, DDoS: 180, SSRF: 90  },
  { time: '16:30', SQLi: 300, XSS: 150, DDoS: 200, SSRF: 100 },
  { time: '16:45', SQLi: 400, XSS: 180, DDoS: 220, SSRF: 110 },
  { time: '17:00', SQLi: 600, XSS: 200, DDoS: 250, SSRF: 120 },
];

const donutData = [
  { name: 'SQLi', value: 35, color: '#7C6FF7' },
  { name: 'XSS',  value: 25, color: '#FF6B9D' },
  { name: 'DDoS', value: 20, color: '#2ED573' },
  { name: 'SSRF', value: 20, color: '#4ECDC4' },
];

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

export default function ThreatAnalyticsPage() {
  return (
    <DashboardLayout>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}>

        {/* Title */}
        <Typography sx={{
          fontSize: '1.3rem',
          fontWeight: 700,
          letterSpacing: '0.15em',
          color: '#7C6FF7',
        }}>
          THREAT ANALYTICS
        </Typography>

        {/* Stat Cards */}
        <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
          <Box sx={{ flex: 1 }}>
            <StatCard
              title="TOTAL ATTACKS"
              value="8.4K"
              icon={<WarningAmberIcon sx={{ fontSize: 32 }} />}
              borderColor="#FF4757"
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <StatCard
              title="TOP ATTACK TYPE"
              value="SQLi"
              icon={<ListIcon sx={{ fontSize: 32 }} />}
              borderColor="#4ECDC4"
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <StatCard
              title="MOST TARGETED"
              value="/api/auth/login"
              icon={<TrackChangesIcon sx={{ fontSize: 32 }} />}
              borderColor="#7C6FF7"
            />
          </Box>
        </Box>

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
            <Typography sx={{
              color: '#7C6FF7',
              fontWeight: 600,
              fontSize: '0.95rem',
            }}>
              Attack Trends
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              {[
                { label: 'SQLi', color: '#7C6FF7' },
                { label: 'XSS',  color: '#FF6B9D' },
                { label: 'DDoS', color: '#2ED573' },
                { label: 'SSRF', color: '#4ECDC4' },
              ].map((item) => (
                <Box key={item.label} sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5
                }}>
                  <Box sx={{
                    width: 20,
                    height: 3,
                    backgroundColor: item.color,
                    borderRadius: 2
                  }} />
                  <Typography sx={{
                    color: '#A78BFA',
                    fontSize: '0.72rem'
                  }}>
                    {item.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <XAxis
                  dataKey="time"
                  stroke="#3A3D4E"
                  tick={{ fill: '#A78BFA', fontSize: 11 }}
                />
                <YAxis
                  stroke="#3A3D4E"
                  tick={{ fill: '#A78BFA', fontSize: 11 }}
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

        {/* Bottom Row */}
        <Box sx={{ display: 'flex', gap: 2 }}>

          {/* Threat Distribution */}
          <Box sx={{
            flex: 2,
            backgroundColor: '#1E2235',
            borderRadius: '12px',
            p: 2.5,
            minHeight: 280,
            display: 'flex',
            flexDirection: 'column',
          }}>
            <Typography sx={{
              color: '#7C6FF7',
              fontWeight: 600,
              fontSize: '0.95rem',
              mb: 1.5,
            }}>
              Threat Distribution
            </Typography>

            <Box sx={{
              flexGrow: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}>
              {/* Donut Chart */}
              <Box sx={{ position: 'relative', width: 180, height: 180, flexShrink: 0 }}>
                <PieChart width={180} height={180}>
                  <Pie
                    data={donutData}
                    cx={85}
                    cy={85}
                    innerRadius={55}
                    outerRadius={85}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {donutData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
                {/* Center text */}
                <Box sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                }}>
                  <Typography sx={{
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '1rem',
                    lineHeight: 1.2,
                  }}>
                    8.4K
                  </Typography>
                  <Typography sx={{
                    color: '#A78BFA',
                    fontSize: '0.65rem',
                    fontWeight: 600,
                  }}>
                    ATTACKS
                  </Typography>
                </Box>
              </Box>

              {/* Legend */}
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
              }}>
                {donutData.map((item) => (
                  <Box key={item.name} sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}>
                    <Box sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      backgroundColor: item.color,
                      flexShrink: 0,
                    }} />
                    <Typography sx={{
                      color: '#A78BFA',
                      fontSize: '0.82rem',
                      minWidth: 40,
                    }}>
                      {item.name}
                    </Typography>
                    <Typography sx={{
                      color: '#ffffff',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                    }}>
                      {item.value}%
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>

          {/* Severity Summary */}
          <Box sx={{
            flex: 3,
            backgroundColor: '#1E2235',
            borderRadius: '12px',
            p: 2.5,
            minHeight: 280,
          }}>
            <Typography sx={{
              color: '#7C6FF7',
              fontWeight: 600,
              fontSize: '0.85rem',
              letterSpacing: '0.1em',
              mb: 2,
            }}>
              SEVERITY SUMMARY
            </Typography>

            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}>
              {[
                { label: 'High',   color: '#FF4757', value: '1,204' },
                { label: 'Medium', color: '#FFB020', value: '3,871' },
                { label: 'Low',    color: '#2ED573', value: '3,183' },
              ].map((item) => (
                <Box key={item.label} sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  py: 1,
                  borderBottom: '1px solid #2A2D3E',
                }}>
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}>
                    <Box sx={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      backgroundColor: item.color,
                    }} />
                    <Typography sx={{
                      color: item.color,
                      fontSize: '0.88rem',
                      fontWeight: 600,
                    }}>
                      {item.label}
                    </Typography>
                  </Box>
                  <Typography sx={{
                    color: '#ffffff',
                    fontSize: '1rem',
                    fontWeight: 700,
                  }}>
                    {item.value}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* Progress Bar */}
            <Box sx={{
              mt: 3,
              width: '100%',
              height: 10,
              borderRadius: 5,
              overflow: 'hidden',
              display: 'flex',
            }}>
              <Box sx={{ flex: 1204, backgroundColor: '#FF4757' }} />
              <Box sx={{ flex: 3871, backgroundColor: '#FFB020' }} />
              <Box sx={{ flex: 3183, backgroundColor: '#2ED573' }} />
            </Box>
          </Box>
        </Box>

      </Box>
    </DashboardLayout>
  );
}