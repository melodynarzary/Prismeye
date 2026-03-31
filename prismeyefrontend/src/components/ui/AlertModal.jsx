import {
  Modal, Box, Typography,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

export default function AlertModal({ open, onClose, attackType, server, application }) {
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 480,
        backgroundColor: '#2A2D3E',
        borderRadius: '16px',
        p: 4,
        outline: 'none',
        textAlign: 'center',
      }}>

        {/* Close Button */}
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            color: '#A0A3B1',
            '&:hover': { color: '#ffffff' }
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* ALERT Header */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
          mb: 2,
        }}>
          <WarningAmberIcon sx={{ color: '#FF4757', fontSize: 28 }} />
          <Typography sx={{
            color: '#FF4757',
            fontWeight: 700,
            fontSize: '1.2rem',
            letterSpacing: 3,
          }}>
            ALERT
          </Typography>
        </Box>

        {/* Attack Type */}
        <Typography sx={{
          color: '#7C6FF7',
          fontWeight: 700,
          fontSize: '1.3rem',
          mb: 3,
        }}>
          {attackType || '--'} detected
        </Typography>

        {/* Details */}
        <Typography sx={{
          color: '#ffffff',
          fontSize: '0.9rem',
          lineHeight: 2,
        }}>
          Please Check Recent Alerts<br />
          Server: <strong>{server || '--'}</strong><br />
          Application: <strong>{application || '--'}</strong>
        </Typography>

      </Box>
    </Modal>
  );
}