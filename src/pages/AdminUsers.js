import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Paper, Box, Grid, Card, CardContent,
  Button, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Chip, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Alert, CircularProgress
} from '@mui/material';
import {
  Visibility, Edit, Block, CheckCircle, AccountCircle
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export const AdminUsers = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewDialog, setViewDialog] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/users');
      setUsers(response.data.users || []);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserStatusChange = async (userId, newStatus) => {
    try {
      await api.post(`/admin/users/${userId}/status`, { status: newStatus });
      loadUsers();
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading users...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        User Management
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6">All Users ({users.length})</Typography>
          <Button variant="contained" onClick={loadUsers}>
            Refresh
          </Button>
        </Box>

        {users.length > 0 ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Wallet Address</TableCell>
                  <TableCell>Properties</TableCell>
                  <TableCell>Joined</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((userData) => (
                  <TableRow key={userData.id}>
                    <TableCell>{userData.id}</TableCell>
                    <TableCell>{userData.first_name} {userData.last_name}</TableCell>
                    <TableCell>{userData.email}</TableCell>
                    <TableCell>
                      <Chip 
                        label={userData.role} 
                        color={userData.role === 'admin' ? 'primary' : 'default'} 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        {userData.wallet_address ? 
                          `${userData.wallet_address.slice(0, 6)}...${userData.wallet_address.slice(-4)}` : 
                          'Not connected'
                        }
                      </Typography>
                    </TableCell>
                    <TableCell>{userData.land_count || 0}</TableCell>
                    <TableCell>{new Date(userData.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => {
                          setSelectedUser(userData);
                          setViewDialog(true);
                        }}
                        color="primary"
                        size="small"
                      >
                        <Visibility />
                      </IconButton>
                      {userData.role !== 'admin' && (
                        <IconButton
                          onClick={() => handleUserStatusChange(userData.id, 'blocked')}
                          color="error"
                          size="small"
                        >
                          <Block />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Alert severity="info">No users found</Alert>
        )}
      </Paper>

      {/* View Dialog */}
      <Dialog open={viewDialog} onClose={() => setViewDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>User Details</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Full Name</Typography>
                <Typography>{selectedUser.first_name} {selectedUser.last_name}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Email</Typography>
                <Typography>{selectedUser.email}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Role</Typography>
                <Typography>{selectedUser.role}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Phone</Typography>
                <Typography>{selectedUser.phone || 'Not provided'}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2">Address</Typography>
                <Typography>{selectedUser.address || 'Not provided'}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2">Wallet Address</Typography>
                <Typography sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
                  {selectedUser.wallet_address || 'Not connected'}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Properties Owned</Typography>
                <Typography>{selectedUser.land_count || 0}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Member Since</Typography>
                <Typography>{new Date(selectedUser.created_at).toLocaleDateString()}</Typography>
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

export default AdminUsers;