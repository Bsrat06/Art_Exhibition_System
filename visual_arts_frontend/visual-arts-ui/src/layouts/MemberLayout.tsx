import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Menu, X, Search } from "lucide-react";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "../components/ui/tooltip";
import { Button } from "../components/ui/button";
import MemberSidebar from "../components/member/MemberSidebar";
import NotificationBell from "../components/common/NotificationBell";
import LogoutButton from "../components/common/LogoutButton";
import ThemeToggle from "../components/common/ThemeToggle";
import API from "../lib/api";

type User = {
  first_name: string;
  last_name: string;
  profile_picture: string | null;
};

export default function MemberLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch user data
  useEffect(() => {
    API.get("/auth/user/")
      .then((res) => {
        setUser({
          first_name: res.data.first_name || "User",
          last_name: res.data.last_name || "",
          profile_picture: res.data.profile_picture || null,
        });
      })
      .catch(() => {
        console.warn("Failed to fetch user data");
      });
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <TooltipProvider>
      <div className="flex min-h-screen bg-gray-100 dark:bg-gray-950">
        {/* Sidebar */}
        <MemberSidebar />

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
            <div className="px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleSidebar}
                  className="md:hidden text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                  aria-label="Open sidebar"
                  aria-controls="sidebar"
                >
                  <Menu className="w-5 h-5" />
                </Button>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400 dark:text-gray-300" />
                  <input
                    type="text"
                    placeholder="Search member panel..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md leading-5 bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-center gap-6">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <ThemeToggle />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>Toggle theme</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <NotificationBell />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>View notifications</TooltipContent>
                </Tooltip>
                <div className="relative">
                  <button
                    onClick={() => setIsSidebarOpen(false)} // Close sidebar on user menu click
                    className="flex items-center focus:outline-none"
                    aria-label="User menu"
                  >
                    {user && (
                      <>
                        {user.profile_picture ? (
                          <img
                            src={user.profile_picture}
                            alt={`${user.first_name} ${user.last_name}`}
                            className="w-8 h-8 rounded-full border-2 border-blue-500 dark:border-blue-600 object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-blue-500 dark:bg-blue-600 flex items-center justify-center text-white font-bold">
                            {user.first_name[0]}
                          </div>
                        )}
                        <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300 hidden md:inline">
                          {user.first_name} {user.last_name}
                        </span>
                      </>
                    )}
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg py-1 z-10">
                    <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                      <p className="font-medium">{user?.first_name} {user?.last_name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Member</p>
                    </div>
                    <LogoutButton />
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-950">
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </div>

          {/* Footer */}
          <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-4 px-6">
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <div>
                Member Panel v2.1.0 | © {new Date().getFullYear()} Art Gallery CMS
              </div>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-gray-700 dark:hover:text-gray-300">Privacy</a>
                <a href="#" className="hover:text-gray-700 dark:hover:text-gray-300">Terms</a>
                <a href="#" className="hover:text-gray-700 dark:hover:text-gray-300">Help</a>
              </div>
            </div>
          </footer>
        </main>

        {/* Overlay for mobile sidebar */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={toggleSidebar}
            aria-hidden="true"
          />
        )}
      </div>
    </TooltipProvider>
  );
}