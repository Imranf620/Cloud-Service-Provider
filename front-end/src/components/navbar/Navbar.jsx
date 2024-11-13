import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Menu, MenuItem, Avatar, Tooltip, Button } from '@mui/material';
import {  Brightness4, Brightness7,  CloudUpload } from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';

const Navbar = ({ toggleDarkMode, isDarkMode,handleToggle }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
    setMenuOpen(true);
  };

  const handleMenuClose = () => {
    setMenuOpen(false);
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    // Handle file upload logic here
    console.log('Selected file:', event.target.files[0]);
  };

  const handleFileUpload = () => {
    if (selectedFile) {
      // Implement your file upload logic here (e.g., upload to server)
      alert(`Uploading ${selectedFile.name}`);
    } else {
      alert('No file selected!');
    }
  };

  return (
    <AppBar position="sticky" color="secondary">
      <Toolbar className="flex justify-between items-center">
        <Typography variant="h6">Storify</Typography>

        <div className="flex items-center gap-4">
          

          <Tooltip title="Upload File">
            <Button
              variant="contained"
              color="primary"
              startIcon={<CloudUpload />}
              component="label"
            >
              Upload
              <input
                type="file"
                hidden
                onChange={handleFileChange}
              />
            </Button>
          </Tooltip>

          <Tooltip title="User Profile">
            <IconButton onClick={handleMenuClick} color="inherit">
              <Avatar alt="User" src="/path-to-your-avatar.jpg" />
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={handleMenuClose}
            
          >
            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleMenuClose}>Subscriptions</MenuItem>
            <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
            <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
          </Menu>

          <Tooltip title={isDarkMode ? "Light Mode" : "Dark Mode"}>
            <IconButton onClick={toggleDarkMode} color="inherit">
              {isDarkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
            <div className='md:hidden'>

            <MenuIcon  onClick={handleToggle}/>
            </div>
          </Tooltip>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
