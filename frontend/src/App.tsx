import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Container, Box, Typography, Button } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

// Create query client for TanStack Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (was cacheTime)
    },
  },
});

// Dark theme optimized for security and readability
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00e676', // DeSo green
      light: '#4cff87',
      dark: '#00b248',
    },
    secondary: {
      main: '#ff4081',
      light: '#ff79b0',
      dark: '#c60055',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0b0b0',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
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
  },
});

// Temporary landing page component
function LandingPage() {
  const [backendStatus, setBackendStatus] = React.useState<string>('Checking...');

  React.useEffect(() => {
    // Check if backend is running
    fetch('http://localhost:3001/health')
      .then(res => res.json())
      .then(data => {
        setBackendStatus(`Backend is running! Status: ${data.status}`);
      })
      .catch(() => {
        setBackendStatus('Backend is not running. Please start the backend server.');
      });
  }, []);

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom color="primary">
          🚀 DeSo Secure Messenger
        </Typography>
        
        <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 4 }}>
          Modern React + Vite Frontend
        </Typography>

        <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
          {backendStatus}
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => window.open('http://localhost:3001/health', '_blank')}
          >
            Test Backend API
          </Button>
          
          <Button 
            variant="outlined" 
            color="primary"
            onClick={() => window.open('https://github.com/tommyk999/deso-secure-messenger', '_blank')}
          >
            View on GitHub
          </Button>
        </Box>

        <Box sx={{ textAlign: 'left', maxWidth: '600px' }}>
          <Typography variant="h6" gutterBottom>✅ What's Working:</Typography>
          <Typography variant="body2" component="ul" sx={{ pl: 2 }}>
            <li>✅ Modern React 18 + TypeScript + Vite</li>
            <li>✅ Material-UI (MUI) with dark theme</li>
            <li>✅ Node.js Backend API on port 3001</li>
            <li>✅ Git repository with GitHub integration</li>
            <li>✅ Zero dependency vulnerabilities</li>
            <li>✅ Hot Module Replacement (HMR)</li>
            <li>✅ Fast build times with Vite</li>
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>🚧 Next Steps:</Typography>
          <Typography variant="body2" component="ul" sx={{ pl: 2 }}>
            <li>🔜 Implement authentication components</li>
            <li>🔜 Add chat interface</li>
            <li>🔜 Integrate with DeSo blockchain</li>
            <li>🔜 Add end-to-end encryption</li>
            <li>🔜 WebSocket real-time messaging</li>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="*" element={<LandingPage />} />
          </Routes>
        </Router>
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1e1e1e',
              color: '#fff',
              border: '1px solid #333',
            },
            success: {
              iconTheme: {
                primary: '#00e676',
                secondary: '#1e1e1e',
              },
            },
            error: {
              iconTheme: {
                primary: '#ff4081',
                secondary: '#1e1e1e',
              },
            },
          }}
        />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
