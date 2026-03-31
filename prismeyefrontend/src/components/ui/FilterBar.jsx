import {
  Box, Typography, FormControl,
  Select, MenuItem
} from '@mui/material';

export default function FilterBar({ onSeverityChange, onTypeChange, onServerChange }) {
  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      backgroundColor: '#1E2235',
      borderRadius: '10px',
      p: 2,
      mb: 2,
    }}>

      {/* Label */}
      <Typography sx={{
        color: '#A0A3B1',
        fontSize: '0.85rem',
        fontWeight: 600,
        letterSpacing: '0.05em',
        mr: 1,
      }}>
        FILTER BY
      </Typography>

      {/* Severity */}
      <FormControl size="small">
        <Select
          defaultValue="all"
          onChange={onSeverityChange}
          sx={{
            color: '#fff',
            backgroundColor: '#2A2D3E',
            borderRadius: '8px',
            fontSize: '0.8rem',
            '.MuiOutlinedInput-notchedOutline': { border: 'none' },
            '.MuiSvgIcon-root': { color: '#fff' },
          }}
        >
          <MenuItem value="all">ALL SEVERITY</MenuItem>
          <MenuItem value="High">High</MenuItem>
          <MenuItem value="Medium">Medium</MenuItem>
          <MenuItem value="Low">Low</MenuItem>
        </Select>
      </FormControl>

      {/* Attack Type */}
      <FormControl size="small">
        <Select
          defaultValue="all"
          onChange={onTypeChange}
          sx={{
            color: '#fff',
            backgroundColor: '#2A2D3E',
            borderRadius: '8px',
            fontSize: '0.8rem',
            '.MuiOutlinedInput-notchedOutline': { border: 'none' },
            '.MuiSvgIcon-root': { color: '#fff' },
          }}
        >
          <MenuItem value="all">ALL ATTACK TYPES</MenuItem>
          <MenuItem value="SQLi">SQLi</MenuItem>
          <MenuItem value="XSS">XSS</MenuItem>
          <MenuItem value="SSRF">SSRF</MenuItem>
          <MenuItem value="DDoS">DDoS</MenuItem>
        </Select>
      </FormControl>

      {/* Server */}
      <FormControl size="small">
        <Select
          defaultValue="all"
          onChange={onServerChange}
          sx={{
            color: '#fff',
            backgroundColor: '#2A2D3E',
            borderRadius: '8px',
            fontSize: '0.8rem',
            '.MuiOutlinedInput-notchedOutline': { border: 'none' },
            '.MuiSvgIcon-root': { color: '#fff' },
          }}
        >
          <MenuItem value="all">ALL SERVERS</MenuItem>
          <MenuItem value="Server 1">Server 1</MenuItem>
          <MenuItem value="Server 2">Server 2</MenuItem>
          <MenuItem value="Server 3">Server 3</MenuItem>
          <MenuItem value="Server 4">Server 4</MenuItem>
          <MenuItem value="Server 5">Server 5</MenuItem>
        </Select>
      </FormControl>

    </Box>
  );
}