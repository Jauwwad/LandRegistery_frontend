// LandList.js
import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Add, Search, FilterList } from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { landAPI, formatCurrency, formatArea, formatDate } from '../services/api';

const LandList = () => {
  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    status: searchParams.get('status') || '',
    property_type: searchParams.get('property_type') || '',
  });
  const [pagination, setPagination] = useState({
    page: parseInt(searchParams.get('page')) || 1,
    per_page: 12,
    total: 0,
    pages: 0,
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchLands();
  }, [pagination.page, filters]);

  const fetchLands = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        per_page: pagination.per_page,
        ...filters,
      };
      
      Object.keys(params).forEach(key => {
        if (!params[key]) delete params[key];
      });

      const response = await landAPI.getLands(params);
      setLands(response.data.lands);
      setPagination(prev => ({
        ...prev,
        total: response.data.total,
        pages: response.data.pages,
      }));

      // Update URL params
      const newParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value) newParams.set(key, value);
      });
      setSearchParams(newParams);

    } catch (err) {
      setError('Failed to load lands');
      console.error('Lands fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (event, value) => {
    setPagination(prev => ({ ...prev, page: value }));
  };

  const getStatusChip = (status) => (
    <Chip 
      label={status.toUpperCase()}
      size="small"
      color={status === 'verified' ? 'success' : status === 'pending' ? 'warning' : 'error'}
    />
  );

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">My Land Properties</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/register-land')}
        >
          Register New Land
        </Button>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
            <FilterList color="action" />
            <TextField
              size="small"
              placeholder="Search lands..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              InputProps={{ startAdornment: <Search /> }}
              sx={{ minWidth: 200 }}
            />
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.status}
                label="Status"
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="verified">Verified</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Type</InputLabel>
              <Select
                value={filters.property_type}
                label="Type"
                onChange={(e) => handleFilterChange('property_type', e.target.value)}
              >
                <MenuItem value="">All Types</MenuItem>
                <MenuItem value="residential">Residential</MenuItem>
                <MenuItem value="commercial">Commercial</MenuItem>
                <MenuItem value="agricultural">Agricultural</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      {loading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      ) : lands.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              No lands found
            </Typography>
            <Typography color="textSecondary" mb={3}>
              Start by registering your first property
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate('/register-land')}
            >
              Register Land
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <Grid container spacing={3}>
            {lands.map((land) => (
              <Grid item xs={12} sm={6} md={4} key={land.id}>
                <Card 
                  className={`land-card property-type-${land.property_type}`}
                  onClick={() => navigate(`/lands/${land.id}`)}
                  sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                      <Typography variant="h6" component="div" noWrap>
                        {land.title}
                      </Typography>
                      {getStatusChip(land.status)}
                    </Box>
                    
                    <Typography color="textSecondary" gutterBottom>
                      📍 {land.location}
                    </Typography>
                    
                    <Box mb={2}>
                      <Typography variant="body2">
                        📐 {formatArea(land.area)} • 🏷️ {land.property_type}
                      </Typography>
                      {land.price && (
                        <Typography variant="body2">
                          💰 {formatCurrency(land.price)}
                        </Typography>
                      )}
                    </Box>
                    
                    <Box display="flex" justifyContent="space-between" alignItems="center" mt="auto">
                      <Typography variant="caption" color="textSecondary">
                        {formatDate(land.created_at)}
                      </Typography>
                      {land.is_registered_on_blockchain && (
                        <Chip
                          label="Blockchain"
                          size="small"
                          color="secondary"
                        />
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {pagination.pages > 1 && (
            <Box display="flex" justifyContent="center" mt={4}>
              <Pagination
                count={pagination.pages}
                page={pagination.page}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default LandList;