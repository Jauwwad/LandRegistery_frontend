import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  IconButton,
  Button,
  Container,
  useTheme,
  alpha,
  Paper,
  Chip,
  Divider,
  Stack,
  LinearProgress,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Home as HomeIcon,
  SwapHoriz as TransferIcon,
  Add as AddIcon,
  LocationOn as LocationIcon,
  Assessment as AssessmentIcon,
  Timeline as TimelineIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  Verified as VerifiedIcon,
  AccountBalance as AccountBalanceIcon,
  ArrowForward as ArrowForwardIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { landAPI } from '../services/api';
import { customStyles, gradients, colors } from '../theme';

function Dashboard() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalLands: 0,
    pendingTransfers: 0,
    completedTransfers: 0,
    totalValue: 0
  });
  const [recentLands, setRecentLands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const landsResponse = await landAPI.getLands();
      
      if (landsResponse && landsResponse.data) {
        const lands = landsResponse.data.lands || [];
        setStats({
          totalLands: lands.length,
          pendingTransfers: lands.filter(land => land.status === 'pending_transfer').length,
          completedTransfers: lands.filter(land => land.status === 'transferred').length,
          totalValue: lands.reduce((sum, land) => sum + (land.value || 0), 0)
        });
        setRecentLands(lands.slice(0, 3));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, gradient, change, onClick }) => (
    <Card
      sx={{
        ...customStyles.glassMorphism,
        cursor: onClick ? 'pointer' : 'default',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': onClick ? {
          transform: 'translateY(-8px) scale(1.02)',
          ...customStyles.neonGlow,
        } : {},
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: gradient,
        },
      }}
      onClick={onClick}
    >
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                mb: 1,
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                background: gradient,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                mb: 1,
              }}
            >
              {value}
            </Typography>
            {change && (
              <Chip
                label={change}
                size="small"
                sx={{
                  background: 'rgba(16, 185, 129, 0.2)',
                  color: colors.success.main,
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                }}
              />
            )}
          </Box>
          <Avatar
            sx={{
              background: gradient,
              width: 64,
              height: 64,
              boxShadow: '0 8px 24px rgba(0, 212, 255, 0.3)',
            }}
          >
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );

  const QuickActionCard = ({ title, description, icon, gradient, onClick }) => (
    <Card
      sx={{
        ...customStyles.glassMorphism,
        cursor: 'pointer',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-4px)',
          ...customStyles.neonGlow,
        },
      }}
      onClick={onClick}
    >
      <CardContent sx={{ p: 3, textAlign: 'center' }}>
        <Avatar
          sx={{
            background: gradient,
            width: 56,
            height: 56,
            mx: 'auto',
            mb: 2,
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

  const WelcomeSection = () => (
    <Paper
      sx={{
        ...customStyles.glassMorphism,
        p: 4,
        mb: 4,
        position: 'relative',
        overflow: 'hidden',
        background: gradients.hero,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-50%',
          right: '-50%',
          width: '200%',
          height: '200%',
          background: `radial-gradient(circle, ${alpha(colors.primary.main, 0.1)} 0%, transparent 70%)`,
          animation: 'pulse 4s ease-in-out infinite',
        },
      }}
    >
      <Box position="relative" zIndex={1}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 1,
                background: gradients.neon,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Welcome back, {user?.name || 'User'}! 🚀
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Manage your digital land portfolio with blockchain security and real-time insights.
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/register-land')}
                sx={{
                  background: gradients.primary,
                  boxShadow: '0 4px 16px rgba(0, 212, 255, 0.3)',
                }}
              >
                Register New Land
              </Button>
              <Button
                variant="outlined"
                startIcon={<LocationIcon />}
                onClick={() => navigate('/map')}
              >
                View Map
              </Button>
            </Stack>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                position: 'relative',
                height: 200,
                background: gradients.card,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <SecurityIcon sx={{ fontSize: 80, color: colors.primary.main, opacity: 0.7 }} />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ width: '100%' }}>
          <LinearProgress 
            sx={{
              background: 'rgba(255, 255, 255, 0.1)',
              '& .MuiLinearProgress-bar': {
                background: gradients.primary,
              },
            }}
          />
        </Box>
        <Typography variant="h6" align="center" sx={{ mt: 2 }}>
          Loading your dashboard...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <WelcomeSection />

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Total Lands"
            value={stats.totalLands}
            icon={<HomeIcon />}
            gradient={gradients.primary}
            change="+12% this month"
            onClick={() => navigate('/lands')}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Pending Transfers"
            value={stats.pendingTransfers}
            icon={<TransferIcon />}
            gradient={gradients.secondary}
            onClick={() => navigate('/transfers')}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Completed"
            value={stats.completedTransfers}
            icon={<VerifiedIcon />}
            gradient="linear-gradient(135deg, #10B981 0%, #34D399 100%)"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Portfolio Value"
            value={`$${stats.totalValue.toLocaleString()}`}
            icon={<AccountBalanceIcon />}
            gradient="linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)"
          />
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        {/* Quick Actions */}
        <Grid item xs={12} lg={8}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
            Quick Actions
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <QuickActionCard
                title="Register Land"
                description="Add new property to blockchain"
                icon={<AddIcon />}
                gradient={gradients.primary}
                onClick={() => navigate('/register-land')}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <QuickActionCard
                title="View Properties"
                description="Browse your land portfolio"
                icon={<HomeIcon />}
                gradient={gradients.secondary}
                onClick={() => navigate('/lands')}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <QuickActionCard
                title="Map View"
                description="Explore lands on interactive map"
                icon={<LocationIcon />}
                gradient="linear-gradient(135deg, #10B981 0%, #34D399 100%)"
                onClick={() => navigate('/map')}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <QuickActionCard
                title="Analytics"
                description="View detailed insights"
                icon={<AssessmentIcon />}
                gradient="linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)"
                onClick={() => navigate('/analytics')}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <QuickActionCard
                title="Transfers"
                description="Manage property transfers"
                icon={<TransferIcon />}
                gradient="linear-gradient(135deg, #F59E0B 0%, #FCD34D 100%)"
                onClick={() => navigate('/transfers')}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <QuickActionCard
                title="Profile"
                description="Update your information"
                icon={<StarIcon />}
                gradient="linear-gradient(135deg, #EF4444 0%, #F87171 100%)"
                onClick={() => navigate('/profile')}
              />
            </Grid>
          </Grid>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ ...customStyles.glassMorphism, p: 3, height: 'fit-content' }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Recent Lands
              </Typography>
              <Button
                size="small"
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate('/lands')}
              >
                View All
              </Button>
            </Box>
            <Stack spacing={2}>
              {recentLands.length > 0 ? (
                recentLands.map((land, index) => (
                  <Box
                    key={land.id}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: 'rgba(0, 212, 255, 0.1)',
                        transform: 'translateX(8px)',
                      },
                    }}
                    onClick={() => navigate(`/lands/${land.id}`)}
                  >
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {land.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {land.location}
                    </Typography>
                    <Box display="flex" alignItems="center" justifyContent="between" mt={1}>
                      <Chip
                        label={land.status}
                        size="small"
                        color={land.status === 'active' ? 'success' : 'warning'}
                      />
                      <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                        ${land.value?.toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                ))
              ) : (
                <Box textAlign="center" py={4}>
                  <HomeIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="body2" color="text.secondary">
                    No lands registered yet
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => navigate('/register-land')}
                    sx={{ mt: 2 }}
                  >
                    Register Your First Land
                  </Button>
                </Box>
              )}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Dashboard;