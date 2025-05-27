import styles from "./page.module.css";
import { Grid, Paper, Typography } from '@mui/material';

export default function Home() {
  return (
      <Grid container spacing={3}>
      {/* Chart */}
      <Grid item  xs={12} md={8} lg={9}>
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            height: 240,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Overview
          </Typography>
        </Paper>
      </Grid>
      {/* Recent Deposits */}
      <Grid item xs={12} md={4} lg={3}>
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            height: 240,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Quick Stats
          </Typography>
        </Paper>
      </Grid>
      {/* Recent Orders */}
      <Grid item xs={12}>
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h6" gutterBottom>
            Recent Activity
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
}
