import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Tooltip,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
  Chip,
  Divider,
  Badge,
} from '@mui/material';
import {
  AccountCircle,
  Dashboard,
  Map,
  Home,
  Add,
  AdminPanelSettings,
  ExitToApp,
  SwapHoriz,
  Menu as MenuIcon,
  Notifications,
  Settings,
  Person,
  Analytics,
  Security,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { customStyles, gradients, colors } from '../theme';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, logout, isAdmin } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard', icon: <Dashboard />, color: colors.primary.main },
    { label: 'My Lands', path: '/lands', icon: <Home />, color: colors.secondary.main },
    { label: 'Transfers', path: '/transfers', icon: <SwapHoriz />, color: colors.accent.main },
    { label: 'Map View', path: '/map', icon: <Map />, color: colors.success.main },
    { label: 'Register Land', path: '/register-land', icon: <Add />, color: colors.warning.main },
  ];

  if (isAdmin()) {
    menuItems.push({
      label: 'Admin Panel',
      path: '/admin',
      icon: <AdminPanelSettings />,
      color: colors.error.main,
    });
  }

  const userMenuItems = [
    { label: 'Profile', path: '/profile', icon: <Person /> },
    { label: 'Analytics', path: '/analytics', icon: <Analytics /> },
    { label: 'Settings', path: '/settings', icon: <Settings /> },
  ];

  const FuturisticLogo = () => (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'scale(1.05)',
        },
      }}
      onClick={() => navigate('/dashboard')}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: '12px',
          background: gradients.primary,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mr: 2,
          boxShadow: '0 4px 16px rgba(0, 212, 255, 0.3)',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: -2,
            left: -2,
            right: -2,
            bottom: -2,
            background: gradients.primary,
            borderRadius: '14px',
            zIndex: -1,
            opacity: 0.5,
            animation: 'pulse 2s ease-in-out infinite',
          },
        }}
      >
        <Security sx={{ fontSize: 24, color: 'white' }} />
      </Box>
      <Box>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            background: gradients.neon,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            lineHeight: 1.2,
          }}
        >
          LandChain
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: 'text.secondary',
            fontWeight: 500,
            letterSpacing: '1px',
            textTransform: 'uppercase',
          }}
        >
          Registry
        </Typography>
      </Box>
    </Box>
  );

  const NavButton = ({ item, onClick }) => (
    <Button
      startIcon={item.icon}
      onClick={onClick}
      sx={{
        mx: 0.5,
        px: 2,
        py: 1,
        borderRadius: '12px',
        textTransform: 'none',
        fontWeight: 600,
        fontSize: '0.875rem',
        color: isActive(item.path) ? 'white' : 'rgba(255, 255, 255, 0.8)',
        background: isActive(item.path) 
          ? gradients.primary 
          : 'transparent',
        border: isActive(item.path) 
          ? 'none' 
          : '1px solid rgba(255, 255, 255, 0.1)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          background: isActive(item.path) 
            ? gradients.primary 
            : 'rgba(255, 255, 255, 0.1)',
          transform: 'translateY(-2px)',
          boxShadow: isActive(item.path)
            ? '0 8px 24px rgba(0, 212, 255, 0.4)'
            : '0 4px 16px rgba(255, 255, 255, 0.1)',
        },
        '& .MuiButton-startIcon': {
          color: isActive(item.path) ? 'white' : item.color,
        },
      }}
    >
      {item.label}
    </Button>
  );

  const UserProfile = () => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      {/* Notifications */}
      <Tooltip title="Notifications">
        <IconButton
          sx={{
            color: 'rgba(255, 255, 255, 0.8)',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.1)',
              color: colors.primary.main,
            },
          }}
        >
          <Badge badgeContent={3} color="error">
            <Notifications />
          </Badge>
        </IconButton>
      </Tooltip>

      {/* User Info */}
      <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1 }}>
        <Box sx={{ textAlign: 'right' }}>
          <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
            {user?.first_name} {user?.last_name}
          </Typography>
          <Chip
            label={isAdmin() ? 'Admin' : 'User'}
            size="small"
            sx={{
              height: 20,
              fontSize: '0.7rem',
              fontWeight: 600,
              background: isAdmin() ? gradients.secondary : gradients.primary,
              color: 'white',
            }}
          />
        </Box>
      </Box>

      {/* Profile Avatar */}
      <Tooltip title="Profile Menu">
        <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
          <Avatar
            sx={{
              width: 44,
              height: 44,
              background: gradients.primary,
              border: '2px solid rgba(255, 255, 255, 0.2)',
              transition: 'all 0.3s ease',
              '&:hover': {
                ...customStyles.neonGlow,
                transform: 'scale(1.1)',
              },
            }}
          >
            {user?.first_name?.charAt(0).toUpperCase() || 'U'}
          </Avatar>
        </IconButton>
      </Tooltip>
    </Box>
  );

  const MobileDrawer = () => (
    <Drawer
      anchor="left"
      open={mobileMenuOpen}
      onClose={toggleMobileMenu}
      sx={{
        '& .MuiDrawer-paper': {
          width: 280,
          background: 'rgba(15, 15, 35, 0.95)',
          backdropFilter: 'blur(20px)',
          border: 'none',
          borderRight: '1px solid rgba(255, 255, 255, 0.1)',
        },
      }}
    >
      <Box sx={{ p: 3 }}>
        <FuturisticLogo />
      </Box>
      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
      <List sx={{ px: 2, py: 2 }}>
        {menuItems.map((item) => (
          <ListItem
            key={item.path}
            onClick={() => {
              navigate(item.path);
              toggleMobileMenu();
            }}
            sx={{
              borderRadius: '12px',
              mb: 1,
              cursor: 'pointer',
              background: isActive(item.path) ? gradients.primary : 'transparent',
              '&:hover': {
                background: isActive(item.path) 
                  ? gradients.primary 
                  : 'rgba(0, 212, 255, 0.1)',
              },
            }}
          >
            <ListItemIcon sx={{ color: isActive(item.path) ? 'white' : item.color }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.label}
              sx={{
                '& .MuiListItemText-primary': {
                  fontWeight: isActive(item.path) ? 600 : 500,
                  color: isActive(item.path) ? 'white' : 'rgba(255, 255, 255, 0.8)',
                },
              }}
            />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{
          background: 'rgba(15, 15, 35, 0.9)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.3)',
        }}
      >
        <Toolbar sx={{ py: 1 }}>
          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              onClick={toggleMobileMenu}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Logo */}
          <FuturisticLogo />

          {/* Desktop Navigation */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
            {menuItems.map((item) => (
              <NavButton
                key={item.path}
                item={item}
                onClick={() => navigate(item.path)}
              />
            ))}
          </Box>

          {/* User Profile */}
          <UserProfile />
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <MobileDrawer />

      {/* User Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            ...customStyles.glassMorphism,
            mt: 1,
            minWidth: 200,
          },
        }}
      >
        {userMenuItems.map((item) => (
          <MenuItem
            key={item.path}
            onClick={() => {
              navigate(item.path);
              handleMenuClose();
            }}
            sx={{
              py: 1.5,
              '&:hover': {
                background: 'rgba(0, 212, 255, 0.1)',
              },
            }}
          >
            <ListItemIcon sx={{ color: colors.primary.main }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </MenuItem>
        ))}
        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', my: 1 }} />
        <MenuItem
          onClick={handleLogout}
          sx={{
            py: 1.5,
            color: colors.error.main,
            '&:hover': {
              background: 'rgba(239, 68, 68, 0.1)',
            },
          }}
        >
          <ListItemIcon sx={{ color: colors.error.main }}>
            <ExitToApp />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </MenuItem>
      </Menu>
    </>
  );
};

export default Navbar;