import React, { useState } from 'react';
import { Box, Avatar, Button } from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';

const ProfileImage = () => {
  const [image, setImage] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  return (
    <Box textAlign="center" mb={3}>
      <Avatar
        src={image}
        alt="Profile Image"
        sx={{ width: 100, height: 100, margin: 'auto' }}
      />
      <Button
        variant="contained"
        component="label"
        startIcon={<PhotoCamera />}
        sx={{ mt: 2 }}
      >
        Upload Image
        <input
          hidden
          accept="image/*"
          type="file"
          onChange={handleImageUpload}
        />
      </Button>
    </Box>
  );
};

export default ProfileImage;
