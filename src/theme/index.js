import { createTheme } from '@mui/material/styles';

// Futuristic color palette
const colors = {
  primary: {
    main: '#00D4FF', // Cyan blue
    light: '#4DDBFF',
    dark: '#0099CC',
    50: '#E6F9FF',
    100: '#B3EFFF',
    200: '#80E5FF',
    300: '#4DDBFF',
    400: '#1AD1FF',
    500: '#00D4FF',
    600: '#00B8E6',
    700: '#009CCC',
    800: '#0080B3',
    900: '#006499',
  },
  secondary: {
    main: '#FF6B35', // Electric orange
    light: '#FF8A5C',
    dark: '#E55A2B',
    50: '#FFF2ED',
    100: '#FFDCC7',
    200: '#FFC7A1',
    300: '#FFB17B',
    400: '#FF9055',
    500: '#FF6B35',
    600: '#E55A2B',
    700: '#CC4A21',
    800: '#B23917',
    900: '#99290D',
  },
  accent: {
    main: '#8B5CF6', // Purple
    light: '#A78BFA',
    dark: '#7C3AED',
  },
  success: {
    main: '#10B981', // Emerald
    light: '#34D399',
    dark: '#059669',
  },
  warning: {
    main: '#F59E0B', // Amber
    light: '#FCD34D',
    dark: '#D97706',
  },
  error: {
    main: '#EF4444', // Red
    light: '#F87171',
    dark: '#DC2626',
  },
  info: {
    main: '#3B82F6', // Blue
    light: '#60A5FA',
    dark: '#2563EB',
  },
  dark: {
    main: '#0F0F23', // Deep space blue
    light: '#1A1A2E',
    medium: '#16213E',
    dark: '#0A0A1A',
  },
  glass: {
    light: 'rgba(255, 255, 255, 0.1)',
    medium: 'rgba(255, 255, 255, 0.15)',
    dark: 'rgba(0, 0, 0, 0.2)',
  }
};

// Custom gradients
const gradients = {
  primary: 'linear-gradient(135deg, #00D4FF 0%, #8B5CF6 100%)',
  secondary: 'linear-gradient(135deg, #FF6B35 0%, #F59E0B 100%)',
  dark: 'linear-gradient(135deg, #0F0F23 0%, #1A1A2E 100%)',
  glass: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
  hero: 'linear-gradient(135deg, #0F0F23 0%, #16213E 50%, #1A1A2E 100%)',
  card: 'linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
  neon: 'linear-gradient(45deg, #00D4FF 0%, #8B5CF6 50%, #FF6B35 100%)',
};

// Create the futuristic theme
export const futuristicTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: colors.primary,
    secondary: colors.secondary,
    background: {
      default: colors.dark.main,
      paper: colors.dark.light,
    },
    text: {
      primary: '#FFFFFF',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
    divider: 'rgba(255, 255, 255, 0.12)',
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
    info: colors.info,
  },
  typography: {
    fontFamily: [
      'Inter',
      'SF Pro Display',
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Roboto',
      'Helvetica Neue',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '3.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '2.5rem',
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: gradients.hero,
          minHeight: '100vh',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: colors.dark.light,
          },
          '&::-webkit-scrollbar-thumb': {
            background: colors.primary.main,
            borderRadius: '4px',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: gradients.card,
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: gradients.card,
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 40px rgba(0, 212, 255, 0.2)',
            border: '1px solid rgba(0, 212, 255, 0.3)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.875rem',
          padding: '10px 24px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        contained: {
          background: gradients.primary,
          color: '#FFFFFF',
          boxShadow: '0 4px 16px rgba(0, 212, 255, 0.3)',
          '&:hover': {
            background: gradients.primary,
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 24px rgba(0, 212, 255, 0.4)',
          },
        },
        outlined: {
          border: '1px solid rgba(0, 212, 255, 0.5)',
          color: colors.primary.main,
          '&:hover': {
            border: '1px solid rgba(0, 212, 255, 0.8)',
            background: 'rgba(0, 212, 255, 0.1)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          fontWeight: 600,
          fontSize: '0.75rem',
        },
        filled: {
          background: gradients.glass,
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            borderRadius: 12,
            '& fieldset': {
              border: '1px solid rgba(255, 255, 255, 0.2)',
              transition: 'all 0.3s ease',
            },
            '&:hover fieldset': {
              border: '1px solid rgba(0, 212, 255, 0.5)',
            },
            '&.Mui-focused fieldset': {
              border: '2px solid rgba(0, 212, 255, 0.8)',
              boxShadow: '0 0 0 3px rgba(0, 212, 255, 0.1)',
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(15, 15, 35, 0.9)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.3)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: 'rgba(15, 15, 35, 0.95)',
          backdropFilter: 'blur(20px)',
          border: 'none',
          borderRight: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          margin: '4px 8px',
          '&:hover': {
            background: 'rgba(0, 212, 255, 0.1)',
          },
          '&.Mui-selected': {
            background: gradients.primary,
            '&:hover': {
              background: gradients.primary,
            },
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          minHeight: 48,
          '&.Mui-selected': {
            color: colors.primary.main,
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          background: gradients.primary,
          height: 3,
          borderRadius: 2,
        },
      },
    },
  },
});

// Custom styles for components
export const customStyles = {
  glassMorphism: {
    background: gradients.glass,
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
  },
  neonGlow: {
    boxShadow: `0 0 20px ${colors.primary.main}40, 0 0 40px ${colors.primary.main}20`,
  },
  gradientText: {
    background: gradients.neon,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  heroSection: {
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
      background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%2300D4FF" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
      animation: 'float 20s ease-in-out infinite',
    },
  },
  floatingAnimation: {
    '@keyframes float': {
      '0%, 100%': { transform: 'translateY(0px)' },
      '50%': { transform: 'translateY(-20px)' },
    },
  },
};

export { colors, gradients };
export default futuristicTheme;