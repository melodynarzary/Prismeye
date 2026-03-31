import { Chip } from '@mui/material';

const threatColors = {
  SQLi: { bg: '#FF4757', text: '#fff' },
  XSS:  { bg: '#7C6FF7', text: '#fff' },
  SSRF: { bg: '#4ECDC4', text: '#fff' },
  DDoS: { bg: '#FF6B9D', text: '#fff' },
};

export default function ThreatBadge({ type }) {
  const colors = threatColors[type] || { bg: '#A0A3B1', text: '#fff' };
  return (
    <Chip
      label={type}
      size="small"
      sx={{
        backgroundColor: colors.bg,
        color: colors.text,
        fontWeight: 700,
        fontSize: '0.7rem',
        height: '24px',
        borderRadius: '6px',
      }}
    />
  );
}