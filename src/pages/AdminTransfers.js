import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Paper, Box, Grid, Card, CardContent,
  Button, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Chip, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Alert, CircularProgress
} from '@mui/material';
import {
  SwapHoriz, Visibility, CheckCircle, Cancel, Block,
  AccountBalance as BlockchainIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export const AdminTransfers = () => {
  const { user } = useAuth();
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTransfer, setSelectedTransfer] = useState(null);
  const [viewDialog, setViewDialog] = useState(false);

  useEffect(() => {
    loadTransfers();
  }, []);

  const loadTransfers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/transfers');
      setTransfers(response.data.transfers || []);
    } catch (error) {
      console.error('Error loading transfers:', error);
      // Mock data for demonstration
      setTransfers([
        {
          id: 1,
          land_id: 1,
          land_title: 'Downtown Commercial Plot',
          from_user: 'John Doe',
          to_user: 'Jane Smith',
          from_address: '0x1234...5678',
          to_address: '0x8765...4321',
          status: 'pending',
          transaction_hash: null,
          created_at: new Date().toISOString(),
          price: 500000
        },
        {
          id: 2,
          land_id: 2,
          land_title: 'Residential Villa',
          from_user: 'Alice Johnson',
          to_user: 'Bob Wilson',
          from_address: '0x2345...6789',
          to_address: '0x9876...5432',
          status: 'completed',
          transaction_hash: '0xabcd...ef12',
          created_at: new Date(Date.now() - 86400000).toISOString(),
          price: 750000
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleTransferAction = async (transferId, action) => {
    try {
      await api.post(`/admin/transfers/${transferId}/${action}`);
      loadTransfers();
    } catch (error) {
      console.error(`Error ${action} transfer:`, error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'error';
      case 'cancelled': return 'default';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading transfers...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Property Transfers
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>Total Transfers</Typography>
                  <Typography variant="h4">{transfers.length}</Typography>
                </Box>
                <SwapHoriz color="primary" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>Pending</Typography>
                  <Typography variant="h4">
                    {transfers.filter(t => t.status === 'pending').length}
                  </Typography>
                </Box>
                <Block color="warning" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>Completed</Typography>
                  <Typography variant="h4">
                    {transfers.filter(t => t.status === 'completed').length}
                  </Typography>
                </Box>
                <CheckCircle color="success" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>Total Value</Typography>
                  <Typography variant="h4">
                    ${transfers.reduce((sum, t) => sum + (t.price || 0), 0).toLocaleString()}
                  </Typography>
                </Box>
                <BlockchainIcon color="info" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6">Transfer History</Typography>
          <Button variant="contained" onClick={loadTransfers}>
            Refresh
          </Button>
        </Box>

        {transfers.length > 0 ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Property</TableCell>
                  <TableCell>From</TableCell>
                  <TableCell>To</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transfers.map((transfer) => (
                  <TableRow key={transfer.id}>
                    <TableCell>{transfer.id}</TableCell>
                    <TableCell>{transfer.land_title}</TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">{transfer.from_user}</Typography>
                        <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                          {transfer.from_address ? 
                            `${transfer.from_address.slice(0, 6)}...${transfer.from_address.slice(-4)}` : 
                            'N/A'
                          }
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">{transfer.to_user}</Typography>
                        <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                          {transfer.to_address ? 
                            `${transfer.to_address.slice(0, 6)}...${transfer.to_address.slice(-4)}` : 
                            'N/A'
                          }
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>${transfer.price?.toLocaleString()}</TableCell>
                    <TableCell>
                      <Chip 
                        label={transfer.status} 
                        color={getStatusColor(transfer.status)} 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell>{new Date(transfer.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => {
                          setSelectedTransfer(transfer);
                          setViewDialog(true);
                        }}
                        color="primary"
                        size="small"
                      >
                        <Visibility />
                      </IconButton>
                      {transfer.status === 'pending' && (
                        <>
                          <IconButton
                            onClick={() => handleTransferAction(transfer.id, 'approve')}
                            color="success"
                            size="small"
                          >
                            <CheckCircle />
                          </IconButton>
                          <IconButton
                            onClick={() => handleTransferAction(transfer.id, 'reject')}
                            color="error"
                            size="small"
                          >
                            <Cancel />
                          </IconButton>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Alert severity="info">No transfers found</Alert>
        )}
      </Paper>

      {/* View Dialog */}
      <Dialog open={viewDialog} onClose={() => setViewDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Transfer Details</DialogTitle>
        <DialogContent>
          {selectedTransfer && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>{selectedTransfer.land_title}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Transfer ID</Typography>
                <Typography>{selectedTransfer.id}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Property ID</Typography>
                <Typography>{selectedTransfer.land_id}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">From User</Typography>
                <Typography>{selectedTransfer.from_user}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">To User</Typography>
                <Typography>{selectedTransfer.to_user}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">From Address</Typography>
                <Typography sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
                  {selectedTransfer.from_address || 'Not available'}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">To Address</Typography>
                <Typography sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
                  {selectedTransfer.to_address || 'Not available'}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Transfer Price</Typography>
                <Typography>${selectedTransfer.price?.toLocaleString()}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Status</Typography>
                <Chip 
                  label={selectedTransfer.status} 
                  color={getStatusColor(selectedTransfer.status)} 
                  size="small" 
                />
              </Grid>
              {selectedTransfer.transaction_hash && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Transaction Hash</Typography>
                  <Typography sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
                    {selectedTransfer.transaction_hash}
                  </Typography>
                </Grid>
              )}
              <Grid item xs={12}>
                <Typography variant="subtitle2">Created Date</Typography>
                <Typography>{new Date(selectedTransfer.created_at).toLocaleString()}</Typography>
              </Grid>
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

export default AdminTransfers;