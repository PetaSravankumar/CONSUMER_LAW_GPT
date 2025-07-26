import React, { useState } from 'react';
import { UserCircle, Settings, LogOut } from 'lucide-react';

interface ProfileMenuProps {
  onLogout: () => void;
}

const ProfileMenu = ({ onLogout }: ProfileMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 focus:outline-none"
      >
        <img
          src="/default-avatar.png" // ✅ Replaced with local default avatar
          alt="Profile"
          className="h-8 w-8 rounded-full object-cover"
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 z-10">
          <div className="transition ease-out duration-100 transform opacity-100 scale-100">
            <div className="px-4 py-2 border-b">
              <p className="text-sm font-medium text-gray-900">John Doe</p>
              <p className="text-xs text-gray-500">john@example.com</p>
            </div>

            <button
              className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <UserCircle className="mr-3 h-5 w-5 text-gray-400" />
              Account Details
            </button>

            <button
              className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <Settings className="mr-3 h-5 w-5 text-gray-400" />
              Settings
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                onLogout(); // 🔴 Actual logout function
              }}
              className="flex w-full items-center px-4 py-2 text-sm text-red-700 hover:bg-gray-100"
            >
              <LogOut className="mr-3 h-5 w-5 text-red-400" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
