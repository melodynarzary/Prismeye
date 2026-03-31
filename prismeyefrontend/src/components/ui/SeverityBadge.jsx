import { Chip } from '@mui/material';

const severityColors = {
  High:   { bg: '#FF4757', text: '#fff' },
  Medium: { bg: '#FFB020', text: '#fff' },
  Low:    { bg: '#2ED573', text: '#fff' },
};

export default function SeverityBadge({ level }) {
  const colors = severityColors[level] || { bg: '#A0A3B1', text: '#fff' };
  return (
    <Chip
      label={level}
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