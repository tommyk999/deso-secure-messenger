import React from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Avatar,
  Chip,
  Grid,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  Logout,
  AccountCircle,
  Message,
  People,
  Settings,
  Verified,
  AccountBalanceWallet,
  Refresh,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user, logout, refreshUser, isLoading } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleMenuClose();
    await logout();
  };

  const handleRefresh = async () => {
    await refreshUser();
  };

  const formatBalance = (nanos: number) => {
    return (nanos / 1e9).toFixed(4);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* App Bar */}
      <AppBar position="static" elevation={0} sx={{ borderBottom: '1px solid #333' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            🔐 DeSo Secure Messenger
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip
              avatar={
                <Avatar 
                  src={user?.profilePic} 
                  sx={{ width: 24, height: 24 }}
                >
                  {user?.username?.[0]?.toUpperCase()}
                </Avatar>
              }
              label={user?.username || 'Anonymous'}
              color="primary"
              variant="outlined"
              icon={user?.isVerified ? <Verified /> : undefined}
            />
            
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenuClick}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleRefresh} disabled={isLoading}>
                <Refresh sx={{ mr: 1 }} />
                Refresh Profile
              </MenuItem>
              <MenuItem onClick={() => navigate('/settings')}>
                <Settings sx={{ mr: 1 }} />
                Settings
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <Logout sx={{ mr: 1 }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          {/* Welcome Card */}
          <Grid item xs={12}>
            <Paper
              sx={{
                p: 3,
                background: 'linear-gradient(145deg, #1e1e1e 0%, #2d2d2d 100%)',
                border: '1px solid #333',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Avatar
                  src={user?.profilePic}
                  sx={{ width: 64, height: 64 }}
                >
                  {user?.username?.[0]?.toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="h4" component="h1" gutterBottom>
                    Welcome back, {user?.username}! 👋
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Public Key: {user?.publicKey?.substring(0, 20)}...
                    </Typography>
                    {user?.isVerified && (
                      <Chip
                        icon={<Verified />}
                        label="Verified"
                        size="small"
                        color="primary"
                      />
                    )}
                  </Box>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccountBalanceWallet color="primary" />
                <Typography variant="body1">
                  Balance: {formatBalance(user?.balanceNanos || 0)} DESO
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Quick Actions */}
          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: 'background.paper', border: '1px solid #333' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Message color="primary" sx={{ fontSize: 48, mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Start Messaging
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Send secure, encrypted messages to other DeSo users
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate('/chat/new')}
                >
                  New Message
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: 'background.paper', border: '1px solid #333' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <People color="primary" sx={{ fontSize: 48, mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Find Contacts
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Discover and connect with other users on DeSo
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate('/contacts')}
                >
                  Browse Users
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: 'background.paper', border: '1px solid #333' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Settings color="primary" sx={{ fontSize: 48, mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Security Settings
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Configure encryption and privacy preferences
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate('/settings')}
                >
                  Manage Settings
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Recent Activity */}
          <Grid item xs={12}>
            <Paper
              sx={{
                p: 3,
                bgcolor: 'background.paper',
                border: '1px solid #333',
              }}
            >
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              <Typography variant="body2" color="text.secondary">
                No recent messages. Start a conversation to see your activity here!
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;
