import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import '../styles/globals.css';
import { AppProvider } from '../context/AppContext';
import AlertModal from '../components/ui/AlertModal';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#7C6FF7' },
    background: {
      default: '#0F1123',
      paper: '#1E2235',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#A0A3B1',
    },
  },
  typography: {
    fontFamily: "'Poppins', sans-serif",
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          overflowY: 'auto !important',
          overflowX: 'hidden',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#1E2235',
          borderRadius: '12px',
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 600,
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#161929',
          borderRight: 'none',
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #2A2D3E',
          color: '#A0A3B1',
        },
        head: {
          color: '#A0A3B1',
          fontWeight: 600,
          fontSize: '0.75rem',
          letterSpacing: '0.1em',
        }
      }
    },
  }
});

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppProvider>
        <AlertModal />
        <Component {...pageProps} />
      </AppProvider>
    </ThemeProvider>
  );
}