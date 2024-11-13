import React from 'react';
import { List, ListItem, ListItemText, Divider, ListItemIcon } from '@mui/material';
import { Folder, Image, Description, Movie, FileCopy, Dashboard } from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const SideBar = () => {
  const { isDarkMode } = useTheme();
  const location = useLocation();

  const getLinkClass = (path) => {
    return location.pathname === path ? 'bg-[#681c75]' : '';
  };

  return (
    <div
      className={`w-64 fixed h-screen text-white ${isDarkMode ? 'bg-[#303030]' : 'bg-[#9C27B0]'}`}
    >
      <List>
        <ListItem button component={Link} to="/dashboard" className={getLinkClass('/dashboard')}>
          <ListItemIcon>
            <Dashboard style={{ color: 'white' }} />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button component={Link} to="/files" className={getLinkClass('/files')}>
          <ListItemIcon>
            <Folder style={{ color: 'white' }} />
          </ListItemIcon>
          <ListItemText primary="Files" />
        </ListItem>
        <Divider />
        <ListItem button component={Link} to="/images" className={getLinkClass('/images')}>
          <ListItemIcon>
            <Image style={{ color: 'white' }} />
          </ListItemIcon>
          <ListItemText primary="Images" />
        </ListItem>
        <Divider />
        <ListItem button component={Link} to="/documents" className={getLinkClass('/documents')}>
          <ListItemIcon>
            <Description style={{ color: 'white' }} />
          </ListItemIcon>
          <ListItemText primary="Documents" />
        </ListItem>
        <Divider />
        <ListItem button component={Link} to="/media" className={getLinkClass('/media')}>
          <ListItemIcon>
            <Movie style={{ color: 'white' }} />
          </ListItemIcon>
          <ListItemText primary="Media" />
        </ListItem>
        <Divider />
        <ListItem button component={Link} to="/other" className={getLinkClass('/other')}>
          <ListItemIcon>
            <FileCopy style={{ color: 'white' }} />
          </ListItemIcon>
          <ListItemText primary="Other" />
        </ListItem>
      </List>
    </div>
  );
};

export default SideBar;
