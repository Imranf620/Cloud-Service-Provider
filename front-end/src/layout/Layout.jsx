
import React, { useState } from 'react';
import Navbar from '../components/navbar/Navbar';
import SideBar from '../components/sidebar/SideBar';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext'; 

const Layout = () => {
  const { isDarkMode, toggleDarkMode } = useTheme(); 
  const [show, setShow] = useState(false)

  const theme = createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
    },
  });
  const handleToggle = () => setShow(!show);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="flex flex-col ">
        <Navbar handleToggle={handleToggle} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
        <div className="flex">
          <div className={`  md:w-64 duration-300 sticky md:static w-64 ${show?"translate-x-0":" -translate-x-64 md:translate-x-0"}`}>
            <SideBar />
          </div>
          <div className="flex-1 p-4 ">
            <Outlet />
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Layout;
