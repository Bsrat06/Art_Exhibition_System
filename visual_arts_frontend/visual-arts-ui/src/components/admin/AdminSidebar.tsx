import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FiSearch, FiPlus, FiFileText } from "react-icons/fi";
import { ChevronLeft, ChevronRight } from "lucide-react";

const links = [
  { name: "Dashboard", path: "/admin/dashboard", icon: "🏠" },
  { name: "Members", path: "/admin/members", icon: "👥" },
  { name: "Artworks", path: "/admin/artworks", icon: "🎨" },
  { name: "Events", path: "/admin/events", icon: "📅" },
  { name: "Projects", path: "/admin/projects", icon: "📊" },
  { name: "Notifications", path: "/admin/notifications", icon: "🔔" },
  { name: "Reports", path: "/admin/reports", icon: "📈" },
  { name: "Settings", path: "/admin/settings", icon: "⚙️" },
];

const secondaryLinks = [
  { name: "Help Center", path: "/admin/help", icon: "❓" },
  { name: "Admin Profile", path: "/admin/profile", icon: "👤" },
];

export default function AdminSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  const filteredLinks = links.filter(link =>
    link.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside
      className={`${
        isCollapsed ? "w-20" : "w-72"
      } bg-gradient-to-b from-gray-800 to-gray-900 dark:from-gray-900 dark:to-gray-950 h-screen flex flex-col border-r border-gray-700 transition-all duration-300 ease-in-out sticky top-0 shadow-xl`}
    >
      {/* Header Section */}
      <div className="p-4 flex items-center justify-between border-b border-gray-700">
        {!isCollapsed && (
          <div className="flex items-center space-x-3">
            <span className="text-2xl">🛠</span>
            <h2 className="text-xl font-bold text-white">Admin Console</h2>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-full hover:bg-gray-700/50 text-gray-300 hover:text-white transition-colors"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-2 py-4 custom-scrollbar">
        {/* Search Bar */}
        {!isCollapsed && (
          <div className="px-4 pb-3">
            <div className="relative">
              <FiSearch className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-1 rounded-lg bg-gray-800/50 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>
        )}

        {/* Main Navigation */}
        <nav className="space-y-1">
          {filteredLinks.map(link => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center px-3 py-3 rounded-md text-sm font-medium transition-all duration-200 group relative ${
                  isActive
                    ? "bg-blue-600/20 text-blue-400 border-l-4 border-blue-400"
                    : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                }`
              }
            >
              <span className="mr-3 text-lg">{link.icon}</span>
              {!isCollapsed && <span>{link.name}</span>}
              {isCollapsed && (
                <span className="absolute left-full ml-2 px-2 py-1 text-xs bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {link.name}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Quick Actions */}
        {!isCollapsed && (
          <div className="mt-6 px-4">
            <h3 className="text-sm font-semibold text-gray-400 mb-2">Quick Actions</h3>
            <div className="space-y-1">
              <button className="w-full flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700/50 hover:text-white transition-colors">
                <FiPlus className="w-5 h-5 mr-3" />
                Add New User
              </button>
              <button className="w-full flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700/50 hover:text-white transition-colors">
                <FiFileText className="w-5 h-5 mr-3" />
                Generate Report
              </button>
            </div>
          </div>
        )}

        {/* Secondary Navigation */}
        <nav className="mt-6 space-y-1">
          {secondaryLinks.map(link => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 group relative ${
                  isActive
                    ? "bg-gray-700 text-white"
                    : "text-gray-400 hover:bg-gray-700/50 hover:text-white"
                }`
              }
            >
              <span className="mr-3 text-lg">{link.icon}</span>
              {!isCollapsed && <span>{link.name}</span>}
              {isCollapsed && (
                <span className="absolute left-full ml-2 px-2 py-1 text-xs bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {link.name}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

     
      {/* Custom Scrollbar Styles */}
      <style>
        {`
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.2);
            border-radius: 4px;
            transition: background 0.2s;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.3);
          }
          .dark .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.3);
          }
          .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.4);
          }
        `}
      </style>
    </aside>
  );
}