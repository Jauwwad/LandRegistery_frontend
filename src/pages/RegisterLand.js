import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Alert,
  InputAdornment,
} from '@mui/material';
import { Save, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { landAPI } from '../services/api';
import { toast } from 'react-toastify';

const RegisterLand = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    property_id: '',
    title: '',
    description: '',
    location: '',
    area: '',
    property_type: '',
    latitude: '',
    longitude: '',
    price: '',
  });

  const handleChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const validateForm = () => {
    const requiredFields = ['property_id', 'title', 'location', 'area', 'property_type', 'latitude', 'longitude'];
    
    for (const field of requiredFields) {
      if (!formData[field]) {
        setError(`${field.replace('_', ' ')} is required`);
        return false;
      }
    }

    // Validate numeric fields
    if (isNaN(parseFloat(formData.area)) || parseFloat(formData.area) <= 0) {
      setError('Area must be a positive number');
      return false;
    }

    if (isNaN(parseFloat(formData.latitude)) || isNaN(parseFloat(formData.longitude))) {
      setError('Latitude and longitude must be valid numbers');
      return false;
    }

    if (formData.price && (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0)) {
      setError('Price must be a positive number');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError('');

      await landAPI.registerLand(formData);
      toast.success('Land registered successfully!');
      navigate('/lands');
    } catch (err) {
      const message = err.response?.data?.error || 'Failed to register land';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" alignItems="center" mb={3}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/lands')}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4">Register New Land</Typography>
      </Box>

      <Paper sx={{ p: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Property ID"
                value={formData.property_id}
                onChange={handleChange('property_id')}
                helperText="Unique identifier for this property"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl required fullWidth>
                <InputLabel>Property Type</InputLabel>
                <Select
                  value={formData.property_type}
                  label="Property Type"
                  onChange={handleChange('property_type')}
                >
                  <MenuItem value="residential">Residential</MenuItem>
                  <MenuItem value="commercial">Commercial</MenuItem>
                  <MenuItem value="agricultural">Agricultural</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Property Title"
                value={formData.title}
                onChange={handleChange('title')}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={formData.description}
                onChange={handleChange('description')}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Location"
                value={formData.location}
                onChange={handleChange('location')}
                helperText="Full address or detailed location description"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Area"
                type="number"
                value={formData.area}
                onChange={handleChange('area')}
                InputProps={{
                  endAdornment: <InputAdornment position="end">sq m</InputAdornment>,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price"
                type="number"
                value={formData.price}
                onChange={handleChange('price')}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                helperText="Optional"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Latitude"
                type="number"
                inputProps={{ step: "any" }}
                value={formData.latitude}
                onChange={handleChange('latitude')}
                helperText="e.g., 40.7128"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Longitude"
                type="number"
                inputProps={{ step: "any" }}
                value={formData.longitude}
                onChange={handleChange('longitude')}
                helperText="e.g., -74.0060"
              />
            </Grid>

            <Grid item xs={12}>
              <Box display="flex" gap={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  onClick={() => navigate('/lands')}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<Save />}
                  disabled={loading}
                >
                  {loading ? 'Registering...' : 'Register Land'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default RegisterLand;