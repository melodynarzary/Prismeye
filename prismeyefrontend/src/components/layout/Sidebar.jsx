import { useRouter } from 'next/router';
import {
  Box, Drawer, List, ListItem,
  ListItemButton, ListItemIcon,
  ListItemText, Typography
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ListAltIcon from '@mui/icons-material/ListAlt';
import StorageIcon from '@mui/icons-material/Storage';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

const SIDEBAR_WIDTH = 240;

const navItems = [
  { label: 'DASHBOARD',         icon: DashboardIcon,  path: '/dashboard' },
  { label: 'THREAT ANALYTICS',  icon: ShowChartIcon,  path: '/threat-analytics' },
  { label: 'THREAT ASSESSMENT', icon: AssessmentIcon, path: '/threat-assessment' },
  { label: 'LOGS',              icon: ListAltIcon,    path: '/logs' },
  { label: 'SERVERS',           icon: StorageIcon,    path: '/servers' },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = router.pathname;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: SIDEBAR_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: SIDEBAR_WIDTH,
          backgroundColor: '#161929',
          borderRight: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pt: 3,
          height: '100vh',
          overflow: 'hidden',
        },
      }}
    >
      {/* Logo */}
      <Box sx={{ mb: 1, color: '#7C6FF7' }}>
        <RemoveRedEyeIcon sx={{ fontSize: 36 }} />
      </Box>

      {/* Brand */}
      <Typography variant="h6" sx={{
        fontWeight: 700,
        mb: 3,
        letterSpacing: 1,
        fontSize: '1.1rem',
        color: '#ffffff',
      }}>
        Prism<span style={{ color: '#7C6FF7' }}>Eye</span>
      </Typography>

      {/* Nav Items */}
      <List sx={{ width: '100%', px: 1.5 }}>
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          const IconComponent = item.icon;
          return (
            <ListItem key={item.label} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => router.push(item.path)}
                sx={{
                  borderRadius: '10px',
                  py: 1.2,
                  px: 1.5,
                  position: 'relative',
                  overflow: 'hidden',
                  backgroundColor: isActive
                    ? 'rgba(124, 111, 247, 0.15)'
                    : 'transparent',
                  borderLeft: isActive
                    ? '3px solid #7C6FF7'
                    : '3px solid transparent',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(124, 111, 247, 0.1)',
                    borderLeft: '3px solid rgba(124, 111, 247, 0.5)',
                    '& .nav-icon': {
                      color: '#7C6FF7',
                    },
                    '& .nav-text': {
                      color: '#ffffff',
                    },
                  },
                }}
              >
                <ListItemIcon
                  className="nav-icon"
                  sx={{
                    color: isActive ? '#7C6FF7' : '#5C5F7A',
                    minWidth: 36,
                    transition: 'color 0.2s ease',
                  }}
                >
                  <IconComponent fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  className="nav-text"
                  primaryTypographyProps={{
                    fontSize: '0.75rem',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? '#A38FDF' : '#A78BFA',
                    letterSpacing: '0.05em',
                    sx: { transition: 'color 0.2s ease' },
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
}