import React, { useState, useEffect, useRef } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const DropdownMenu = ({ options }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const iconRef = useRef(null);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !iconRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative">
      <button ref={iconRef} onClick={toggleMenu}>
       <MoreVertIcon/>
      </button>

      {isMenuOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 mt-2 bg-white border border-gray-200 shadow-lg rounded-md w-40"
        >
          {options.map((option, index) => (
            <button
              key={index}
              className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
              onClick={option.onClick}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
