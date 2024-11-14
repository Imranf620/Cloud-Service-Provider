import React from "react";
import CircularProgressWithLabel from "../../components/circularProgress/CircularProgress";
import Cards from "../../components/cards/Cards";
import RecentFiles from "../../components/recentFiles/RecentFiles";
import { Box, Grid, Paper, Typography } from "@mui/material";

const Dashboard = () => {
  return (
    <div className="flex gap-4">
      <section className="md:w-2/3 w-full">
      <Box >
      {/* Storage Info Box */}
      <Paper sx={{ padding: 4, borderRadius: 2, boxShadow: 3 }}>
        <Grid container spacing={4} alignItems="center">
          {/* Circular Progress */}
          <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgressWithLabel value={50} />
          </Grid>

          {/* Storage Details */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
              Available Storage
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>
              82GB / 128GB
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
        <div className="mt-8">
          <Cards/>
        </div>
      </section>
      <section className="w-1/3   rounded-lg md:block hidden">
      <RecentFiles/>
      </section>
    </div>
  );
};

export default Dashboard;
