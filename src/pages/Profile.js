import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Paper, Box, Grid, Card, CardContent,
  Button, TextField, Chip
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });
  const [userLands, setUserLands] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
      });
      loadUserLands();
    }
  }, [user]);

  const loadUserLands = async () => {
    try {
      const response = await api.get('/lands/my-lands');
      setUserLands(response.data.lands || []);
    } catch (error) {
      console.error('Error loading user lands:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    const result = await updateProfile(profileData);
    if (result.success) {
      setEditing(false);
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4">User Profile</Typography>
          <Button
            variant={editing ? "outlined" : "contained"}
            onClick={() => editing ? setEditing(false) : setEditing(true)}
          >
            {editing ? 'Cancel' : 'Edit Profile'}
          </Button>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="First Name"
              value={profileData.first_name}
              onChange={(e) => setProfileData({ ...profileData, first_name: e.target.value })}
              disabled={!editing}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Last Name"
              value={profileData.last_name}
              onChange={(e) => setProfileData({ ...profileData, last_name: e.target.value })}
              disabled={!editing}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              value={profileData.email}
              onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
              disabled={!editing}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Phone"
              value={profileData.phone}
              onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
              disabled={!editing}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Address"
              value={profileData.address}
              onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
              disabled={!editing}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Wallet Address"
              value={user?.wallet_address || ''}
              disabled
              helperText="Wallet address cannot be changed"
            />
          </Grid>
        </Grid>

        {editing && (
          <Box mt={3} display="flex" gap={2}>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button variant="outlined" onClick={() => setEditing(false)}>
              Cancel
            </Button>
          </Box>
        )}
      </Paper>

      <Paper sx={{ p: 4, mt: 3 }}>
        <Typography variant="h5" gutterBottom>My Properties</Typography>
        {userLands.length > 0 ? (
          <Grid container spacing={2}>
            {userLands.map((land) => (
              <Grid item xs={12} md={6} key={land.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{land.title}</Typography>
                    <Typography color="textSecondary">{land.location}</Typography>
                    <Box mt={2}>
                      <Chip label={land.property_type} size="small" sx={{ mr: 1 }} />
                      <Chip 
                        label={land.status} 
                        color={land.status === 'verified' ? 'success' : 'warning'} 
                        size="small" 
                      />
                    </Box>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Area: {land.area} sq ft • Price: ${land.price?.toLocaleString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography color="textSecondary">
            You haven't registered any properties yet.
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default Profile;