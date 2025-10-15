import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Paper, Box, Grid, Card, CardContent,
  Button, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Chip, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, MenuItem, Alert, CircularProgress
} from '@mui/material';
import {
  Visibility, Edit, Delete, CheckCircle, Cancel, LocationOn,
  AccountBalance as BlockchainIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export const AdminLands = () => {
  const { user } = useAuth();
  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLand, setSelectedLand] = useState(null);
  const [viewDialog, setViewDialog] = useState(false);

  useEffect(() => {
    loadLands();
  }, []);

  const loadLands = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/lands/all');
      setLands(response.data.lands || []);
    } catch (error) {
      console.error('Error loading lands:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (landId, newStatus) => {
    try {
      await api.post(`/admin/lands/${landId}/review`, { 
        action: newStatus, 
        comments: `Status changed to ${newStatus}` 
      });
      loadLands();
    } catch (error) {
      console.error('Error updating land status:', error);
    }
  };

  const handleRegisterOnBlockchain = async (landId) => {
    try {
      await api.post(`/admin/lands/${landId}/register-blockchain`);
      loadLands();
    } catch (error) {
      console.error('Error registering on blockchain:', error);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading properties...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Property Management
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6">All Properties ({lands.length})</Typography>
          <Button variant="contained" onClick={loadLands}>
            Refresh
          </Button>
        </Box>

        {lands.length > 0 ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Owner</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Area</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Blockchain</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {lands.map((land) => (
                  <TableRow key={land.id}>
                    <TableCell>{land.id}</TableCell>
                    <TableCell>{land.title}</TableCell>
                    <TableCell>{land.owner_name || `${land.owner?.first_name} ${land.owner?.last_name}`}</TableCell>
                    <TableCell>{land.location}</TableCell>
                    <TableCell>{land.property_type}</TableCell>
                    <TableCell>{land.area} sq ft</TableCell>
                    <TableCell>${land.price?.toLocaleString()}</TableCell>
                    <TableCell>
                      <Chip 
                        label={land.status} 
                        color={
                          land.status === 'verified' ? 'success' : 
                          land.status === 'pending' ? 'warning' : 'error'
                        } 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={land.blockchain_id ? 'Registered' : 'Not Registered'} 
                        color={land.blockchain_id ? 'success' : 'default'} 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => {
                          setSelectedLand(land);
                          setViewDialog(true);
                        }}
                        color="primary"
                        size="small"
                      >
                        <Visibility />
                      </IconButton>
                      {land.status === 'pending' && (
                        <>
                          <IconButton
                            onClick={() => handleStatusChange(land.id, 'approve')}
                            color="success"
                            size="small"
                          >
                            <CheckCircle />
                          </IconButton>
                          <IconButton
                            onClick={() => handleStatusChange(land.id, 'reject')}
                            color="error"
                            size="small"
                          >
                            <Cancel />
                          </IconButton>
                        </>
                      )}
                      {land.status === 'verified' && !land.blockchain_id && (
                        <IconButton
                          onClick={() => handleRegisterOnBlockchain(land.id)}
                          color="info"
                          size="small"
                        >
                          <BlockchainIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Alert severity="info">No properties found</Alert>
        )}
      </Paper>

      {/* View Dialog */}
      <Dialog open={viewDialog} onClose={() => setViewDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Property Details</DialogTitle>
        <DialogContent>
          {selectedLand && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Title</Typography>
                <Typography>{selectedLand.title}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Owner</Typography>
                <Typography>{selectedLand.owner_name || `${selectedLand.owner?.first_name} ${selectedLand.owner?.last_name}`}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Location</Typography>
                <Typography>{selectedLand.location}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Property Type</Typography>
                <Typography>{selectedLand.property_type}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Area</Typography>
                <Typography>{selectedLand.area} sq ft</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Price</Typography>
                <Typography>${selectedLand.price?.toLocaleString()}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2">Description</Typography>
                <Typography>{selectedLand.description}</Typography>
              </Grid>
              {selectedLand.blockchain_id && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Blockchain ID</Typography>
                  <Typography sx={{ fontFamily: 'monospace' }}>{selectedLand.blockchain_id}</Typography>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminLands;