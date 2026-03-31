import { useState } from 'react';
import { useRouter } from 'next/router';
import {
  Box, Card, TextField, Button,
  Checkbox, FormControlLabel,
  Typography, Link, InputAdornment,
} from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleLogin = () => {
    router.push('/dashboard');
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at top, #1a1040 0%, #0F1123 50%, #0a0d1a 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}>

      {/* Eye Logo */}
      <Box sx={{ mb: 2, color: '#7C6FF7' }}>
        <RemoveRedEyeIcon sx={{ fontSize: 52 }} />
      </Box>

      {/* Brand Name */}
      <Typography variant="h4" sx={{
        mb: 4,
        fontWeight: 700,
        letterSpacing: 1
      }}>
        Prism<span style={{ color: '#7C6FF7' }}>Eye</span>
      </Typography>

      {/* Login Card */}
      <Card sx={{
        width: { xs: '90%', sm: 480 },
        p: 4,
        backgroundColor: '#1a1d2e',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}>

        {/* Username */}
        <TextField
          fullWidth
          placeholder="Username"
          variant="outlined"
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonOutlineIcon sx={{ color: '#A0A3B1' }} />
              </InputAdornment>
            ),
            sx: {
              backgroundColor: '#E8E8F0',
              borderRadius: '8px',
              '& input': { color: '#1a1d2e' },
              '& fieldset': { border: 'none' },
            }
          }}
        />

        {/* Password */}
        <TextField
          fullWidth
          placeholder="Password"
          type={showPassword ? 'text' : 'password'}
          variant="outlined"
          sx={{ mb: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockOutlinedIcon sx={{ color: '#A0A3B1' }} />
              </InputAdornment>
            ),
            sx: {
              backgroundColor: '#E8E8F0',
              borderRadius: '8px',
              '& input': { color: '#1a1d2e' },
              '& fieldset': { border: 'none' },
            }
          }}
        />

        {/* Remember me + Forgot Password */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                sx={{
                  color: '#7C6FF7',
                  '&.Mui-checked': { color: '#7C6FF7' },
                }}
              />
            }
            label={
              <Typography sx={{ color: '#ffffff', fontSize: '0.9rem' }}>
                Remember me
              </Typography>
            }
          />
          <Link href="#" underline="none" sx={{
            color: '#ffffff',
            fontSize: '0.9rem',
            cursor: 'pointer'
          }}>
            Forgot Password
          </Link>
        </Box>

        {/* Login Button */}
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            onClick={handleLogin}
            sx={{
              width: '60%',
              py: 1.5,
              backgroundColor: '#4a4870',
              color: '#ffffff',
              fontSize: '1rem',
              fontWeight: 600,
              borderRadius: '12px',
              '&:hover': { backgroundColor: '#7C6FF7' },
            }}
          >
            Login
          </Button>
        </Box>

      </Card>
    </Box>
  );
}