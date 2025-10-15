import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import { FilterList, Refresh } from '@mui/icons-material';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { landAPI, formatCurrency, formatArea, getPropertyTypeColor } from '../services/api';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons for different property types
const createCustomIcon = (color) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

const MapView = () => {
  const [lands, setLands] = useState([]);
  const [filteredLands, setFilteredLands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    propertyType: '',
    status: '',
    search: '',
  });
  const [mapCenter] = useState([40.7128, -74.0060]); // Default to NYC
  const [mapZoom] = useState(10);

  useEffect(() => {
    fetchMapData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [lands, filters]);

  const fetchMapData = async () => {
    try {
      setLoading(true);
      const response = await landAPI.getMapData();
      setLands(response.data.lands);
    } catch (err) {
      setError('Failed to load map data');
      console.error('Map data error:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...lands];

    if (filters.propertyType) {
      filtered = filtered.filter(land => land.property_type === filters.propertyType);
    }

    if (filters.status) {
      filtered = filtered.filter(land => land.status === filters.status);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(land => 
        land.title.toLowerCase().includes(searchLower) ||
        land.location.toLowerCase().includes(searchLower) ||
        land.property_id.toLowerCase().includes(searchLower)
      );
    }

    setFilteredLands(filtered);
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setFilters({
      propertyType: '',
      status: '',
      search: '',
    });
  };

  const MapEvents = () => {
    useMapEvents({
      moveend: useCallback(() => {
        // Could implement dynamic loading based on map bounds here
      }, []),
    });
    return null;
  };

  const LandPopup = ({ land }) => (
    <div className="land-popup">
      <h3>{land.title}</h3>
      <p><strong>📍 Location:</strong> {land.location}</p>
      <p><strong>📐 Area:</strong> {formatArea(land.area)}</p>
      <p><strong>🏷️ Type:</strong> {land.property_type}</p>
      {land.price && <p><strong>💰 Price:</strong> {formatCurrency(land.price)}</p>}
      <p><strong>👤 Owner:</strong> {land.owner_name}</p>
      <div style={{ display: 'flex', gap: '5px', marginTop: '10px' }}>
        <Chip 
          label={land.status.toUpperCase()} 
          size="small" 
          color={land.status === 'verified' ? 'success' : land.status === 'pending' ? 'warning' : 'error'}
        />
        {land.is_registered_on_blockchain && (
          <Chip label="Blockchain" size="small" color="secondary" />
        )}
      </div>
    </div>
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

      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom>
          🗺️ Land Registry Map
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={fetchMapData}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
          <FilterList color="action" />
          <Typography variant="h6">Filters:</Typography>
          
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Property Type</InputLabel>
            <Select
              value={filters.propertyType}
              label="Property Type"
              onChange={(e) => handleFilterChange('propertyType', e.target.value)}
            >
              <MenuItem value="">All Types</MenuItem>
              <MenuItem value="residential">Residential</MenuItem>
              <MenuItem value="commercial">Commercial</MenuItem>
              <MenuItem value="agricultural">Agricultural</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status}
              label="Status"
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <MenuItem value="">All Status</MenuItem>
              <MenuItem value="verified">Verified</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </Select>
          </FormControl>

          <TextField
            size="small"
            label="Search"
            placeholder="Search by title, location, or ID"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            sx={{ minWidth: 200 }}
          />

          <Button
            variant="outlined"
            onClick={clearFilters}
            size="small"
          >
            Clear Filters
          </Button>

          <Typography variant="body2" color="textSecondary" sx={{ ml: 'auto' }}>
            Showing {filteredLands.length} of {lands.length} properties
          </Typography>
        </Box>
      </Paper>

      {/* Map */}
      <Paper sx={{ height: '70vh', overflow: 'hidden' }}>
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          style={{ height: '100%', width: '100%' }}
          className="full-height-map"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <MapEvents />

          {filteredLands.map((land) => (
            <Marker
              key={land.id}
              position={[land.latitude, land.longitude]}
              icon={createCustomIcon(getPropertyTypeColor(land.property_type))}
            >
              <Popup>
                <LandPopup land={land} />
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Map Legend */}
        <div className="map-legend">
          <Typography variant="subtitle2" gutterBottom>
            Property Types
          </Typography>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
              <div style={{ 
                width: '12px', 
                height: '12px', 
                borderRadius: '50%', 
                backgroundColor: getPropertyTypeColor('residential'),
                marginRight: '8px'
              }}></div>
              <Typography variant="caption">Residential</Typography>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
              <div style={{ 
                width: '12px', 
                height: '12px', 
                borderRadius: '50%', 
                backgroundColor: getPropertyTypeColor('commercial'),
                marginRight: '8px'
              }}></div>
              <Typography variant="caption">Commercial</Typography>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ 
                width: '12px', 
                height: '12px', 
                borderRadius: '50%', 
                backgroundColor: getPropertyTypeColor('agricultural'),
                marginRight: '8px'
              }}></div>
              <Typography variant="caption">Agricultural</Typography>
            </div>
          </div>
        </div>
      </Paper>

      {/* Statistics */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Map Statistics
        </Typography>
        <Box display="flex" gap={4} flexWrap="wrap">
          <Box>
            <Typography variant="h4" color="primary">
              {filteredLands.length}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Properties Shown
            </Typography>
          </Box>
          <Box>
            <Typography variant="h4" color="success.main">
              {filteredLands.filter(l => l.is_verified).length}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Verified Properties
            </Typography>
          </Box>
          <Box>
            <Typography variant="h4" color="secondary.main">
              {filteredLands.filter(l => l.is_registered_on_blockchain).length}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              On Blockchain
            </Typography>
          </Box>
          <Box>
            <Typography variant="h4" color="info.main">
              {filteredLands.reduce((sum, land) => sum + land.area, 0).toLocaleString()}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Total Area (sq m)
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default MapView;