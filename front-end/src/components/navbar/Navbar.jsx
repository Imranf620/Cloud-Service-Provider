import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Menu, MenuItem, Avatar, Tooltip, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { Brightness4, Brightness7, CloudUpload } from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import { toast } from 'react-toastify';

const Navbar = ({ toggleDarkMode, isDarkMode, handleToggle }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
    setMenuOpen(true);
  };

  const handleMenuClose = () => {
    setMenuOpen(false);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setOpenDialog(true); // Show confirmation dialog after file is selected
  };

  const handleConfirmUpload = () => {
    if (selectedFile) {
      toast.success(`Uploading ${selectedFile.name}`); // Replace with actual file upload logic
    }
    setOpenDialog(false); // Close the dialog
  };

  const handleCancelUpload = () => {
    setSelectedFile(null);
    setOpenDialog(false); // Close the dialog and clear selected file
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

          <Tooltip className="flex items-center" title={isDarkMode ? "Light Mode" : "Dark Mode"}>
            <IconButton onClick={toggleDarkMode} color="inherit">
              {isDarkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
            <div className="md:hidden">
              <MenuIcon onClick={handleToggle} />
            </div>
          </Tooltip>
        </div>
      </Toolbar>

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCancelUpload}>
        <DialogTitle>Confirm File Upload</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to upload the file <strong>{selectedFile?.name}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelUpload} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmUpload} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </AppBar>
  );
};

export default Navbar;
