import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0ea5e9', // Matches Tailwind primary-500 from previous design
      light: '#e0f2fe',
      dark: '#0284c7',
    },
    secondary: {
      main: '#6366f1',
    },
    error: {
      main: '#ef4444',
    },
    background: {
      default: '#f8fafc', // Tailwind slate-50
      paper: '#ffffff',
    },
    text: {
      primary: '#0f172a', // Tailwind slate-900
      secondary: '#64748b', // Tailwind slate-500
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: { fontSize: '2rem', fontWeight: 600 },
    h2: { fontSize: '1.5rem', fontWeight: 600 },
    h3: { fontSize: '1.25rem', fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)', // Tailwind shadow-sm
        },
      },
    },
    MuiPaper: {
        defaultProps: {
            elevation: 0,
        },
        styleOverrides: {
            root: {
                border: '1px solid #e2e8f0', // Tailwind slate-200
            }
        }
    }
  },
});

export default theme;
