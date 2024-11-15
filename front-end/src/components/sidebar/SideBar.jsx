import React from 'react';
import { List, ListItem, ListItemText, Divider, ListItemIcon } from '@mui/material';
import { Folder, Image, Description, Movie, FileCopy, Dashboard } from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const SideBar = ({handleToggle}) => {
  const { isDarkMode } = useTheme();
  const location = useLocation();

  const sidebarItems = [
    { path: '/', label: 'Dashboard', icon: <Dashboard style={{ color: 'white' }} /> },
    { path: '/dashboard/files', label: 'Files', icon: <Folder style={{ color: 'white' }} /> },
    { path: '/dashboard/images', label: 'Images', icon: <Image style={{ color: 'white' }} /> },
    { path: '/dashboard/documents', label: 'Documents', icon: <Description style={{ color: 'white' }} /> },
    { path: '/dashboard/media', label: 'Media', icon: <Movie style={{ color: 'white' }} /> },
    { path: '/dashboard/other', label: 'Other', icon: <FileCopy style={{ color: 'white' }} /> },
  ];

  const getLinkClass = (path) => {
    return location.pathname === path ? 'bg-[#681c75]' : '';
  };

  return (
    <div
      className={`w-64 fixed h-screen text-white ${isDarkMode ? 'bg-[#303030]' : 'bg-[#9C27B0]'}`}
    >
      <List>
        {sidebarItems.map((item, index) => (
          <React.Fragment key={index}>
            <ListItem onClick={handleToggle} button component={Link} to={`${item.path}`} className={getLinkClass(item.path)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItem>
            {index < sidebarItems.length - 1 && <Divider />} 
          </React.Fragment>
        ))}
      </List>
    </div>
  );
};

export default SideBar;
