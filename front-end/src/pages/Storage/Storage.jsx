import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Paper,
  Pagination,
  CircularProgress,
  Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button 
} from "@mui/material";
import ArticleIcon from "@mui/icons-material/Article";
import DropdownMenu from "../../components/dropdownMenu/DropdownMenu";
import { useDispatch, useSelector } from "react-redux";
import { editFileName, fetchFiles, deleteFile } from "../../features/filesSlice";  // Import the deleteFile action
import { toast } from "react-toastify";

const Storage = () => {
  const { type } = useParams();
  const [allData, setAllData] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [sortBy, setSortBy] = useState("size");
  const [orderDirection, setOrderDirection] = useState("asc");
  const [page, setPage] = useState(1);
  
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [renameFileData, setRenameFileData] = useState(null);
  const [newName, setNewName] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);  // State for delete confirmation dialog
  const [fileToDelete, setFileToDelete] = useState(null);  // File to delete

  const filesPerPage = 10;
  
  const { loading } = useSelector((state) => state.files);
  const dispatch = useDispatch();

  // Fetch Files
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dispatch(fetchFiles({ type, sortBy, orderDirection }));
        setAllData(response?.payload?.data || []);
        setFilteredFiles(response?.payload?.data || []);
      } catch (error) {
        toast.error(error.message || "Failed to fetch files");
      }
    };
    fetchData();
  }, [type, sortBy, orderDirection, dispatch]);

  // Handle Sorting Changes
  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const handleOrderDirectionChange = (event) => {
    setOrderDirection(event.target.value);
  };

  const handlePaginationChange = (event, value) => {
    setPage(value);
  };

  const paginatedFiles = filteredFiles.slice((page - 1) * filesPerPage, page * filesPerPage);

  // Action Handlers
  const handleView = (file) => {
    const fileUrl = `${import.meta.env.VITE_API_URL}/../../${file.path}`;
    window.open(fileUrl, "_blank");
  };

  const handleDownload = (file) => {
    const fileUrl = `${import.meta.env.VITE_API_URL}/../../${file.path}`;
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`${file.name} downloaded successfully`);
  };

  const handleShare = (file) => {
    const shareUrl = `${import.meta.env.VITE_API_URL}/../../${file.path}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success("File link copied to clipboard!");
  };

  const handleOpenRenameModal = (file) => {
    setRenameFileData(file);
    setNewName(file.name);
    setRenameModalOpen(true);
  };

  const handleCloseRenameModal = () => {
    setRenameModalOpen(false);
    setRenameFileData(null);
    setNewName("");
  };

  const handleRenameFile = async () => {
    if (!newName.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    try {
      const response = await dispatch(editFileName({ fileId: renameFileData.id, newName }));
      if (response.payload?.success) {
        toast.success("File renamed successfully");
        handleCloseRenameModal();
      } else {
        toast.error(response.payload.message);
      }
    } catch (error) {
      toast.error(error.message || "Failed to rename file");
    }
  };

  const handleDeleteFile = async () => {
    if (!fileToDelete) return;
    const fileId = fileToDelete.id;
  
    try {
      const response = await dispatch(deleteFile(fileId));
      if (response.payload?.success) {
        toast.success("File deleted successfully");
        setDeleteModalOpen(false);
        setFileToDelete(null);
        
        // Filter out the deleted file from the filteredFiles array
        setFilteredFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId));
      } else {
        toast.error(response.payload.message);
      }
    } catch (error) {
      toast.error(error.message || "Failed to delete file");
    }
  };
  

  const dropdownOptions = (file) => [
    { label: "View", onClick: () => handleView(file) },
    { label: "Download", onClick: () => handleDownload(file) },
    { label: "Share", onClick: () => handleShare(file) },
    { label: "Rename", onClick: () => handleOpenRenameModal(file) },
    { label: "Delete", onClick: () => { setFileToDelete(file); setDeleteModalOpen(true); } }  // Add Delete option
  ];

  return (
    <Box sx={{ padding: 4 }}>
      {/* Heading */}
      <Typography className="capitalize" variant="h4" component="h1" sx={{ marginBottom: 2 }}>
        {type}
      </Typography>

      {/* Total Space */}
      <Paper sx={{ padding: 3, marginBottom: 4, boxShadow: 3 }}>
        <Typography variant="h6" sx={{ marginBottom: 1 }}>
          Total Space:
          <Typography variant="body1" component="b" sx={{ marginLeft: 1 }}>
            {allData.reduce((acc, file) => acc + file.size, 0) / 1e6} MB
          </Typography>
        </Typography>

        {/* Sort By Selector */}
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Typography variant="body1">Sort by:</Typography>
          </Grid>
          <Grid item>
            <FormControl variant="outlined" sx={{ minWidth: 120 }}>
              <InputLabel>Sort By</InputLabel>
              <Select value={sortBy} onChange={handleSortChange} label="Sort By">
                <MenuItem value="size">Size</MenuItem>
                <MenuItem value="date">Date</MenuItem>
                <MenuItem value="name">Name</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item>
            <FormControl variant="outlined" sx={{ minWidth: 120 }}>
              <InputLabel>Order</InputLabel>
              <Select value={orderDirection} onChange={handleOrderDirectionChange} label="Order">
                <MenuItem value="asc">Ascending</MenuItem>
                <MenuItem value="desc">Descending</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Files Section */}
      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        Files:
      </Typography>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px" }}>
          <CircularProgress />
        </Box>
      ) : filteredFiles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedFiles.map((file) => (
            <Paper
              sx={{
                padding: 3,
                marginBottom: 2,
                boxShadow: 2,
                borderRadius: 2,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                transition: "0.3s ease",
                "&:hover": {
                  boxShadow: 6,
                },
              }}
              key={file.id}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      backgroundColor: "#ff2424",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <ArticleIcon sx={{ color: "white", fontSize: 30 }} />
                  </div>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {file.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {file.size} MB
                    </Typography>
                  </Box>
                </Box>
                <DropdownMenu options={dropdownOptions(file)} />
              </Box>
            </Paper>
          ))}
        </div>
      ) : (
        <Typography variant="body1" color="textSecondary">
          No files available.
        </Typography>
      )}

      {/* Pagination */}
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
        <Pagination
          count={Math.ceil(filteredFiles.length / filesPerPage)}
          page={page}
          onChange={handlePaginationChange}
          color="primary"
        />
      </Box>

      {/* Rename Modal */}
      <Dialog open={renameModalOpen} onClose={handleCloseRenameModal}>
        <DialogTitle>Rename File</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            label="New File Name"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRenameModal} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleRenameFile} color="primary">
            Rename
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <DialogTitle>Delete File</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete this file? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteModalOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDeleteFile} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Storage;
