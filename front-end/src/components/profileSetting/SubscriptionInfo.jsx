import React from 'react';
import { Box, Typography } from '@mui/material';

const SubscriptionInfo = () => {
  return (
    <Box textAlign="center" mb={3}>
      <Typography variant="h6">Subscription Plan: Premium</Typography>
      <Typography variant="body1">Expires on: 2025-12-31</Typography>
    </Box>
  );
};

export default SubscriptionInfo;
