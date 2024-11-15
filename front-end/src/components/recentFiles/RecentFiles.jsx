import React from "react";
import ArticleIcon from "@mui/icons-material/Article";
import DropdownMenu from "../dropdownMenu/DropdownMenu"; 
import { useTheme } from "../../context/ThemeContext";

const RecentFiles = () => {
  const {isDarkMode} = useTheme()

  const handleOptionClick = (option) => {
    console.log(`${option} clicked`);
  };

  const dropdownOptions = [
    { label: "View", onClick: () => handleOptionClick("View") },
    { label: "Download", onClick: () => handleOptionClick("Download") },
    { label: "Delete", onClick: () => handleOptionClick("Delete") },
    { label: "Share", onClick: () => handleOptionClick("Share") },
    { label: "Rename", onClick: () => handleOptionClick("Rename") },
  ];

  return (
    <div className={`p-6 ${isDarkMode?"bg-[#272727]":"bg-gray-50"} rounded-lg shadow-md`}>
      <h1 className="text-2xl font-semibold mb-4">Recent Files Uploaded</h1>
      <div className={`flex w-full justify-between items-center ${isDarkMode?"bg-black":"bg-white"}  p-4 rounded-lg shadow-md`}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center shadow-md">
            <ArticleIcon className="text-white text-xl cursor-pointer" />
          </div>
          <div>
            <p className=" text-sm font-medium">Article.pdf</p>
            <h2 className=" text-xs">4:15 AM, 10 Nov</h2>
          </div>
        </div>

        {/* Use the DropdownMenu component */}
        <DropdownMenu options={dropdownOptions} />
      </div>
    </div>
  );
};

export default RecentFiles;
