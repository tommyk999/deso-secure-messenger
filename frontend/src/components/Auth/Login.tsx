import React from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Card,
  CardContent,
  Stack,
  Divider,
  Alert,
} from '@mui/material';
import {
  AccountBalanceWallet,
  Security,
  Speed,
  Verified,
  ArrowForward,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const Login: React.FC = () => {
  const { login, isLoading } = useAuth();

  const handleLogin = async () => {
    await login();
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Paper
          elevation={8}
          sx={{
            p: 4,
            width: '100%',
            maxWidth: 500,
            background: 'linear-gradient(145deg, #1e1e1e 0%, #2d2d2d 100%)',
            border: '1px solid #333',
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h3" component="h1" gutterBottom color="primary">
              🔐 DeSo Chat
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Secure messaging on the DeSo blockchain
            </Typography>
          </Box>

          {/* Features */}
          <Stack spacing={2} sx={{ mb: 4 }}>
            <Card sx={{ bgcolor: 'background.paper', border: '1px solid #333' }}>
              <CardContent sx={{ py: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Security color="primary" />
                  <Box>
                    <Typography variant="subtitle2" color="primary">
                      End-to-End Encrypted
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Messages secured with blockchain cryptography
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            <Card sx={{ bgcolor: 'background.paper', border: '1px solid #333' }}>
              <CardContent sx={{ py: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Verified color="primary" />
                  <Box>
                    <Typography variant="subtitle2" color="primary">
                      Verified Identity
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Your DeSo identity verifies all messages
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            <Card sx={{ bgcolor: 'background.paper', border: '1px solid #333' }}>
              <CardContent sx={{ py: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Speed color="primary" />
                  <Box>
                    <Typography variant="subtitle2" color="primary">
                      Fast & Decentralized
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      No central servers, pure peer-to-peer communication
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Stack>

          <Divider sx={{ my: 3 }} />

          {/* Login Section */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Connect with DeSo Identity
            </Typography>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Sign in securely using your DeSo wallet and identity
            </Typography>

            <Alert severity="info" sx={{ mb: 3, textAlign: 'left' }}>
              <Typography variant="body2">
                <strong>New to DeSo?</strong> You'll be guided through creating a wallet and profile.
                No email or password required!
              </Typography>
            </Alert>

            <Button
              variant="contained"
              size="large"
              onClick={handleLogin}
              disabled={isLoading}
              startIcon={
                isLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <AccountBalanceWallet />
                )
              }
              endIcon={!isLoading && <ArrowForward />}
              sx={{
                py: 1.5,
                px: 4,
                fontSize: '1.1rem',
                background: 'linear-gradient(45deg, #00e676, #00b248)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #4cff87, #00e676)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(0, 230, 118, 0.3)',
                },
                '&:disabled': {
                  background: 'rgba(0, 230, 118, 0.3)',
                },
                transition: 'all 0.3s ease',
              }}
              fullWidth
            >
              {isLoading ? 'Connecting...' : 'Connect DeSo Wallet'}
            </Button>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              By connecting, you agree to secure, decentralized messaging
            </Typography>
          </Box>

          {/* Footer */}
          <Box sx={{ textAlign: 'center', mt: 4, pt: 3, borderTop: '1px solid #333' }}>
            <Typography variant="body2" color="text.secondary">
              Powered by{' '}
              <Typography component="span" color="primary" fontWeight="bold">
                DeSo Protocol
              </Typography>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
