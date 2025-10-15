import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Paper, Box, Grid, Card, CardContent,
  Button, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Chip, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, MenuItem, Alert, CircularProgress,
  Tabs, Tab, Divider
} from '@mui/material';
import {
  Dashboard as DashboardIcon, People as PeopleIcon,
  Landscape as LandIcon, AccountBalance as BlockchainIcon,
  CheckCircle, Cancel, Visibility, Edit, Delete,
  TrendingUp, Warning, Assessment
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stats: { total_lands: 0, pending_lands: 0, verified_lands: 0, blockchain_lands: 0 },
    pendingLands: [],
    recentUsers: [],
    blockchainStatus: { connected: false, network: '', balance: '0' }
  });
  const [selectedLand, setSelectedLand] = useState(null);
  const [reviewDialog, setReviewDialog] = useState(false);
  const [reviewData, setReviewData] = useState({ action: 'approve', comments: '' });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, landsRes, usersRes, blockchainRes] = await Promise.all([
        api.get('/lands/statistics').catch(() => ({ data: { total_lands: 0, pending_lands: 0, verified_lands: 0, blockchain_lands: 0 } })),
        api.get('/admin/lands/pending').catch(() => ({ data: { lands: [] } })),
        api.get('/admin/users').catch(() => ({ data: { users: [] } })),
        api.get('/admin/blockchain/status').catch(() => ({ data: { connected: false, network: 'Polygon Amoy', balance: '0' } }))
      ]);

      setDashboardData({
        stats: statsRes.data,
        pendingLands: landsRes.data.lands || [],
        recentUsers: usersRes.data.users?.slice(0, 5) || [],
        blockchainStatus: blockchainRes.data
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewLand = async () => {
    try {
      await api.post(`/admin/lands/${selectedLand.id}/review`, reviewData);
      setReviewDialog(false);
      setSelectedLand(null);
      setReviewData({ action: 'approve', comments: '' });
      loadDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error reviewing land:', error);
    }
  };

  const handleRegisterOnBlockchain = async (landId) => {
    try {
      await api.post(`/admin/lands/${landId}/register-blockchain`);
      loadDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error registering on blockchain:', error);
    }
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

  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading dashboard...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Properties"
            value={dashboardData.stats.total_lands}
            icon={<LandIcon />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending Approval"
            value={dashboardData.stats.pending_lands}
            icon={<Warning />}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Verified Properties"
            value={dashboardData.stats.verified_lands}
            icon={<CheckCircle />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="On Blockchain"
            value={dashboardData.stats.blockchain_lands}
            icon={<BlockchainIcon />}
            color="info"
          />
        </Grid>
      </Grid>

      {/* Blockchain Status */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>Blockchain Status</Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <Chip
            label={dashboardData.blockchainStatus.connected ? 'Connected' : 'Disconnected'}
            color={dashboardData.blockchainStatus.connected ? 'success' : 'error'}
            icon={<BlockchainIcon />}
          />
          <Typography>Network: {dashboardData.blockchainStatus.network || 'Polygon Amoy'}</Typography>
          <Typography>Balance: {dashboardData.blockchainStatus.balance || '0'} MATIC</Typography>
        </Box>
      </Paper>

      {/* Tabs */}
      <Paper sx={{ mb: 4 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Pending Properties" />
          <Tab label="All Properties" />
          <Tab label="Users" />
          <Tab label="Blockchain Tools" />
        </Tabs>

        {/* Pending Properties Tab */}
        <TabPanel value={activeTab} index={0}>
          <Typography variant="h6" gutterBottom>Properties Awaiting Approval</Typography>
          {dashboardData.pendingLands.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Owner</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Area</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dashboardData.pendingLands.map((land) => (
                    <TableRow key={land.id}>
                      <TableCell>{land.title}</TableCell>
                      <TableCell>{land.owner_name}</TableCell>
                      <TableCell>{land.location}</TableCell>
                      <TableCell>{land.property_type}</TableCell>
                      <TableCell>{land.area} sq ft</TableCell>
                      <TableCell>${land.price?.toLocaleString()}</TableCell>
                      <TableCell>
                        <Chip label={land.status} color="warning" size="small" />
                      </TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => {
                            setSelectedLand(land);
                            setReviewDialog(true);
                          }}
                          color="primary"
                        >
                          <Assessment />
                        </IconButton>
                        <IconButton
                          onClick={() => handleRegisterOnBlockchain(land.id)}
                          color="info"
                          disabled={land.status !== 'verified'}
                        >
                          <BlockchainIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Alert severity="info">No properties pending approval</Alert>
          )}
        </TabPanel>

        {/* All Properties Tab */}
        <TabPanel value={activeTab} index={1}>
          <Typography variant="h6" gutterBottom>All Properties</Typography>
          <Alert severity="info">
            All properties view - Feature coming soon
          </Alert>
        </TabPanel>

        {/* Users Tab */}
        <TabPanel value={activeTab} index={2}>
          <Typography variant="h6" gutterBottom>Recent Users</Typography>
          {dashboardData.recentUsers.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Wallet</TableCell>
                    <TableCell>Joined</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dashboardData.recentUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.first_name} {user.last_name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Chip 
                          label={user.role} 
                          color={user.role === 'admin' ? 'primary' : 'default'} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                          {user.wallet_address ? `${user.wallet_address.slice(0, 6)}...${user.wallet_address.slice(-4)}` : 'Not connected'}
                        </Typography>
                      </TableCell>
                      <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Alert severity="info">No users found</Alert>
          )}
        </TabPanel>

        {/* Blockchain Tools Tab */}
        <TabPanel value={activeTab} index={3}>
          <Typography variant="h6" gutterBottom>Blockchain Management Tools</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Contract Information</Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', mb: 2 }}>
                    Address: 0x2267014b6C2471fbb7358382Cbb85F3Ea6E9477E
                  </Typography>
                  <Typography variant="body2">Network: Polygon Amoy Testnet</Typography>
                  <Typography variant="body2">Chain ID: 80002</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Quick Actions</Typography>
                  <Button variant="outlined" fullWidth sx={{ mb: 1 }}>
                    Sync Blockchain Data
                  </Button>
                  <Button variant="outlined" fullWidth sx={{ mb: 1 }}>
                    Check Network Status
                  </Button>
                  <Button variant="outlined" fullWidth>
                    Export Reports
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>

      {/* Review Dialog */}
      <Dialog open={reviewDialog} onClose={() => setReviewDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Review Property: {selectedLand?.title}</DialogTitle>
        <DialogContent>
          {selectedLand && (
            <Box>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2">Owner</Typography>
                  <Typography>{selectedLand.owner_name}</Typography>
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
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Description</Typography>
                  <Typography>{selectedLand.description}</Typography>
                </Grid>
              </Grid>
              
              <Divider sx={{ my: 2 }} />
              
              <TextField
                select
                fullWidth
                label="Action"
                value={reviewData.action}
                onChange={(e) => setReviewData({ ...reviewData, action: e.target.value })}
                sx={{ mb: 2 }}
              >
                <MenuItem value="approve">Approve</MenuItem>
                <MenuItem value="reject">Reject</MenuItem>
                <MenuItem value="request_changes">Request Changes</MenuItem>
              </TextField>
              
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Comments"
                value={reviewData.comments}
                onChange={(e) => setReviewData({ ...reviewData, comments: e.target.value })}
                placeholder="Add your comments here..."
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReviewDialog(false)}>Cancel</Button>
          <Button onClick={handleReviewLand} variant="contained">
            Submit Review
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminDashboard;