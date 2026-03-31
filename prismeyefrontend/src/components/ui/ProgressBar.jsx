import { Box, LinearProgress, Typography } from '@mui/material';

export default function ProgressBar({ value, color }) {
  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 1,
    }}>

      {/* Bar */}
      <LinearProgress
        variant="determinate"
        value={value}
        sx={{
          width: 100,
          height: 6,
          borderRadius: 3,
          backgroundColor: '#2A2D3E',
          '& .MuiLinearProgress-bar': {
            backgroundColor: color || '#7C6FF7',
            borderRadius: 3,
          }
        }}
      />

      {/* Percentage */}
      <Typography sx={{
        color: color || '#7C6FF7',
        fontSize: '0.8rem',
        fontWeight: 600,
        minWidth: 35,
      }}>
        {value}%
      </Typography>

    </Box>
  );
}