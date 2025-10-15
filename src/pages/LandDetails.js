import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Chip,
  Grid,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import { ArrowBack, LocationOn, AccountBalance, Verified } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { landAPI, formatCurrency, formatArea, formatDate } from '../services/api';
import LandTransfer from '../components/LandTransfer';

const LandDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [land, setLand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLandDetails();
  }, [id]);

  const fetchLandDetails = async () => {
    try {
      setLoading(true);
      const response = await landAPI.getLand(id);
      setLand(response.data.land);
    } catch (err) {
      setError('Failed to load land details');
      console.error('Land details error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !land) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error || 'Land not found'}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" alignItems="center" mb={3}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/lands')}
          sx={{ mr: 2 }}
        >
          Back to Lands
        </Button>
        <Typography variant="h4" component="h1">
          {land.title}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Main Details */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="start" mb={3}>
              <Typography variant="h5" gutterBottom>
                Property Details
              </Typography>
              <Chip
                label={land.status.toUpperCase()}
                color={land.status === 'verified' ? 'success' : land.status === 'pending' ? 'warning' : 'error'}
              />
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Property ID</Typography>
                <Typography variant="body1" gutterBottom>{land.property_id}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Property Type</Typography>
                <Typography variant="body1" gutterBottom>{land.property_type}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="textSecondary">Location</Typography>
                <Typography variant="body1" gutterBottom>
                  <LocationOn sx={{ fontSize: 16, mr: 0.5 }} />
                  {land.location}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Area</Typography>
                <Typography variant="body1" gutterBottom>{formatArea(land.area)}</Typography>
              </Grid>
              {land.price && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Price</Typography>
                  <Typography variant="body1" gutterBottom>{formatCurrency(land.price)}</Typography>
                </Grid>
              )}
              {land.description && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">Description</Typography>
                  <Typography variant="body1" gutterBottom>{land.description}</Typography>
                </Grid>
              )}
            </Grid>
          </Paper>

          {/* Map */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Location Map</Typography>
            <Box sx={{ height: 300, borderRadius: 1, overflow: 'hidden' }}>
              <MapContainer
                center={[land.latitude, land.longitude]}
                zoom={15}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[land.latitude, land.longitude]} />
              </MapContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Owner Info */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Owner Information</Typography>
              <Typography variant="body2" color="textSecondary">Name</Typography>
              <Typography variant="body1" gutterBottom>
                {land.owner?.first_name} {land.owner?.last_name}
              </Typography>
              <Typography variant="body2" color="textSecondary">Email</Typography>
              <Typography variant="body1" gutterBottom>{land.owner?.email}</Typography>
              {land.wallet_address && (
                <>
                  <Typography variant="body2" color="textSecondary">Wallet Address</Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
                    {land.wallet_address}
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>

          {/* Blockchain Info */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <AccountBalance sx={{ mr: 1 }} />
                Blockchain Status
              </Typography>
              
              {land.is_registered_on_blockchain ? (
                <Box>
                  <Chip
                    label="Registered on Polygon"
                    color="success"
                    icon={<Verified />}
                    sx={{ mb: 2 }}
                  />
                  {land.token_id && (
                    <>
                      <Typography variant="body2" color="textSecondary">Token ID</Typography>
                      <Typography variant="body1" gutterBottom>{land.token_id}</Typography>
                    </>
                  )}
                  {land.blockchain_tx_hash && (
                    <>
                      <Typography variant="body2" color="textSecondary">Transaction Hash</Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}
                        gutterBottom
                      >
                        {land.blockchain_tx_hash}
                      </Typography>
                    </>
                  )}
                </Box>
              ) : (
                <Box>
                  <Chip label="Not on Blockchain" color="default" sx={{ mb: 2 }} />
                  <Typography variant="body2" color="textSecondary">
                    This property has not been registered on the blockchain yet.
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Timestamps */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Timeline</Typography>
              <Typography variant="body2" color="textSecondary">Registered</Typography>
              <Typography variant="body1" gutterBottom>
                {formatDate(land.created_at)}
              </Typography>
              <Typography variant="body2" color="textSecondary">Last Updated</Typography>
              <Typography variant="body1">
                {formatDate(land.updated_at)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Land Transfer Section */}
      <Box sx={{ mt: 4 }}>
        <LandTransfer 
          land={land} 
          onTransferComplete={fetchLandDetails}
        />
      </Box>
    </Container>
  );
};

export default LandDetails;