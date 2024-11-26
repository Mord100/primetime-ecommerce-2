import React, { useState, useRef, useEffect } from 'react';
import { FaRegUser, FaHistory, FaSignOutAlt, FaCog } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const UserDropdown = ({ logoutHandler, username }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Toggle dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Dropdown menu items
  const menuItems = [
    {
      text: 'Account',
      to: '/account',
      className: ' hover:text-blue-700'
    },
    {
      text: 'Order History', 
      to: '/order-history',
      className: ' hover:text-green-700'
    },
    {
      text: 'Sign out',
      onClick: logoutHandler,
      className: 'hover:bg-red-50 hover:text-red-700 text-red-600'
    }
  ];

  return (
    <div 
      ref={dropdownRef} 
      className="relative inline-block font-poppins"
    >
      {/* Dropdown Trigger */}
      <button 
        onClick={toggleDropdown}
        className="flex items-center p-2 rounded-full 
        hover:bg-gray-100 transition-all duration-200 
        "
      >
        <FaCog className="h-5 w-5 text-gray-600" />
        <span className="text-sm">{username}</span>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          className={`h-4 w-4 transform transition-transform duration-200 
            ${isOpen ? 'rotate-180' : ''}`}
        >
          <path fill="currentColor" d="M7 10l5 5 5-5z"/>
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-56 bg-white 
          rounded-md shadow-md border border-gray-100 
          ring-1 ring-black ring-opacity-5 
          overflow-hidden animate-dropdown-slide"
        >
          {menuItems.map((item, index) => (
            <React.Fragment key={item.text}>
              {item.to ? (
                <Link
                  to={item.to}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center px-4 py-2.5 text-sm 
                  text-gray-700 transition-colors duration-150 
                  group ${item.className}`}
                >
                  <span className="mr-3 text-gray-400 group-hover:text-current">
                    {item.icon}
                  </span>
                  {item.text}
                </Link>
              ) : (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    item.onClick();
                  }}
                  className={`w-full flex items-center px-4 py-2.5 text-sm 
                  transition-colors duration-150 text-left 
                  group ${item.className}`}
                >
                  <span className="mr-3 text-gray-400 group-hover:text-current">
                    {item.icon}
                  </span>
                  {item.text}
                </button>
              )}
              {index < menuItems.length - 1 && (
                <div className="border-t border-gray-100"></div>
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDropdown;