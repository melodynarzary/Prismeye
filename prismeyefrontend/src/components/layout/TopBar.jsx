import { useState } from 'react';
import {
  AppBar, Toolbar, Typography,
  Box, IconButton, Avatar
} from '@mui/material';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';

const timeFilters = ['1 hr', '6 hr', '1 Days', '1 Week'];

export default function TopBar() {
  const [activeFilter, setActiveFilter] = useState('1 Days');

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: '#0F1123',
        borderBottom: '1px solid #1E2235',
      }}
    >
      <Toolbar sx={{
        justifyContent: 'space-between',
        px: 2,
        minHeight: '52px !important',
      }}>

        <Typography sx={{ color: '#A0A3B1', fontSize: '0.8rem' }}>
          Last Updated 2 secs ago
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {timeFilters.map((t) => (
            <Typography
              key={t}
              onClick={() => setActiveFilter(t)}
              sx={{
                fontSize: '0.78rem',
                cursor: 'pointer',
                color: activeFilter === t ? '#ffffff' : '#A0A3B1',
                backgroundColor: activeFilter === t ? '#2A2D3E' : 'transparent',
                px: 1.2,
                py: 0.4,
                borderRadius: '6px',
                fontWeight: activeFilter === t ? 700 : 400,
                transition: 'all 0.2s',
                '&:hover': {
                  color: '#ffffff',
                  backgroundColor: '#2A2D3E',
                }
              }}
            >
              {t}
            </Typography>
          ))}

          <IconButton sx={{ color: '#A0A3B1', p: 0.5 }}>
            <NotificationsNoneIcon fontSize="small" />
          </IconButton>

          <Typography sx={{
            color: '#ffffff',
            fontWeight: 600,
            fontSize: '0.85rem'
          }}>
            MEL
          </Typography>

          <Avatar
            src="/avatar.jpg"
            sx={{
              width: 32,
              height: 32,
              cursor: 'pointer',
              backgroundColor: '#7C6FF7'
            }}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
}