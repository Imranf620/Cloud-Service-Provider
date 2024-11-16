import React from 'react';
import { Box, Typography, Divider } from '@mui/material';
import ProfileImage from './ProfileImage';
import UserDetails from './UserDetails';
import SubscriptionInfo from './SubscriptionInfo';
import DataUsageGraph from './DataUsageGraph';
import { useTheme } from '../../context/ThemeContext';

const ProfileSetting = () => {
  const { isDarkMode } = useTheme();

  return (
    <Box
      sx={{
        maxWidth: 600,
        margin: 'auto',
        padding: 3,
        backgroundColor: isDarkMode ? '#333' : '#f5f5f5',
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Typography variant="h4" textAlign="center" mb={3}>
        Profile Settings
      </Typography>
      <Divider sx={{ mb: 3 }} />
      <ProfileImage />
      <Divider sx={{ mb: 3 }} />
      <UserDetails />
      <Divider sx={{ mb: 3 }} />
      <SubscriptionInfo />
      <Divider sx={{ mb: 3 }} />
      <DataUsageGraph />
    </Box>
  );
};

export default ProfileSetting;
