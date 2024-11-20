import React, { useEffect, useState } from "react";
import ArticleIcon from "@mui/icons-material/Article";
import DropdownMenu from "../dropdownMenu/DropdownMenu"; 
import { useTheme } from "../../context/ThemeContext";
import { useDispatch } from "react-redux";
import { getLatestFiles, deleteFile, editFileName } from "../../features/filesSlice";
import { toast } from "react-toastify";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button ,TextField} from "@mui/material";

const RecentFiles = () => {
  const [recentFiles, setRecentFiles] = useState([]);
  const { isDarkMode } = useTheme();
  const dispatch = useDispatch();
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);

  useEffect(() => {
    const fetchLatestFiles = async () => {
      try {
        const files = await dispatch(getLatestFiles());
        setRecentFiles(files.payload.data);
      } catch (error) {
        toast.error("Failed to fetch files");
      }
    };
    fetchLatestFiles();
  }, [dispatch]);

  const handleOptionClick = (option, file) => {
    switch (option) {
      case "View":
        handleView(file);
        break;
      case "Download":
        handleDownload(file);
        break;
      case "Delete":
        handleDelete(file);
        break;
      case "Share":
        handleShare(file);
        break;
      case "Rename":
        handleRename(file);
        break;
      default:
        break;
    }
  };

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

  const handleDelete = (file) => {
    setSelectedFile(file);
    setDeleteConfirmationOpen(true);
  };

  const confirmDelete = async () => {
    try {
      console.log(selectedFile.id)
    const result  =   await dispatch(deleteFile(selectedFile.id));
    console.log(result)
      setRecentFiles((prevFiles) => prevFiles.filter((f) => f.id !== selectedFile.id));
      result.payload.success===true?toast.success(`${selectedFile.name} deleted successfully`):toast.error("Error deleting file")
    } catch (error) {
      toast.error("Failed to delete file");
    } finally {
      setDeleteConfirmationOpen(false);
    }
  };

  const handleShare = (file) => {
    const shareUrl = `${import.meta.env.VITE_API_URL}/../../${file.path}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success("File link copied to clipboard!");
  };

  const handleRename = (file) => {
    setSelectedFile(file);
    setNewName(file.name);
    setRenameModalOpen(true);
  };

  const handleRenameFile = async () => {
    if (!newName) return;
    try {
      const response = await dispatch(editFileName({ fileId: selectedFile.id, newName }));
      if (response.payload?.success) {
        toast.success("File renamed successfully");
        setRecentFiles((prevFiles) =>
          prevFiles.map((file) =>
            file.id === selectedFile.id ? { ...file, name: newName } : file
          )
        );
      } else {
        toast.error(response.payload.message);
      }
    } catch (error) {
      toast.error(error.message || "Failed to rename file");
    } finally {
      setRenameModalOpen(false);
    }
  };

  const dropdownOptions = (file) => [
    { label: "View", onClick: () => handleOptionClick("View", file) },
    { label: "Download", onClick: () => handleOptionClick("Download", file) },
    { label: "Delete", onClick: () => handleOptionClick("Delete", file) },
    { label: "Share", onClick: () => handleOptionClick("Share", file) },
    { label: "Rename", onClick: () => handleOptionClick("Rename", file) },
  ];

  return (
    <div className={`p-6 ${isDarkMode ? "bg-[#272727]" : "bg-gray-50"} rounded-lg shadow-md`}>
      <h1 className="text-2xl font-semibold mb-4">Recent Files Uploaded</h1>
      <div className="flex flex-wrap gap-4">
        {recentFiles.map((file) => (
          <div key={file.id} className={`flex w-full justify-between items-center ${isDarkMode ? "bg-black" : "bg-white"} p-4 rounded-lg shadow-md`}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center shadow-md">
                <ArticleIcon className="text-white text-xl cursor-pointer" />
              </div>
              <div>
                <p className=" text-sm font-medium">{file.name}</p>
                <h2 className=" text-xs">{new Date(file.updatedAt).toLocaleTimeString()}, {new Date(file.updatedAt).toLocaleDateString()}</h2>
              </div>
            </div>
            <DropdownMenu options={dropdownOptions(file)} />
          </div>
        ))}
      </div>

      {/* Rename File Modal */}
      <Dialog open={renameModalOpen} onClose={() => setRenameModalOpen(false)}>
        <DialogTitle>Rename File</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="New File Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRenameModalOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleRenameFile} color="primary">
            Rename
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmationOpen} onClose={() => setDeleteConfirmationOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to delete {selectedFile?.name}?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmationOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default RecentFiles;
