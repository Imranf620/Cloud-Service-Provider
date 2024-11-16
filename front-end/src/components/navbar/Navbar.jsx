import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Avatar,
  Tooltip,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { Brightness4, Brightness7, CloudUpload } from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

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
    setOpenDialog(true);
  };

  const handleConfirmUpload = () => {
    if (selectedFile) {
      toast.success(`Uploading ${selectedFile.name}`);
    }
    setOpenDialog(false);
  };

  const handleCancelUpload = () => {
    setSelectedFile(null);
    setOpenDialog(false);
  };

  const menuStyle = {
    backgroundColor: isDarkMode ? "#424242" : "#9C27B0",
    color: isDarkMode ? "#ffffff" : "#ffffff",
  };

  const menuItemStyle = {
    "&:hover": {
      backgroundColor: isDarkMode ? "#616161" : "#e0e0e0",
    },
  };

  return (
    <AppBar position="sticky" color="secondary">
      <Toolbar className="flex justify-between items-center">
        <Typography variant="h6">Storify</Typography>

        <div className="flex items-center gap-4">
          <Tooltip title="Upload File">
            <Button
              variant="contained"
              color="secondary"
              startIcon={<CloudUpload />}
              component="label"
            >
              Upload
              <input type="file" hidden onChange={handleFileChange} />
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
            PaperProps={{
              style: menuStyle,
            }}
          >
            <Link to="/profile">
            <MenuItem onClick={handleMenuClose} sx={menuItemStyle}>
              Profile
            </MenuItem>
            </Link>
            <Link to="/packages">
            <MenuItem onClick={handleMenuClose} sx={menuItemStyle}>
              Subscriptions
            </MenuItem>
            </Link>
            <MenuItem onClick={handleMenuClose} sx={menuItemStyle}>
              Settings
            </MenuItem>
            <MenuItem onClick={handleMenuClose} sx={menuItemStyle}>
              Logout
            </MenuItem>
          </Menu>

          <Tooltip
            className="flex items-center"
            title={isDarkMode ? "Light Mode" : "Dark Mode"}
          >
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
            Are you sure you want to upload the file{" "}
            <strong>{selectedFile?.name}</strong>?
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
