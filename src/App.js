import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Box, CircularProgress } from '@mui/material';

// Import pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import LandList from './pages/LandList';
import LandDetails from './pages/LandDetails';
import RegisterLand from './pages/RegisterLand';
import MapView from './pages/MapView';
import Profile from './pages/Profile';
import Transfers from './pages/Transfers';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminLands from './pages/AdminLands';
import AdminTransfers from './pages/AdminTransfers';
import AdminReports from './pages/AdminReports';

// Import components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

function App() {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className="App">
      {isAuthenticated() && <Navbar />}
      
      <Routes>
        {/* Public routes */}
        <Route 
          path="/login" 
          element={
            isAuthenticated() ? <Navigate to="/dashboard" replace /> : <Login />
          } 
        />
        
        {/* Protected routes */}
        <Route path="/" element={<ProtectedRoute />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="lands" element={<LandList />} />
          <Route path="lands/:id" element={<LandDetails />} />
          <Route path="register-land" element={<RegisterLand />} />
          <Route path="transfers" element={<Transfers />} />
          <Route path="map" element={<MapView />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Admin routes */}
        <Route path="/admin" element={<AdminRoute />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="lands" element={<AdminLands />} />
          <Route path="transfers" element={<AdminTransfers />} />
          <Route path="reports" element={<AdminReports />} />
        </Route>

        {/* Catch all route */}
        <Route 
          path="*" 
          element={
            <Navigate to={isAuthenticated() ? "/dashboard" : "/login"} replace />
          } 
        />
      </Routes>
    </div>
  );
}

export default App;