import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar";
import NotificationBell from "../components/common/NotificationBell";
import ThemeToggle from "../components/common/ThemeToggle";
import { FiSearch, FiLogOut } from "react-icons/fi";
import { useState } from "react";

export default function AdminLayout() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-950">
      <AdminSidebar />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
          <div className="px-6 py-4 flex justify-between items-center">
            <div className="relative w-64">
              {/* <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div> */}
              {/* <input
                type="text"
                placeholder="Search admin panel..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md leading-5 bg-white dark:bg-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              /> */}
            </div>
            
            <div className="flex items-center space-x-6">
              <ThemeToggle />
              <NotificationBell />
              
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center focus:outline-none"
                  aria-label="User menu"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                    A
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300 hidden md:inline">
                    Admin User
                  </span>
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg py-1 z-10">
                    <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                      <p className="font-medium">Admin User</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Super Admin</p>
                    </div>
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                      onClick={() => {
                        // Add sign-out logic here
                        setIsDropdownOpen(false);
                      }}
                    >
                      <FiLogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-950">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
        
        <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-4 px-6">
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <div>
              Admin Panel v2.1.0 | © {new Date().getFullYear()} Art Gallery CMS
            </div>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-gray-700 dark:hover:text-gray-300">Privacy</a>
              <a href="#" className="hover:text-gray-700 dark:hover:text-gray-300">Terms</a>
              <a href="#" className="hover:text-gray-700 dark:hover:text-gray-300">Help</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}