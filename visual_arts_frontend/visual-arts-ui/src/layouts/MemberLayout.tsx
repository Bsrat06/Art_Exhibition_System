import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Menu, X } from "lucide-react";
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
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 animate-[fadeIn_0.5s_ease-in]">
        {/* Sidebar: Hidden on mobile, visible on md+ */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 transform transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          aria-hidden={!isSidebarOpen && !window.matchMedia("(min-width: 768px)").matches}
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Menu</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="md:hidden text-sm"
              aria-label="Close sidebar"
            >
              <X className="w-3.5 h-3.5 text-gray-900 dark:text-gray-100" />
            </Button>
          </div>
          <MemberSidebar />
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 bg-gray-50 dark:bg-gray-900">
          {/* Sticky Header */}
          <header className="sticky top-0 z-40 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleSidebar}
                  className="md:hidden text-sm"
                  aria-label="Open sidebar"
                  aria-controls="sidebar"
                >
                  <Menu className="w-3.5 h-3.5 text-gray-900 dark:text-gray-100" />
                </Button>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Member Dashboard</h1>
              </div>
              <div className="flex items-center gap-4">
                {user && (
                  <div className="flex items-center gap-2">
                    {user.profile_picture ? (
                      <img
                        src={user.profile_picture}
                        alt={`${user.first_name} ${user.last_name}`}
                        className="w-8 h-8 rounded-full border-2 border-teal-500 dark:border-teal-600 object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-teal-500 dark:bg-teal-600 flex items-center justify-center text-sm font-semibold text-white">
                        {user.first_name[0]}
                      </div>
                    )}
                    <span className="text-sm text-gray-900 dark:text-gray-100 hidden sm:inline">
                      {user.first_name} {user.last_name}
                    </span>
                  </div>
                )}
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
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <LogoutButton />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>Log out</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </header>

          {/* Outlet for page content */}
          <div className="max-w-4xl mx-auto">
            <Outlet />
          </div>
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