import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
} from '@mui/material';
import ArticleIcon from '@mui/icons-material/Article';
import DropdownMenu from '../../components/dropdownMenu/DropdownMenu';

// Dummy Data
const sampleFiles = [
  { id: 1, name: 'Article.pdf', size: 5, date: '2024-11-10' },
  { id: 2, name: 'Photo.jpg', size: 2, date: '2024-11-12' },
  { id: 3, name: 'Presentation.ppt', size: 10, date: '2024-11-08' },
  { id: 4, name: 'Video.mp4', size: 25, date: '2024-11-09' },
];

const Storage = () => {
  const { type } = useParams();
  const [files, setFiles] = useState(sampleFiles);
  const [sortBy, setSortBy] = useState('size');
  const [filteredFiles, setFilteredFiles] = useState(sampleFiles);
  const [page, setPage] = useState(1);
  const filesPerPage = 2;

  const handleOptionClick = (option) => {
    console.log(`${option} clicked`);
  };

  const dropdownOptions = [
    { label: 'View', onClick: () => handleOptionClick('View') },
    { label: 'Download', onClick: () => handleOptionClick('Download') },
    { label: 'Delete', onClick: () => handleOptionClick('Delete') },
    { label: 'Share', onClick: () => handleOptionClick('Share') },
    { label: 'Rename', onClick: () => handleOptionClick('Rename') },
  ];

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const handlePaginationChange = (event, value) => {
    setPage(value);
  };

  useEffect(() => {
    let sortedFiles = [...files];
    if (sortBy === 'size') {
      sortedFiles.sort((a, b) => a.size - b.size);
    } else if (sortBy === 'date') {
      sortedFiles.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    setFilteredFiles(sortedFiles);
  }, [sortBy, files]);

  const paginatedFiles = filteredFiles.slice((page - 1) * filesPerPage, page * filesPerPage);

  return (
    <Box sx={{ padding: 4 }}>
      {/* Heading */}
      <Typography className="capitalize" variant="h4" component="h1" sx={{ marginBottom: 2 }}>
        {type}
      </Typography>
      <Paper sx={{ padding: 3, marginBottom: 4, boxShadow: 3 }}>
        <Typography variant="h6" sx={{ marginBottom: 1 }}>
          Total Space:
          <Typography variant="body1" component="b" sx={{ marginLeft: 1 }}>
            12 GB
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
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Files Section */}
      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        Files:
      </Typography>

      {/* List of Files */}
      {filteredFiles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedFiles.map((file) => (
            <Paper
              sx={{
                padding: 3,
                marginBottom: 2,
                boxShadow: 2,
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: '0.3s ease',
                '&:hover': {
                  boxShadow: 6,
                },
              }}
              key={file.id}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <div
                    style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      backgroundColor: '#ff2424',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <ArticleIcon sx={{ color: 'white', fontSize: 30 }} />
                  </div>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {file.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {file.date}
                    </Typography>
                  </Box>
                </Box>
                <DropdownMenu options={dropdownOptions} />
              </Box>

              <Box
                sx={{
                  marginTop: 2,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {file.size} GB
                </Typography>
                <Box
                  sx={{
                    backgroundColor: '#e0e0e0',
                    borderRadius: '12px',
                    padding: '2px 10px',
                    fontSize: '12px',
                    color: '#616161',
                  }}
                >
                  File Size
                </Box>
              </Box>
            </Paper>
          ))}
        </div>
      ) : (
        <Typography variant="body1" sx={{ textAlign: 'center', padding: 3 }}>
          No files available in this category.
        </Typography>
      )}

      {/* Pagination */}
      <Pagination
        count={Math.ceil(filteredFiles.length / filesPerPage)}
        page={page}
        onChange={handlePaginationChange}
        sx={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}
      />
    </Box>
  );
};

export default Storage;
