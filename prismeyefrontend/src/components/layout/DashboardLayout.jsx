import { Box } from '@mui/material';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

export function DashboardLayout({ children }) {
  return (
    <Box sx={{
      display: 'flex',
      height: '100vh',
      width: '100vw',
      backgroundColor: '#0F1123',
      overflow: 'hidden',
      position: 'fixed',
      top: 0,
      left: 0,
    }}>
      <Sidebar />
      <Box sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        <TopBar />
        <Box sx={{
          flexGrow: 1,
          p: 2,
          overflowY: 'auto',
        }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}

export default DashboardLayout;