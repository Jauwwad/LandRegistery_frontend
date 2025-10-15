import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Paper, Box, Grid, Card, CardContent,
  Button, Alert, CircularProgress, Divider
} from '@mui/material';
import {
  TrendingUp, Assessment, Download, PieChart,
  BarChart, Timeline
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export const AdminReports = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState({
    statistics: {},
    trends: {},
    blockchain: {}
  });

  useEffect(() => {
    loadReportData();
  }, []);

  const loadReportData = async () => {
    try {
      setLoading(true);
      const [statsRes, trendsRes] = await Promise.all([
        api.get('/lands/statistics').catch(() => ({ data: {} })),
        api.get('/admin/reports/trends').catch(() => ({ data: {} }))
      ]);

      setReportData({
        statistics: statsRes.data,
        trends: trendsRes.data,
        blockchain: {
          total_registered: statsRes.data.blockchain_lands || 0,
          pending_registration: (statsRes.data.verified_lands || 0) - (statsRes.data.blockchain_lands || 0)
        }
      });
    } catch (error) {
      console.error('Error loading report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async (reportType) => {
    try {
      const response = await api.get(`/admin/reports/${reportType}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${reportType}-report-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  const ReportCard = ({ title, value, subtitle, icon, color = 'primary' }) => (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="textSecondary" gutterBottom>{title}</Typography>
            <Typography variant="h4" component="div">{value}</Typography>
            <Typography variant="body2" color="textSecondary">{subtitle}</Typography>
          </Box>
          <Box sx={{ color: `${color}.main` }}>{icon}</Box>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading reports...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Reports & Analytics
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <ReportCard
            title="Total Properties"
            value={reportData.statistics.total_lands || 0}
            subtitle="All registered properties"
            icon={<Assessment />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <ReportCard
            title="Verified Properties"
            value={reportData.statistics.verified_lands || 0}
            subtitle="Successfully verified"
            icon={<TrendingUp />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <ReportCard
            title="Blockchain Registered"
            value={reportData.blockchain.total_registered || 0}
            subtitle="On Polygon network"
            icon={<BarChart />}
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <ReportCard
            title="Pending Blockchain"
            value={reportData.blockchain.pending_registration || 0}
            subtitle="Awaiting registration"
            icon={<Timeline />}
            color="warning"
          />
        </Grid>
      </Grid>

      {/* Report Generation */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Property Reports</Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
              Generate detailed reports about property registrations and status.
            </Typography>
            
            <Box display="flex" flexDirection="column" gap={2}>
              <Button
                variant="outlined"
                startIcon={<Download />}
                onClick={() => generateReport('properties')}
                fullWidth
              >
                Export All Properties
              </Button>
              <Button
                variant="outlined"
                startIcon={<Download />}
                onClick={() => generateReport('verified-properties')}
                fullWidth
              >
                Export Verified Properties
              </Button>
              <Button
                variant="outlined"
                startIcon={<Download />}
                onClick={() => generateReport('pending-properties')}
                fullWidth
              >
                Export Pending Properties
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>User Reports</Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
              Generate reports about user registrations and activity.
            </Typography>
            
            <Box display="flex" flexDirection="column" gap={2}>
              <Button
                variant="outlined"
                startIcon={<Download />}
                onClick={() => generateReport('users')}
                fullWidth
              >
                Export All Users
              </Button>
              <Button
                variant="outlined"
                startIcon={<Download />}
                onClick={() => generateReport('user-activity')}
                fullWidth
              >
                Export User Activity
              </Button>
              <Button
                variant="outlined"
                startIcon={<Download />}
                onClick={() => generateReport('user-properties')}
                fullWidth
              >
                Export User Properties
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Blockchain Reports</Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
              Generate reports about blockchain transactions and registrations.
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  onClick={() => generateReport('blockchain-transactions')}
                  fullWidth
                >
                  Blockchain Transactions
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  onClick={() => generateReport('transfer-history')}
                  fullWidth
                >
                  Transfer History
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  onClick={() => generateReport('ownership-history')}
                  fullWidth
                >
                  Ownership History
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Alert severity="info">
          Reports are generated in CSV format and will be downloaded automatically. 
          For large datasets, report generation may take a few moments.
        </Alert>
      </Box>
    </Container>
  );
};

export default AdminReports;