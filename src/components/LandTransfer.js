import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, FormControl, InputLabel,
  Select, MenuItem, Alert, Chip, IconButton, Grid, Divider,
  List, ListItem, ListItemText, ListItemSecondaryAction, Avatar,
  LinearProgress, Tooltip, Paper
} from '@mui/material';
import {
  Send as SendIcon, History as HistoryIcon, Cancel as CancelIcon,
  CheckCircle as CheckIcon, Error as ErrorIcon, Pending as PendingIcon,
  AccountBalance as BlockchainIcon, Person as PersonIcon,
  LocationOn as LocationIcon, SquareFoot as AreaIcon,
  AttachMoney as PriceIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export const LandTransfer = ({ land, onTransferComplete }) => {
  const { user } = useAuth();
  const [transferDialog, setTransferDialog] = useState(false);
  const [historyDialog, setHistoryDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transfers, setTransfers] = useState([]);
  const [transferHistory, setTransferHistory] = useState([]);
  const [transferData, setTransferData] = useState({
    to_user: '',
    price: '',
    transfer_type: 'sale'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (land?.id) {
      loadTransfers();
    }
  }, [land]);

  const loadTransfers = async () => {
    try {
      const response = await api.get('/lands/transfers', {
        params: { type: 'all' }
      });
      
      // Filter transfers for this specific land
      const landTransfers = response.data.transfers.filter(
        transfer => transfer.land_id === land.id
      );
      setTransfers(landTransfers);
    } catch (error) {
      console.error('Error loading transfers:', error);
    }
  };

  const loadTransferHistory = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/lands/${land.id}/transfer-history`);
      setTransferHistory(response.data);
    } catch (error) {
      console.error('Error loading transfer history:', error);
      setError('Failed to load transfer history');
    } finally {
      setLoading(false);
    }
  };

  const handleInitiateTransfer = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const response = await api.post(`/lands/${land.id}/transfer/initiate`, transferData);
      
      setSuccess('Transfer initiated successfully!');
      setTransferDialog(false);
      setTransferData({ to_user: '', price: '', transfer_type: 'sale' });
      loadTransfers();
      
      if (onTransferComplete) {
        onTransferComplete();
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to initiate transfer');
    } finally {
      setLoading(false);
    }
  };

  const handleExecuteTransfer = async (transferId) => {
    try {
      setLoading(true);
      setError('');

      const response = await api.post(`/lands/${land.id}/transfer/${transferId}/execute`);
      
      setSuccess('Transfer executed successfully on blockchain!');
      loadTransfers();
      
      if (onTransferComplete) {
        onTransferComplete();
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to execute transfer');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelTransfer = async (transferId) => {
    try {
      setLoading(true);
      const response = await api.post(`/lands/${land.id}/transfer/${transferId}/cancel`);
      
      setSuccess('Transfer cancelled successfully!');
      loadTransfers();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to cancel transfer');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'processing': return 'info';
      case 'failed': return 'error';
      case 'cancelled': return 'default';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckIcon />;
      case 'pending': return <PendingIcon />;
      case 'processing': return <LinearProgress />;
      case 'failed': return <ErrorIcon />;
      case 'cancelled': return <CancelIcon />;
      default: return <PendingIcon />;
    }
  };

  const canInitiateTransfer = () => {
    return land?.owner_id === user?.id && 
           land?.is_registered_on_blockchain && 
           !transfers.some(t => t.status === 'pending' || t.status === 'processing');
  };

  const pendingTransfer = transfers.find(t => t.status === 'pending');

  return (
    <Box>
      {/* Transfer Actions */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          <SendIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Land Transfer
        </Typography>

        {!land?.is_registered_on_blockchain && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            This land must be registered on blockchain before it can be transferred.
          </Alert>
        )}

        {land?.owner_id === user?.id ? (
          <Box>
            {pendingTransfer ? (
              <Alert severity="info" sx={{ mb: 2 }}>
                There is a pending transfer for this land. You can execute or cancel it below.
              </Alert>
            ) : (
              <Button
                variant="contained"
                startIcon={<SendIcon />}
                onClick={() => setTransferDialog(true)}
                disabled={!canInitiateTransfer() || loading}
                sx={{ mr: 2, mb: 2 }}
              >
                Initiate Transfer
              </Button>
            )}
          </Box>
        ) : (
          <Typography color="text.secondary">
            You can only transfer lands that you own.
          </Typography>
        )}

        <Button
          variant="outlined"
          startIcon={<HistoryIcon />}
          onClick={() => {
            setHistoryDialog(true);
            loadTransferHistory();
          }}
          sx={{ mb: 2 }}
        >
          View Transfer History
        </Button>

        {/* Active Transfers */}
        {transfers.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Active Transfers
            </Typography>
            <List>
              {transfers.map((transfer) => (
                <ListItem key={transfer.id} divider>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="body1">
                          Transfer to {transfer.to_user?.username || 'Unknown'}
                        </Typography>
                        <Chip
                          label={transfer.status}
                          color={getStatusColor(transfer.status)}
                          size="small"
                          icon={getStatusIcon(transfer.status)}
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Price: ${transfer.price?.toLocaleString() || 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Initiated: {new Date(transfer.initiated_at).toLocaleDateString()}
                        </Typography>
                        {transfer.blockchain_tx_hash && (
                          <Typography variant="body2" color="primary">
                            TX: {transfer.blockchain_tx_hash.slice(0, 10)}...
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    {transfer.status === 'pending' && transfer.from_user_id === user?.id && (
                      <Box>
                        <Tooltip title="Execute Transfer">
                          <IconButton
                            color="primary"
                            onClick={() => handleExecuteTransfer(transfer.id)}
                            disabled={loading}
                          >
                            <CheckIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Cancel Transfer">
                          <IconButton
                            color="error"
                            onClick={() => handleCancelTransfer(transfer.id)}
                            disabled={loading}
                          >
                            <CancelIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    )}
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </Paper>

      {/* Error/Success Messages */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {/* Transfer Initiation Dialog */}
      <Dialog open={transferDialog} onClose={() => setTransferDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Initiate Land Transfer</DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    <LocationIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Land Details
                  </Typography>
                  <Typography><strong>Title:</strong> {land?.title}</Typography>
                  <Typography><strong>Property ID:</strong> {land?.property_id}</Typography>
                  <Typography><strong>Location:</strong> {land?.location}</Typography>
                  <Typography><strong>Area:</strong> {land?.area} sq m</Typography>
                  <Typography><strong>Type:</strong> {land?.property_type}</Typography>
                  {land?.token_id && (
                    <Typography>
                      <BlockchainIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                      <strong>Token ID:</strong> {land.token_id}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Recipient (Username, Email, or Wallet Address)"
                value={transferData.to_user}
                onChange={(e) => setTransferData({ ...transferData, to_user: e.target.value })}
                margin="normal"
                placeholder="Enter username, email, or wallet address"
                helperText="The recipient must have a wallet address to receive blockchain assets"
              />
              
              <TextField
                fullWidth
                label="Transfer Price (USD)"
                type="number"
                value={transferData.price}
                onChange={(e) => setTransferData({ ...transferData, price: e.target.value })}
                margin="normal"
                InputProps={{
                  startAdornment: <PriceIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
                helperText="Enter 0 for gifts or inheritance"
              />
              
              <FormControl fullWidth margin="normal">
                <InputLabel>Transfer Type</InputLabel>
                <Select
                  value={transferData.transfer_type}
                  label="Transfer Type"
                  onChange={(e) => setTransferData({ ...transferData, transfer_type: e.target.value })}
                >
                  <MenuItem value="sale">Sale</MenuItem>
                  <MenuItem value="gift">Gift</MenuItem>
                  <MenuItem value="inheritance">Inheritance</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTransferDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleInitiateTransfer}
            disabled={!transferData.to_user || loading}
          >
            {loading ? 'Initiating...' : 'Initiate Transfer'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Transfer History Dialog */}
      <Dialog open={historyDialog} onClose={() => setHistoryDialog(false)} maxWidth="lg" fullWidth>
        <DialogTitle>
          <HistoryIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Transfer History
        </DialogTitle>
        <DialogContent>
          {loading ? (
            <LinearProgress />
          ) : (
            <Box>
              {/* Database Transfers */}
              {transferHistory.database_transfers?.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Database Records
                  </Typography>
                  <List>
                    {transferHistory.database_transfers.map((transfer) => (
                      <ListItem key={transfer.id} divider>
                        <Avatar sx={{ mr: 2 }}>
                          <PersonIcon />
                        </Avatar>
                        <ListItemText
                          primary={`${transfer.from_user?.username} → ${transfer.to_user?.username}`}
                          secondary={
                            <Box>
                              <Typography variant="body2">
                                Price: ${transfer.price?.toLocaleString() || 0}
                              </Typography>
                              <Typography variant="body2">
                                Date: {new Date(transfer.initiated_at).toLocaleString()}
                              </Typography>
                              <Typography variant="body2">
                                Status: {transfer.status}
                              </Typography>
                              {transfer.blockchain_tx_hash && (
                                <Typography variant="body2" color="primary">
                                  Blockchain TX: {transfer.blockchain_tx_hash}
                                </Typography>
                              )}
                            </Box>
                          }
                        />
                        <Chip
                          label={transfer.status}
                          color={getStatusColor(transfer.status)}
                          size="small"
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}

              {/* Blockchain Transfers */}
              {transferHistory.blockchain_transfers?.length > 0 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    <BlockchainIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Blockchain Records
                  </Typography>
                  <List>
                    {transferHistory.blockchain_transfers.map((transfer, index) => (
                      <ListItem key={index} divider>
                        <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                          <BlockchainIcon />
                        </Avatar>
                        <ListItemText
                          primary={`${transfer.from?.slice(0, 10)}... → ${transfer.to?.slice(0, 10)}...`}
                          secondary={
                            <Box>
                              <Typography variant="body2">
                                Price: {transfer.price} wei
                              </Typography>
                              <Typography variant="body2">
                                Date: {new Date(transfer.transfer_date * 1000).toLocaleString()}
                              </Typography>
                              <Typography variant="body2">
                                Completed: {transfer.is_completed ? 'Yes' : 'No'}
                              </Typography>
                            </Box>
                          }
                        />
                        <Chip
                          label={transfer.is_completed ? 'Completed' : 'Pending'}
                          color={transfer.is_completed ? 'success' : 'warning'}
                          size="small"
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}

              {(!transferHistory.database_transfers?.length && !transferHistory.blockchain_transfers?.length) && (
                <Alert severity="info">
                  No transfer history found for this land.
                </Alert>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHistoryDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LandTransfer;