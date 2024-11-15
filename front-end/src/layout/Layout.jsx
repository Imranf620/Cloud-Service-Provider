import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/navbar/Navbar";
import SideBar from "../components/sidebar/SideBar";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { Outlet } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const Layout = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [show, setShow] = useState(false);
  

  const sidebarRef = useRef(null); 
  const navbarRef = useRef(null);

  const theme = createTheme({
    palette: {
      mode: isDarkMode ? "dark" : "light",
    },
  });

  const handleToggle = () => setShow(!show);

  useEffect(() => {
    // Close sidebar if the user clicks outside of it
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target) && !navbarRef.current.contains(event.target)  ) {
        setShow(false); // Close the sidebar
      }
    };

    // Add event listener to document
    document.addEventListener("click", handleClickOutside);

    // Clean up the event listener
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="flex flex-col">
        <div ref={navbarRef}>

        <Navbar
          handleToggle={handleToggle}
          toggleDarkMode={toggleDarkMode}
          isDarkMode={isDarkMode}
          />
          </div>
        <div className="flex h-[91.4vh] overflow-y-hidden">
          <div
            ref={sidebarRef} 
            className={`z-50  md:w-64 duration-300 fixed md:static top-0 left-0 w-0 ${
              show
                ? "translate-x-0  md:w-64"
                : "w-0 -translate-x-64 md:translate-x-0"
            }`}
          >
            <SideBar handleToggle={handleToggle} />
          </div>
          <div className={`flex-1 p-4 h-full overflow-y-auto ${isDarkMode?"bg-black":"bg-gray-200"}`}>
            <Outlet />
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Layout;
