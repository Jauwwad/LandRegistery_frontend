import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Box,
  Button,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import {
  Home,
  Verified,
  Pending,
  AccountBalance,
  TrendingUp,
  Map,
  Add,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { landAPI, formatCurrency, formatArea } from '../services/api';

const Dashboard = () => {
  const [statistics, setStatistics] = useState(null);
  const [recentLands, setRecentLands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch statistics
      const statsResponse = await landAPI.getStatistics();
      setStatistics(statsResponse.data);

      // Fetch recent lands
      const landsResponse = await landAPI.getLands({ per_page: 5, owner_only: !isAdmin() });
      setRecentLands(landsResponse.data.lands);

    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color, subtitle, onClick }) => (
    <Card 
      className="dashboard-card" 
      sx={{ cursor: onClick ? 'pointer' : 'default' }}
      onClick={onClick}
    >
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="textSecondary" gutterBottom variant="h6">
              {title}
            </Typography>
            <Typography variant="h4" component="div" color={color}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="textSecondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box sx={{ color, fontSize: 40 }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const getStatusChip = (status) => (
    <Chip 
      label={status.toUpperCase()}
      size="small"
      className={`status-chip ${status}`}
    />
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Welcome Section */}
      <Box mb={4}>
        <Typography variant="h4" gutterBottom>
          Welcome back, {user?.first_name}! 👋
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          {isAdmin() ? 'Admin Dashboard - Manage the entire land registry system' : 'Manage your land properties and track registrations'}
        </Typography>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} className="stats-grid">
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Lands"
            value={statistics?.total_lands || 0}
            icon={<Home />}
            color="primary.main"
            subtitle={isAdmin() ? 'All registered lands' : 'Your properties'}
            onClick={() => navigate('/lands')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Verified"
            value={statistics?.verified_lands || 0}
            icon={<Verified />}
            color="success.main"
            subtitle="Approved properties"
            onClick={() => navigate('/lands?status=verified')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending"
            value={statistics?.pending_lands || 0}
            icon={<Pending />}
            color="warning.main"
            subtitle="Awaiting verification"
            onClick={() => navigate('/lands?status=pending')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="On Blockchain"
            value={statistics?.blockchain_lands || 0}
            icon={<AccountBalance />}
            color="secondary.main"
            subtitle="Registered on Polygon"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Lands */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">
                {isAdmin() ? 'Recent Land Registrations' : 'Your Recent Lands'}
              </Typography>
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={() => navigate('/register-land')}
                size="small"
              >
                Register New Land
              </Button>
            </Box>
            
            {recentLands.length === 0 ? (
              <Box textAlign="center" py={4}>
                <Typography color="textSecondary">
                  No lands found. Start by registering your first property!
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => navigate('/register-land')}
                  sx={{ mt: 2 }}
                >
                  Register Land
                </Button>
              </Box>
            ) : (
              <Box>
                {recentLands.map((land) => (
                  <Card 
                    key={land.id} 
                    className={`land-card property-type-${land.property_type}`}
                    sx={{ mb: 2 }}
                    onClick={() => navigate(`/lands/${land.id}`)}
                  >
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="start" mb={1}>
                        <Typography variant="h6" component="div">
                          {land.title}
                        </Typography>
                        {getStatusChip(land.status)}
                      </Box>
                      
                      <Typography color="textSecondary" gutterBottom>
                        📍 {land.location}
                      </Typography>
                      
                      <Box display="flex" gap={2} mb={1}>
                        <Typography variant="body2">
                          📐 {formatArea(land.area)}
                        </Typography>
                        <Typography variant="body2">
                          🏷️ {land.property_type}
                        </Typography>
                        {land.price && (
                          <Typography variant="body2">
                            💰 {formatCurrency(land.price)}
                          </Typography>
                        )}
                      </Box>
                      
                      <Box display="flex" justifyContent="between" alignItems="center">
                        <Typography variant="caption" color="textSecondary">
                          ID: {land.property_id}
                        </Typography>
                        {land.is_registered_on_blockchain && (
                          <Chip
                            label="On Blockchain"
                            size="small"
                            className="blockchain-badge"
                            sx={{ ml: 'auto' }}
                          />
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                ))}
                
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => navigate('/lands')}
                  sx={{ mt: 2 }}
                >
                  View All Lands
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            
            <Box display="flex" flexDirection="column" gap={2}>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => navigate('/register-land')}
                fullWidth
              >
                Register New Land
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<Map />}
                onClick={() => navigate('/map')}
                fullWidth
              >
                View Map
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<Home />}
                onClick={() => navigate('/lands')}
                fullWidth
              >
                My Properties
              </Button>
              
              {isAdmin() && (
                <Button
                  variant="outlined"
                  startIcon={<TrendingUp />}
                  onClick={() => navigate('/admin')}
                  fullWidth
                >
                  Admin Panel
                </Button>
              )}
            </Box>
          </Paper>

          {/* System Status */}
          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              System Status
            </Typography>
            
            <Box display="flex" flexDirection="column" gap={1}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="body2">Database</Typography>
                <Chip label="Connected" color="success" size="small" />
              </Box>
              
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="body2">Blockchain</Typography>
                <Chip label="Polygon Amoy" color="primary" size="small" />
              </Box>
              
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="body2">Total Transfers</Typography>
                <Typography variant="body2">{statistics?.total_transfers || 0}</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;