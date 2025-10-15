import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Paper, Box, Grid, Card, CardContent,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, Button, IconButton, Tabs, Tab, Alert, LinearProgress,
  Dialog, DialogTitle, DialogContent, DialogActions, Avatar,
  List, ListItem, ListItemText, ListItemAvatar, Divider,
  TextField, InputAdornment, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import {
  Send as SendIcon, CallReceived as ReceiveIcon, History as HistoryIcon,
  CheckCircle as CheckIcon, Cancel as CancelIcon, Error as ErrorIcon,
  Pending as PendingIcon, AccountBalance as BlockchainIcon,
  Search as SearchIcon, FilterList as FilterIcon,
  TrendingUp as TrendingUpIcon, AttachMoney as MoneyIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const TabPanel = ({ children, value, index }) => (
  <div hidden={value !== index}>
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

export const Transfers = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [transfers, setTransfers] = useState({
    sent: [],
    received: [],
    all: []
  });
  const [filteredTransfers, setFilteredTransfers] = useState([]);
  const [selectedTransfer, setSelectedTransfer] = useState(null);
  const [detailDialog, setDetailDialog] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    dateRange: ''
  });
  const [statistics, setStatistics] = useState({
    totalTransfers: 0,
    totalValue: 0,
    pendingTransfers: 0,
    completedTransfers: 0
  });

  useEffect(() => {
    loadTransfers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [transfers, activeTab, filters]);

  const loadTransfers = async () => {
    try {
      setLoading(true);
      
      const [sentRes, receivedRes, allRes] = await Promise.all([
        api.get('/lands/transfers', { params: { type: 'sent' } }),
        api.get('/lands/transfers', { params: { type: 'received' } }),
        api.get('/lands/transfers', { params: { type: 'all' } })
      ]);

      const transferData = {
        sent: sentRes.data.transfers || [],
        received: receivedRes.data.transfers || [],
        all: allRes.data.transfers || []
      };

      setTransfers(transferData);
      calculateStatistics(transferData);
    } catch (error) {
      console.error('Error loading transfers:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStatistics = (transferData) => {
    const allTransfers = transferData.all;
    const totalValue = allTransfers
      .filter(t => t.status === 'completed')
      .reduce((sum, t) => sum + (t.price || 0), 0);

    setStatistics({
      totalTransfers: allTransfers.length,
      totalValue: totalValue,
      pendingTransfers: allTransfers.filter(t => t.status === 'pending').length,
      completedTransfers: allTransfers.filter(t => t.status === 'completed').length
    });
  };

  const applyFilters = () => {
    let dataToFilter = [];
    
    switch (activeTab) {
      case 0: // Sent
        dataToFilter = transfers.sent;
        break;
      case 1: // Received
        dataToFilter = transfers.received;
        break;
      case 2: // All
        dataToFilter = transfers.all;
        break;
      default:
        dataToFilter = transfers.all;
    }

    let filtered = [...dataToFilter];

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(transfer =>
        transfer.land?.title?.toLowerCase().includes(filters.search.toLowerCase()) ||
        transfer.land?.property_id?.toLowerCase().includes(filters.search.toLowerCase()) ||
        transfer.from_user?.username?.toLowerCase().includes(filters.search.toLowerCase()) ||
        transfer.to_user?.username?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter(transfer => transfer.status === filters.status);
    }

    setFilteredTransfers(filtered);
  };

  const handleExecuteTransfer = async (transfer) => {
    try {
      setLoading(true);
      await api.post(`/lands/${transfer.land_id}/transfer/${transfer.id}/execute`);
      loadTransfers();
    } catch (error) {
      console.error('Error executing transfer:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelTransfer = async (transfer) => {
    try {
      setLoading(true);
      await api.post(`/lands/${transfer.land_id}/transfer/${transfer.id}/cancel`);
      loadTransfers();
    } catch (error) {
      console.error('Error cancelling transfer:', error);
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount || 0);
  };

  const StatCard = ({ title, value, icon, color = 'primary' }) => (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="textSecondary" gutterBottom>{title}</Typography>
            <Typography variant="h4" component="div">{value}</Typography>
          </Box>
          <Box sx={{ color: `${color}.main` }}>{icon}</Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Land Transfers
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Transfers"
            value={statistics.totalTransfers}
            icon={<TrendingUpIcon />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Value"
            value={formatCurrency(statistics.totalValue)}
            icon={<MoneyIcon />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending"
            value={statistics.pendingTransfers}
            icon={<PendingIcon />}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Completed"
            value={statistics.completedTransfers}
            icon={<CheckIcon />}
            color="success"
          />
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          <FilterIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Filters
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Search"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
              placeholder="Search by land title, property ID, or username"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.status}
                label="Status"
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              >
                <MenuItem value="">All Statuses</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="processing">Processing</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="failed">Failed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              variant="outlined"
              onClick={() => setFilters({ search: '', status: '', dateRange: '' })}
              fullWidth
            >
              Clear Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Transfer Tabs */}
      <Paper>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab
            label={`Sent (${transfers.sent.length})`}
            icon={<SendIcon />}
            iconPosition="start"
          />
          <Tab
            label={`Received (${transfers.received.length})`}
            icon={<ReceiveIcon />}
            iconPosition="start"
          />
          {user?.role === 'admin' && (
            <Tab
              label={`All Transfers (${transfers.all.length})`}
              icon={<HistoryIcon />}
              iconPosition="start"
            />
          )}
        </Tabs>

        {loading ? (
          <LinearProgress />
        ) : (
          <>
            {/* Sent Transfers */}
            <TabPanel value={activeTab} index={0}>
              <Typography variant="h6" gutterBottom>
                Transfers You Initiated
              </Typography>
              {filteredTransfers.length > 0 ? (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Land</TableCell>
                        <TableCell>Recipient</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredTransfers.map((transfer) => (
                        <TableRow key={transfer.id}>
                          <TableCell>
                            <Box>
                              <Typography variant="body2" fontWeight="bold">
                                {transfer.land?.title}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {transfer.land?.property_id}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box display="flex" alignItems="center">
                              <Avatar sx={{ mr: 1, width: 32, height: 32 }}>
                                {transfer.to_user?.username?.charAt(0).toUpperCase()}
                              </Avatar>
                              {transfer.to_user?.username}
                            </Box>
                          </TableCell>
                          <TableCell>{formatCurrency(transfer.price)}</TableCell>
                          <TableCell>
                            <Chip
                              label={transfer.status}
                              color={getStatusColor(transfer.status)}
                              size="small"
                              icon={getStatusIcon(transfer.status)}
                            />
                          </TableCell>
                          <TableCell>
                            {new Date(transfer.initiated_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Box>
                              <Button
                                size="small"
                                onClick={() => {
                                  setSelectedTransfer(transfer);
                                  setDetailDialog(true);
                                }}
                              >
                                Details
                              </Button>
                              {transfer.status === 'pending' && (
                                <>
                                  <Button
                                    size="small"
                                    color="primary"
                                    onClick={() => handleExecuteTransfer(transfer)}
                                    sx={{ ml: 1 }}
                                  >
                                    Execute
                                  </Button>
                                  <Button
                                    size="small"
                                    color="error"
                                    onClick={() => handleCancelTransfer(transfer)}
                                    sx={{ ml: 1 }}
                                  >
                                    Cancel
                                  </Button>
                                </>
                              )}
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Alert severity="info">No sent transfers found.</Alert>
              )}
            </TabPanel>

            {/* Received Transfers */}
            <TabPanel value={activeTab} index={1}>
              <Typography variant="h6" gutterBottom>
                Transfers You Received
              </Typography>
              {filteredTransfers.length > 0 ? (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Land</TableCell>
                        <TableCell>From</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredTransfers.map((transfer) => (
                        <TableRow key={transfer.id}>
                          <TableCell>
                            <Box>
                              <Typography variant="body2" fontWeight="bold">
                                {transfer.land?.title}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {transfer.land?.property_id}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box display="flex" alignItems="center">
                              <Avatar sx={{ mr: 1, width: 32, height: 32 }}>
                                {transfer.from_user?.username?.charAt(0).toUpperCase()}
                              </Avatar>
                              {transfer.from_user?.username}
                            </Box>
                          </TableCell>
                          <TableCell>{formatCurrency(transfer.price)}</TableCell>
                          <TableCell>
                            <Chip
                              label={transfer.status}
                              color={getStatusColor(transfer.status)}
                              size="small"
                              icon={getStatusIcon(transfer.status)}
                            />
                          </TableCell>
                          <TableCell>
                            {new Date(transfer.initiated_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Button
                              size="small"
                              onClick={() => {
                                setSelectedTransfer(transfer);
                                setDetailDialog(true);
                              }}
                            >
                              Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Alert severity="info">No received transfers found.</Alert>
              )}
            </TabPanel>

            {/* All Transfers (Admin only) */}
            {user?.role === 'admin' && (
              <TabPanel value={activeTab} index={2}>
                <Typography variant="h6" gutterBottom>
                  All System Transfers
                </Typography>
                {filteredTransfers.length > 0 ? (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Land</TableCell>
                          <TableCell>From</TableCell>
                          <TableCell>To</TableCell>
                          <TableCell>Price</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Date</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredTransfers.map((transfer) => (
                          <TableRow key={transfer.id}>
                            <TableCell>
                              <Box>
                                <Typography variant="body2" fontWeight="bold">
                                  {transfer.land?.title}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {transfer.land?.property_id}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>{transfer.from_user?.username}</TableCell>
                            <TableCell>{transfer.to_user?.username}</TableCell>
                            <TableCell>{formatCurrency(transfer.price)}</TableCell>
                            <TableCell>
                              <Chip
                                label={transfer.status}
                                color={getStatusColor(transfer.status)}
                                size="small"
                                icon={getStatusIcon(transfer.status)}
                              />
                            </TableCell>
                            <TableCell>
                              {new Date(transfer.initiated_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <Button
                                size="small"
                                onClick={() => {
                                  setSelectedTransfer(transfer);
                                  setDetailDialog(true);
                                }}
                              >
                                Details
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Alert severity="info">No transfers found.</Alert>
                )}
              </TabPanel>
            )}
          </>
        )}
      </Paper>

      {/* Transfer Detail Dialog */}
      <Dialog open={detailDialog} onClose={() => setDetailDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Transfer Details</DialogTitle>
        <DialogContent>
          {selectedTransfer && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Land Information</Typography>
                <List>
                  <ListItem>
                    <ListItemText primary="Title" secondary={selectedTransfer.land?.title} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Property ID" secondary={selectedTransfer.land?.property_id} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Location" secondary={selectedTransfer.land?.location} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Area" secondary={`${selectedTransfer.land?.area} sq m`} />
                  </ListItem>
                  {selectedTransfer.land?.token_id && (
                    <ListItem>
                      <ListItemText 
                        primary="Blockchain Token ID" 
                        secondary={selectedTransfer.land.token_id} 
                      />
                    </ListItem>
                  )}
                </List>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Transfer Information</Typography>
                <List>
                  <ListItem>
                    <ListItemText primary="From" secondary={selectedTransfer.from_user?.username} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="To" secondary={selectedTransfer.to_user?.username} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Price" secondary={formatCurrency(selectedTransfer.price)} />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Status" 
                      secondary={
                        <Chip
                          label={selectedTransfer.status}
                          color={getStatusColor(selectedTransfer.status)}
                          size="small"
                        />
                      } 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Initiated" 
                      secondary={new Date(selectedTransfer.initiated_at).toLocaleString()} 
                    />
                  </ListItem>
                  {selectedTransfer.completed_at && (
                    <ListItem>
                      <ListItemText 
                        primary="Completed" 
                        secondary={new Date(selectedTransfer.completed_at).toLocaleString()} 
                      />
                    </ListItem>
                  )}
                  {selectedTransfer.blockchain_tx_hash && (
                    <ListItem>
                      <ListItemText 
                        primary="Blockchain Transaction" 
                        secondary={
                          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                            {selectedTransfer.blockchain_tx_hash}
                          </Typography>
                        } 
                      />
                    </ListItem>
                  )}
                </List>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Transfers;