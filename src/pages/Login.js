import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Tab,
  Tabs,
  Alert,
  Divider,
  Chip,
  Grid,
  Avatar,
  IconButton,
  InputAdornment,
  useMediaQuery,
  useTheme,
  Stack,
  Card,
  CardContent,
} from '@mui/material';
import {
  AdminPanelSettings,
  Person,
  Visibility,
  VisibilityOff,
  Security,
  Shield,
  TrendingUp,
  Verified,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { customStyles, gradients, colors } from '../theme';

const Login = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [tab, setTab] = useState(0);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    phone: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { login, register, demoLogin } = useAuth();
  const navigate = useNavigate();

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
    setError('');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(loginData);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    const { confirmPassword, ...submitData } = registerData;
    const result = await register(submitData);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleDemoLogin = async (type) => {
    setLoading(true);
    setError('');

    const result = await demoLogin(type);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const FeatureCard = ({ icon, title, description, gradient }) => (
    <Card
      sx={{
        ...customStyles.glassMorphism,
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-8px)',
          ...customStyles.neonGlow,
        },
      }}
    >
      <CardContent sx={{ textAlign: 'center', p: 3 }}>
        <Avatar
          sx={{
            width: 56,
            height: 56,
            mx: 'auto',
            mb: 2,
            background: gradient,
            boxShadow: '0 8px 24px rgba(0, 212, 255, 0.3)',
          }}
        >
          {icon}
        </Avatar>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );

  const HeroSection = () => (
    <Box
      sx={{
        position: 'relative',
        textAlign: 'center',
        mb: 4,
        p: 4,
        background: gradients.hero,
        borderRadius: '20px',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: `radial-gradient(circle, ${colors.primary.main}20 0%, transparent 70%)`,
          animation: 'float 6s ease-in-out infinite',
        },
      }}
    >
      <Box position="relative" zIndex={1}>
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '20px',
            background: gradients.primary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 3,
            boxShadow: '0 8px 32px rgba(0, 212, 255, 0.4)',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: -4,
              left: -4,
              right: -4,
              bottom: -4,
              background: gradients.primary,
              borderRadius: '24px',
              zIndex: -1,
              opacity: 0.6,
              animation: 'pulse 3s ease-in-out infinite',
            },
          }}
        >
          <Security sx={{ fontSize: 40, color: 'white' }} />
        </Box>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            mb: 2,
            background: gradients.neon,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          LandChain Registry
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
          Secure blockchain-powered land management system with advanced cryptographic protection
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: gradients.hero,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%2300D4FF\' fill-opacity=\'0.05\'%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'1\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          animation: 'float 20s ease-in-out infinite',
        },
      }}
    >
      <Container maxWidth="lg" sx={{ py: 4, position: 'relative', zIndex: 1 }}>
        {!isMobile && <HeroSection />}
        
        <Grid container spacing={4} alignItems="center">
          {/* Features Section - Hidden on mobile */}
          {!isMobile && (
            <Grid item xs={12} md={5}>
              <Stack spacing={3}>
                <FeatureCard
                  icon={<Shield />}
                  title="Blockchain Security"
                  description="Immutable records protected by advanced cryptography"
                  gradient={gradients.primary}
                />
                <FeatureCard
                  icon={<Verified />}
                  title="Smart Verification"
                  description="Automated verification with real-time validation"
                  gradient={gradients.secondary}
                />
                <FeatureCard
                  icon={<TrendingUp />}
                  title="Analytics Dashboard"
                  description="Comprehensive insights and portfolio management"
                  gradient="linear-gradient(135deg, #10B981 0%, #34D399 100%)"
                />
              </Stack>
            </Grid>
          )}

          {/* Login Form */}
          <Grid item xs={12} md={isMobile ? 12 : 7}>
            <Paper
              elevation={0}
              sx={{
                ...customStyles.glassMorphism,
                p: 4,
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: gradients.neon,
                },
              }}
            >
              {isMobile && (
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      background: gradients.neon,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    LandChain
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    Blockchain Land Registry
                  </Typography>
                </Box>
              )}

              {error && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    mb: 3,
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: colors.error.light,
                  }}
                >
                  {error}
                </Alert>
              )}

              <Box sx={{ borderBottom: 1, borderColor: 'rgba(255, 255, 255, 0.1)', mb: 3 }}>
                <Tabs 
                  value={tab} 
                  onChange={handleTabChange} 
                  centered
                  sx={{
                    '& .MuiTabs-indicator': {
                      background: gradients.primary,
                      height: 3,
                      borderRadius: 2,
                    },
                  }}
                >
                  <Tab 
                    label="Login" 
                    sx={{ 
                      fontWeight: 600,
                      '&.Mui-selected': { color: colors.primary.main },
                    }}
                  />
                  <Tab 
                    label="Register" 
                    sx={{ 
                      fontWeight: 600,
                      '&.Mui-selected': { color: colors.primary.main },
                    }}
                  />
                </Tabs>
              </Box>

              {tab === 0 && (
                <Box component="form" onSubmit={handleLoginSubmit}>
                  <TextField
                    fullWidth
                    label="Username or Email"
                    margin="normal"
                    required
                    value={loginData.username}
                    onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(10px)',
                      },
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    margin="normal"
                    required
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(10px)',
                      },
                    }}
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={loading}
                    startIcon={<Security />}
                    sx={{
                      mt: 3,
                      mb: 2,
                      py: 1.5,
                      background: gradients.primary,
                      boxShadow: '0 4px 16px rgba(0, 212, 255, 0.3)',
                      '&:hover': {
                        background: gradients.primary,
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 24px rgba(0, 212, 255, 0.4)',
                      },
                    }}
                  >
                    {loading ? 'Logging in...' : 'Login to Dashboard'}
                  </Button>
                </Box>
              )}

              {tab === 1 && (
                <Box component="form" onSubmit={handleRegisterSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="First Name"
                        required
                        value={registerData.first_name}
                        onChange={(e) => setRegisterData({ ...registerData, first_name: e.target.value })}
                        sx={{ '& .MuiOutlinedInput-root': { background: 'rgba(255, 255, 255, 0.05)' } }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Last Name"
                        required
                        value={registerData.last_name}
                        onChange={(e) => setRegisterData({ ...registerData, last_name: e.target.value })}
                        sx={{ '& .MuiOutlinedInput-root': { background: 'rgba(255, 255, 255, 0.05)' } }}
                      />
                    </Grid>
                  </Grid>
                  <TextField
                    fullWidth
                    label="Username"
                    margin="normal"
                    required
                    value={registerData.username}
                    onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                    sx={{ '& .MuiOutlinedInput-root': { background: 'rgba(255, 255, 255, 0.05)' } }}
                  />
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    margin="normal"
                    required
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    sx={{ '& .MuiOutlinedInput-root': { background: 'rgba(255, 255, 255, 0.05)' } }}
                  />
                  <TextField
                    fullWidth
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    margin="normal"
                    required
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{ '& .MuiOutlinedInput-root': { background: 'rgba(255, 255, 255, 0.05)' } }}
                  />
                  <TextField
                    fullWidth
                    label="Confirm Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    margin="normal"
                    required
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            edge="end"
                            sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                          >
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{ '& .MuiOutlinedInput-root': { background: 'rgba(255, 255, 255, 0.05)' } }}
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={loading}
                    startIcon={<Person />}
                    sx={{
                      mt: 3,
                      mb: 2,
                      py: 1.5,
                      background: gradients.secondary,
                      boxShadow: '0 4px 16px rgba(255, 107, 53, 0.3)',
                      '&:hover': {
                        background: gradients.secondary,
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 24px rgba(255, 107, 53, 0.4)',
                      },
                    }}
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </Box>
              )}

              <Divider sx={{ my: 3, borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                <Chip 
                  label="Quick Demo Access" 
                  sx={{
                    background: gradients.card,
                    color: 'white',
                    fontWeight: 600,
                  }}
                />
              </Divider>

              <Stack direction={isMobile ? 'column' : 'row'} spacing={2} sx={{ mb: 3 }}>
                <Button
                  variant="outlined"
                  fullWidth={isMobile}
                  startIcon={<AdminPanelSettings />}
                  onClick={() => handleDemoLogin('admin')}
                  disabled={loading}
                  sx={{
                    border: '1px solid rgba(255, 107, 53, 0.5)',
                    color: colors.secondary.main,
                    '&:hover': {
                      border: '1px solid rgba(255, 107, 53, 0.8)',
                      background: 'rgba(255, 107, 53, 0.1)',
                    },
                  }}
                >
                  Admin Demo
                </Button>
                <Button
                  variant="outlined"
                  fullWidth={isMobile}
                  startIcon={<Person />}
                  onClick={() => handleDemoLogin('user')}
                  disabled={loading}
                  sx={{
                    border: '1px solid rgba(0, 212, 255, 0.5)',
                    color: colors.primary.main,
                    '&:hover': {
                      border: '1px solid rgba(0, 212, 255, 0.8)',
                      background: 'rgba(0, 212, 255, 0.1)',
                    },
                  }}
                >
                  User Demo
                </Button>
              </Stack>

              <Box
                sx={{
                  p: 2,
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: 2,
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <Typography variant="caption" sx={{ fontWeight: 600, mb: 1, display: 'block' }}>
                  Demo Credentials:
                </Typography>
                <Stack spacing={0.5}>
                  <Typography variant="caption" color="text.secondary">
                    <strong>Admin:</strong> demo_admin / admin123
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    <strong>User:</strong> demo_user / user123
                  </Typography>
                </Stack>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Login;