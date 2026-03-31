import { Card, CardContent, Typography, Box } from '@mui/material';

export default function StatCard({ title, value, icon, borderColor }) {
  return (
    <Card sx={{
      backgroundColor: '#1E2235',
      borderRadius: '12px',
      borderTop: `3px solid ${borderColor || '#7C6FF7'}`,
      height: '160px',
      width: '100%',
    }}>
      <CardContent sx={{
        p: 3,
        '&:last-child': { pb: 3 },
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}>
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          width: '100%',
        }}>
          <Box>
            <Typography sx={{
              color: '#A0A3B1',
              fontSize: '0.78rem',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              mb: 1.5,
            }}>
              {title}
            </Typography>
            <Typography sx={{
              color: '#ffffff',
              fontSize: '2.2rem',
              fontWeight: 700,
              lineHeight: 1,
            }}>
              {value || '--'}
            </Typography>
          </Box>
          <Box sx={{
            color: borderColor || '#7C6FF7',
            mt: 0.5,
          }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}