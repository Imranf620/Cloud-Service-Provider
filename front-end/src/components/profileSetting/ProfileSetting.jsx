import React, { useState } from 'react';
import { Box, Typography, Divider, CircularProgress, Button } from '@mui/material';
import ProfileImage from './ProfileImage';
import UserDetails from './UserDetails';
import SubscriptionInfo from './SubscriptionInfo';
import DataUsageGraph from './DataUsageGraph';
import { useTheme } from '../../context/ThemeContext';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../../features/userSlice';
import { toast } from 'react-toastify';

const ProfileSetting = () => {
  const { isDarkMode } = useTheme();
  const { user, loading, error } = useSelector(state => state.auth);

  const [image, setImage] = useState(null);
  const [username, setUsername] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  const dispatch = useDispatch();

  const handleImageChange = (newImage) => {
    setImage(newImage);
    console.log(`Image ${newImage}`)
  };

  const handleUpdateProfile = async () => {
    const formData = new FormData();
    formData.append('name', username);
    formData.append('email', email);
    
    // Append the image file if it exists
    if (image) {
      formData.append('file', image);
    }
    console.log("image is ",image);

    const result = await dispatch(updateProfile(formData));
    if (result.payload?.success) {
      toast.success(result.payload.message);
      
    }
  };

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
      <ProfileImage onImageChange={handleImageChange} />
      <Divider sx={{ mb: 3 }} />
      <UserDetails
        username={username}
        email={email}
        setUsername={setUsername}
        setEmail={setEmail}
      />
       {loading ? (
          <CircularProgress />
        ) : (
          <Button variant="contained" color="primary" onClick={handleUpdateProfile}>
            Update Profile
          </Button>
        )}
        {error && <Typography color="error">{error?.message}</Typography>}
      <Divider sx={{ mb: 3 }} />
      <SubscriptionInfo />
      <Divider sx={{ mb: 3 }} />
      <DataUsageGraph />
      <Box textAlign="center" mt={3}>
       
      </Box>
    </Box>
  );
};

export default ProfileSetting;
