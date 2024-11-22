import React, { useContext, useState } from "react";
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
  LinearProgress,
  CircularProgress,
} from "@mui/material";
import { Brightness4, Brightness7, CloudUpload } from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import { toast } from "react-toastify";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/userSlice";
import { uploadFile } from "../../features/filesSlice";
import { reFetchContext } from "../../context/ReFetchContext";

const Navbar = ({ toggleDarkMode, isDarkMode, handleToggle }) => {
  const { loading } = useSelector((state) => state.auth);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation(); 
  const {handleRefetch} = useContext(reFetchContext)

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
    setMenuOpen(true);
  };

  const handleMenuClose = () => {
    setMenuOpen(false);
  };

  const handleLogout = async () => {
    setMenuOpen(false);
    try {
      const result = await dispatch(logout());
      toast.success(result.payload.message);
    } catch (error) {
      toast.error(result.payload.message);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setOpenDialog(true);
  };

  const handleConfirmUpload = async () => {
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const result = await dispatch(
        uploadFile(formData, {
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );
            setUploadProgress(progress);
          },
        })
      );

      if (result.payload?.success) {
        toast.success(result.payload.message);
        handleRefetch()
      }else{
        toast.error(result.payload.message);
      }
    } catch (error) {
      toast.error(error.message);
    }

    setUploadProgress(0); // Reset progress
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

  // Close the menu when the user navigates to a new route
  React.useEffect(() => {
    setMenuOpen(false); // Close menu on route change
  }, [location]);

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
              disabled={loading} // Disable button during upload
            >
              Upload
              <input type="file" hidden onChange={handleFileChange} />
            </Button>
          </Tooltip>

          {/* Loader/Progress Bar */}
          {loading && (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <CircularProgress size={20} />
              {uploadProgress > 0 && (
                <LinearProgress
                  variant="determinate"
                  value={uploadProgress}
                  style={{ width: "100px" }}
                />
              )}
            </div>
          )}

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
            <MenuItem onClick={handleLogout} sx={menuItemStyle}>
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
