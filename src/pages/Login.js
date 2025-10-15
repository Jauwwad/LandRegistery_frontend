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
} from '@mui/material';
import { AdminPanelSettings, Person } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
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

  return (
    <div className="login-container">
      <Container maxWidth="sm">
        <Paper elevation={8} sx={{ p: 4, mt: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            🏢 Land Registry
          </Typography>
          <Typography variant="subtitle1" align="center" color="textSecondary" gutterBottom>
            Blockchain-based Land Management System
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={tab} onChange={handleTabChange} centered>
              <Tab label="Login" />
              <Tab label="Register" />
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
                onChange={(e) =>
                  setLoginData({ ...loginData, username: e.target.value })
                }
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                margin="normal"
                required
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{ mt: 3, mb: 2 }}
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </Box>
          )}

          {tab === 1 && (
            <Box component="form" onSubmit={handleRegisterSubmit}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  label="First Name"
                  margin="normal"
                  required
                  value={registerData.first_name}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, first_name: e.target.value })
                  }
                />
                <TextField
                  fullWidth
                  label="Last Name"
                  margin="normal"
                  required
                  value={registerData.last_name}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, last_name: e.target.value })
                  }
                />
              </Box>
              <TextField
                fullWidth
                label="Username"
                margin="normal"
                required
                value={registerData.username}
                onChange={(e) =>
                  setRegisterData({ ...registerData, username: e.target.value })
                }
              />
              <TextField
                fullWidth
                label="Email"
                type="email"
                margin="normal"
                required
                value={registerData.email}
                onChange={(e) =>
                  setRegisterData({ ...registerData, email: e.target.value })
                }
              />
              <TextField
                fullWidth
                label="Phone"
                margin="normal"
                value={registerData.phone}
                onChange={(e) =>
                  setRegisterData({ ...registerData, phone: e.target.value })
                }
              />
              <TextField
                fullWidth
                label="Address"
                margin="normal"
                multiline
                rows={2}
                value={registerData.address}
                onChange={(e) =>
                  setRegisterData({ ...registerData, address: e.target.value })
                }
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                margin="normal"
                required
                value={registerData.password}
                onChange={(e) =>
                  setRegisterData({ ...registerData, password: e.target.value })
                }
              />
              <TextField
                fullWidth
                label="Confirm Password"
                type="password"
                margin="normal"
                required
                value={registerData.confirmPassword}
                onChange={(e) =>
                  setRegisterData({ ...registerData, confirmPassword: e.target.value })
                }
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{ mt: 3, mb: 2 }}
              >
                {loading ? 'Registering...' : 'Register'}
              </Button>
            </Box>
          )}

          <Divider sx={{ my: 3 }}>
            <Chip label="Quick Demo Login" />
          </Divider>

          <div className="demo-login-buttons">
            <Button
              variant="outlined"
              startIcon={<AdminPanelSettings />}
              onClick={() => handleDemoLogin('admin')}
              disabled={loading}
              sx={{ minWidth: 140 }}
            >
              Demo Admin
            </Button>
            <Button
              variant="outlined"
              startIcon={<Person />}
              onClick={() => handleDemoLogin('user')}
              disabled={loading}
              sx={{ minWidth: 140 }}
            >
              Demo User
            </Button>
          </div>

          <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
            <Typography variant="caption" display="block" gutterBottom>
              <strong>Demo Credentials:</strong>
            </Typography>
            <Typography variant="caption" display="block">
              Admin: username=demo_admin, password=admin123
            </Typography>
            <Typography variant="caption" display="block">
              User: username=demo_user, password=user123
            </Typography>
          </Box>
        </Paper>
      </Container>
    </div>
  );
};

export default Login;